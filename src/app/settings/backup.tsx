// components/ExportDataComponent.tsx
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native"; // Import Platform

// Conditionally import Expo modules for native platforms
// These imports will be ignored by web bundlers if not used
let Sharing: typeof import("expo-sharing") | undefined;
let FileSystem: typeof import("expo-file-system") | undefined;
if (Platform.OS !== "web") {
  Sharing = require("expo-sharing");
  FileSystem = require("expo-file-system");
}

import { useBackupRestoreData } from "@/queries/useBackupRestoreData"; // Adjust path as needed

const ExportDataComponent: React.FC = () => {
  const db = useSQLiteContext();
  const { exportedData, isExporting, exportError, triggerExport } =
    useBackupRestoreData(db);
  const [shouldTriggerDownload, setShouldTriggerDownload] = useState(false);

  const handleExportClick = async () => {
    if (!isExporting) {
      await triggerExport();
      setShouldTriggerDownload(true);
    }
  };

  // --- Platform-specific download/share logic ---
  const handleDownloadOrShare = async (data: any) => {
    if (!data) {
      Alert.alert("Error", "No data to export.");
      return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const fileName = "exported_finance_data.json";

    if (Platform.OS === "web") {
      // --- Web-specific download logic ---
      try {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // Suggests filename for download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object

        Alert.alert("Success", "Data downloaded successfully!");
      } catch (err: any) {
        console.error("Error downloading JSON file (Web):", err);
        Alert.alert("Error", `Failed to download data: ${err.message}`);
      }
    } else {
      // --- Native (iOS/Android) sharing logic ---
      if (!FileSystem || !Sharing) {
        // Runtime check to ensure modules are loaded
        Alert.alert("Error", "File system or sharing modules not loaded.");
        return;
      }

      try {
        const fileUri = FileSystem.cacheDirectory + fileName;

        await FileSystem.writeAsStringAsync(fileUri, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

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
          UTI: "public.json", // Uniform Type Identifier for iOS
        });

        Alert.alert("Success", "Data exported and sharing dialog opened!");
      } catch (err: any) {
        console.error("Error sharing JSON file (Native):", err);
        Alert.alert("Error", `Failed to export or share data: ${err.message}`);
      }
    }
  };
  // --- End Platform-specific logic ---

  useEffect(() => {
    // Only call download/share handler if export completed successfully
    if (shouldTriggerDownload && exportedData && !isExporting && !exportError) {
      handleDownloadOrShare(exportedData);
      setShouldTriggerDownload(false);
    } else if (exportError) {
      // Display error message if export failed
      Alert.alert(
        "Export Failed",
        exportError.message || "An unknown error occurred during export.",
      );
      setShouldTriggerDownload(false);
    }
  }, [shouldTriggerDownload, exportedData, isExporting, exportError]); // Dependencies for useEffect

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export All Data</Text>
      <Button
        onPress={handleExportClick}
        title={isExporting ? "Exporting..." : "Export Data to JSON"}
        disabled={isExporting}
        color={isExporting ? "#ccc" : "#007bff"}
      />
    </View>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ExportDataComponent;
