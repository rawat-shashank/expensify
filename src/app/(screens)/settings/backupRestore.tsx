// components/ExportDataComponent.tsx
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState, useRef } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";

// Conditionally import Expo modules for native platforms
let Sharing: typeof import("expo-sharing") | undefined;
let FileSystem: typeof import("expo-file-system") | undefined;
if (Platform.OS !== "web") {
  Sharing = require("expo-sharing");
  FileSystem = require("expo-file-system");
}

import { useBackupRestoreData } from "@/queries/useBackupRestoreData"; // Adjust path as needed
import { BackupRestoreType } from "@/database/exportsSchema";
import { Container } from "@/components";
import { Stack } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

const ExportDataComponent: React.FC = () => {
  const db = useSQLiteContext();
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
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for web file input

  // --- Export/Backup Logic ---
  const handleExportClick = async (action: "share" | "download") => {
    if (!isExporting) {
      await triggerExport();
      setShouldTriggerExportAction(action);
    }
  };

  // --- Platform-specific download/share logic for Export ---
  const handleExportAction = async (
    data: any,
    action: "share" | "download",
  ) => {
    if (!data) {
      Alert.alert("Error", "No data to export.");
      return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const fileName = "exported_finance_data.json";

    if (Platform.OS === "web") {
      try {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Alert.alert("Success", "Data downloaded successfully!");
      } catch (err: any) {
        console.error("Error downloading JSON file (Web):", err);
        Alert.alert("Error", `Failed to download data: ${err.message}`);
      }
    } else {
      // --- Native (iOS/Android) download/sharing logic ---
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
          } else if (Platform.OS === "ios") {
            // On iOS, "sharing" to the Files app is the primary way to "download"
            // There's no direct "Downloads" folder like Android.
            if (!(await Sharing.isAvailableAsync())) {
              Alert.alert(
                "Sharing not available",
                "Sharing files is not supported on this device.",
              );
              return;
            }
            await Sharing.shareAsync(fileUri, {
              mimeType: "application/json",
              dialogTitle: "Save your finance data",
              UTI: "public.json",
            });
            Alert.alert(
              "Success",
              "Sharing dialog opened. Choose 'Save to Files' to download.",
            );
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
    }
  };

  // Effect to handle export completion and trigger download/share
  useEffect(() => {
    if (
      shouldTriggerExportAction &&
      exportedData &&
      !isExporting &&
      !exportError
    ) {
      handleExportAction(exportedData, shouldTriggerExportAction);
      setShouldTriggerExportAction(null); // Reset
    } else if (exportError) {
      Alert.alert(
        "Export Failed",
        exportError.message || "An unknown error occurred during export.",
      );
      setShouldTriggerExportAction(null); // Reset
    }
  }, [shouldTriggerExportAction, exportedData, isExporting, exportError]);

  // --- Restore/Import Logic ---

  const handleFilePick = async () => {
    if (Platform.OS === "web") {
      // Trigger the hidden file input click for web
      fileInputRef.current?.click();
    } else {
      // Use expo-document-picker for native platforms
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/json", // Only allow JSON files
          copyToCacheDirectory: true, // Copy to cache for easy access
        });

        if (result.canceled) {
          console.log("Document picking cancelled");
          return;
        }

        const asset = result.assets[0];
        if (asset.uri) {
          setSelectedFileName(asset.name);
          const jsonString = await FileSystem!.readAsStringAsync(asset.uri);
          await restoreData(jsonString);
        } else {
          Alert.alert("Error", "Could not get file URI.");
        }
      } catch (err: any) {
        console.error("Error picking document (Native):", err);
        Alert.alert("Error", `Failed to pick file: ${err.message}`);
      }
    }
  };

  const handleWebFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const jsonString = e.target?.result as string;
        await restoreData(jsonString);
      };
      reader.onerror = (e) => {
        console.error("FileReader error:", e);
        Alert.alert("Error", "Failed to read file.");
      };
      reader.readAsText(file);
    }
  };

  const restoreData = async (jsonString: string) => {
    try {
      const parsedData: BackupRestoreType = JSON.parse(jsonString);
      await triggerRestore(parsedData);
      Alert.alert("Restore Successful", "Your data has been restored.");
      setSelectedFileName(null); // Clear selected file after successful restore
    } catch (error: any) {
      console.error("Restore failed:", error);
      Alert.alert(
        "Restore Failed",
        `Failed to import data: ${error.message || "Invalid JSON format."}`,
      );
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />

      <FlatList
        renderItem={null}
        data={null}
        ListHeaderComponent={
          <Container paddingVertical={16}>
            <Text style={styles.title}>Backup and Restore Data</Text>

            {/* Backup Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Backup Your Data</Text>
              <Text style={styles.sectionDescription}>
                Export all your financial records to a JSON file.
              </Text>
              <Button
                onPress={() => handleExportClick("share")}
                title={
                  isExporting
                    ? "Exporting..."
                    : "Share Data (e.g., Email, Cloud)"
                }
                disabled={isExporting || isRestoring}
                color={isExporting ? "#ccc" : "#007bff"}
              />
              {Platform.OS !== "web" && (
                <View style={{ marginTop: 10, width: "100%" }}>
                  <Button
                    onPress={() => handleExportClick("download")}
                    title={
                      isExporting ? "Exporting..." : "Download Data (to device)"
                    }
                    disabled={isExporting || isRestoring}
                    color={isExporting ? "#ccc" : "#00aaff"} // A different color for download
                  />
                </View>
              )}
              {exportError && (
                <Text style={styles.errorText}>
                  Export Error: {exportError.message}
                </Text>
              )}
            </View>

            <View style={styles.separator} />

            {/* Restore Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Restore Your Data</Text>
              <Text style={styles.sectionDescription}>
                Import data from a previously exported JSON file. This will
                overwrite your current data.
              </Text>
              {Platform.OS === "web" && (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleWebFileChange}
                  style={{ display: "none" }}
                  accept=".json"
                />
              )}
              <Button
                onPress={handleFilePick}
                title={
                  isRestoring ? "Restoring..." : "Select File & Restore Data"
                }
                disabled={isRestoring || isExporting}
                color={isRestoring ? "#ccc" : "#28a745"}
              />
              {selectedFileName && (
                <Text style={styles.selectedFileText}>
                  Selected: {selectedFileName}
                </Text>
              )}
              {restoreError && (
                <Text style={styles.errorText}>
                  Restore Error: {restoreError.message}
                </Text>
              )}
            </View>
          </Container>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    margin: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
  selectedFileText: {
    marginTop: 10,
    fontSize: 13,
    color: "#444",
  },
  filePickerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  filePickerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ExportDataComponent;
