import { SQLiteDatabase } from "expo-sqlite";
import { useQuery } from "@tanstack/react-query";
import {
  exportAllDataToJson,
  BackupRestoreType,
} from "@/database/exportsSchema";

const BACKUP_RESTORE_QUERY_KEY = ["exportData", "allJoined"];

interface UseBackupRestoreDataResult {
  exportedData: BackupRestoreType | null | undefined;
  isBackupRestoring: boolean;
  exportError: Error | null;
  triggerBackupRestore: () => Promise<void>;
}

export const useBackupRestoreData = (
  db: SQLiteDatabase,
): UseBackupRestoreDataResult => {
  const {
    data: exportedData,
    isLoading: isBackupRestoring,
    error: exportError,
    refetch,
  } = useQuery<BackupRestoreType, Error>({
    queryKey: BACKUP_RESTORE_QUERY_KEY,
    queryFn: () => exportAllDataToJson(db).then((data) => data || []),
    enabled: false,
    retry: false,
  });

  // Function to explicitly trigger the export
  const triggerBackupRestore = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Manual export trigger failed:", err);
    }
  };

  return {
    exportedData,
    isBackupRestoring,
    exportError,
    triggerBackupRestore,
  };
};
