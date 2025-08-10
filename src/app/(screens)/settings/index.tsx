import { useEffect, useState } from "react";
import { Alert, StyleSheet, View, Switch, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { StackActions, useNavigation } from "@react-navigation/native";

import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

import { Container, Icons, Text, TouchableButton } from "@/components";
import { FONT_SIZES, SPACINGS } from "@/constants/sizes";
import { useBackupRestoreData } from "@/queries/useBackupRestoreData";
import { BackupRestoreType } from "@/database/exportsSchema";
import { resetDatabase, setupDatabase } from "@/database";
import { useUserAccount } from "@/context/UserAccountContext";
import { queryClient } from "@/queries/queryClient";

const Settings = () => {
  const { theme, isMaterialYou, setIsMaterialYou } = useUserAccount();
  const db = useSQLiteContext();
  const router = useRouter();
  const navigation = useNavigation();
  const {
    exportedData,
    isExporting,
    exportError,
    triggerExport,
    isRestoring,
    restoreError,
    triggerRestore,
  } = useBackupRestoreData(db);

  const [shouldTriggerExportAction, setShouldTriggerExportAction] = useState<
    "share" | "download" | null
  >(null);

  const handleExportAction = async (
    data: any,
    action: "share" | "download",
  ) => {
    if (!data) {
      Alert.alert("Error", "No data to export.");
      return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const fileName = "exported_xpncfy_data.json";

    if (!FileSystem || !Sharing) {
      Alert.alert("Error", "File system or sharing modules not loaded.");
      return;
    }
    const fileUri = FileSystem.cacheDirectory + fileName;
    try {
      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (action === "share") {
        if (!(await Sharing.isAvailableAsync())) {
          Alert.alert(
            "Sharing not available",
            "Sharing files is not supported on this device.",
          );
          return;
        }
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Share your finance data",
          UTI: "public.json",
        });
        Alert.alert("Success", "Data exported and sharing dialog opened!");
      } else if (action === "download") {
        if (Platform.OS === "android") {
          const permissions =
            await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (permissions.granted) {
            const directoryUri = permissions.directoryUri;
            const newFileUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                directoryUri,
                fileName,
                "application/json",
              );
            await FileSystem.writeAsStringAsync(newFileUri, jsonString);
            Alert.alert(
              "Download Successful",
              `File saved to: ${directoryUri.split("%2F").pop() || "Downloads"}`,
            );
          } else {
            Alert.alert(
              "Permission Denied",
              "Cannot save file without storage permissions.",
            );
          }
        }
      }
    } catch (err: any) {
      console.error("Error with export action (Native):", err);
      Alert.alert("Error", `Failed to complete action: ${err.message}`);
    } finally {
      // Clean up the temporary file if it was created
      try {
        if (await FileSystem.getInfoAsync(fileUri)) {
          await FileSystem.deleteAsync(fileUri);
        }
      } catch (e) {
        console.warn("Failed to delete temp file:", e);
      }
    }
  };

  useEffect(() => {
    if (
      shouldTriggerExportAction &&
      exportedData &&
      !isExporting &&
      !exportError
    ) {
      handleExportAction(exportedData, shouldTriggerExportAction);
      setShouldTriggerExportAction(null);
    } else if (exportError) {
      Alert.alert(
        "Export Failed",
        exportError.message || "An unknown error occurred during export.",
      );
      setShouldTriggerExportAction(null); // Reset
    }
  }, [shouldTriggerExportAction, exportedData, isExporting, exportError]);

  // --- 1. Share Data Function ---
  const handleShareData = async () => {
    if (!isExporting) {
      await triggerExport();
      setShouldTriggerExportAction("share");
    }
  };

  // --- 2. Download Data Function ---
  const handleDownloadData = async () => {
    if (!isExporting) {
      await triggerExport();
      setShouldTriggerExportAction("download");
    }
  };

  // --- 3. Restore Data Function ---
  const handleRestoreData = async () => {
    if (isExporting || isRestoring) {
      return Alert.alert(
        "Action in progress",
        "Please wait for the current operation to finish.",
      );
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets[0]?.uri) {
        console.log("Document picking cancelled or URI not found.");
        return;
      }

      const asset = result.assets[0];

      const jsonString = await FileSystem.readAsStringAsync(asset.uri);
      const parsedData: BackupRestoreType = JSON.parse(jsonString);

      await triggerRestore(parsedData);
      Alert.alert("Restore Successful", "Your data has been restored.");
    } catch (err: any) {
      console.error("Restore failed:", err);
      Alert.alert(
        "Restore Failed",
        `Failed to import data: ${err.message || "Invalid file format."}`,
      );
    }
  };

  const handleResetAccount = () => {
    Alert.alert(
      "Reset Account",
      `Resetting the acount will remove your data and reset all settings which can't be backup.\n\nMake sure to take backup of your data (accounts, categories, and transactions).\n\nAre you sure you want to reset the account ?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetDatabase(db);
            await setupDatabase(db);
            await queryClient.invalidateQueries();

            navigation.dispatch(
              StackActions.replace("(tabs)", { screen: "HomeScreen" }),
            );
          },
        },
      ],
    );
  };

  return (
    <Container paddingVertical={16}>
      <Stack.Screen
        options={{
          title: "Settings",
          headerTitleStyle: {
            color: theme.onSurface,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerLeft: () => (
            <TouchableButton
              onPress={() => router.back()}
              style={{
                paddingRight: SPACINGS.md,
              }}
            >
              <Icons name="arrow-back" color={theme.onSurface} />
            </TouchableButton>
          ),
        }}
      />
      <View style={{ display: "flex", gap: 16 }}>
        <View style={styles.segmentContainer}>
          <Text color={theme.primary}>Colors & UI </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              <Icons name="color-palette" color={theme.secondary} />
              <Text color={theme.secondary}>Material You</Text>
            </View>
            <Switch value={isMaterialYou} onValueChange={setIsMaterialYou} />
          </View>
        </View>
        <View style={styles.segmentContainer}>
          <Text color={theme.primary}>Backup and Restore</Text>
          <Text color={theme.secondary} size={FONT_SIZES.caption}>
            Backup, Restore or Share you expenses, accounts & categories as CSV
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <TouchableButton
              onPress={handleDownloadData}
              disabled={isExporting || isRestoring}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icons name="progress-download" color={theme.secondary} />
              <Text color={theme.secondary}>Backup</Text>
            </TouchableButton>
            <TouchableButton
              onPress={handleRestoreData}
              disabled={isExporting || isRestoring}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Icons name="restore" color={theme.secondary} />
              <Text color={theme.secondary}>Restore</Text>
            </TouchableButton>
            <TouchableButton
              onPress={handleShareData}
              disabled={isExporting || isRestoring}
              style={{ display: "flex", flexDirection: "row", gap: 8 }}
            >
              <Icons name="share" color={theme.secondary} />
              <Text color={theme.secondary}>Share</Text>
            </TouchableButton>
          </View>

          {restoreError && (
            <Text color={theme.error} size={FONT_SIZES.caption}>
              Restore Error: {restoreError.message}
            </Text>
          )}
        </View>
        <View style={[styles.segmentContainer, { borderColor: theme.error }]}>
          <Text color={theme.error}>Danger Zone</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableButton
              onPress={handleResetAccount}
              style={{ display: "flex", flexDirection: "row", gap: 8 }}
            >
              <Icons name="delete-alert" color={theme.error} />
              <Text color={theme.error}>Reset application</Text>
            </TouchableButton>
          </View>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    display: "flex",
    gap: 16,
  },
});

export default Settings;
