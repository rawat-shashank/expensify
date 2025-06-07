import { SQLiteDatabase } from "expo-sqlite";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  exportAllDataToJson,
  importAllDataFromJson,
  BackupRestoreType,
} from "@/database/exportsSchema";

const BACKUP_QUERY_KEY = ["backupData"];
const RESTORE_MUTATION_KEY = ["restoreData"];

interface UseBackupRestoreDataResult {
  exportedData: BackupRestoreType | undefined;
  isExporting: boolean;
  exportError: Error | null;
  triggerExport: () => Promise<void>;
  isRestoring: boolean;
  restoreError: Error | null;
  triggerRestore: (data: BackupRestoreType) => Promise<void>;
}

export const useBackupRestoreData = (
  db: SQLiteDatabase,
): UseBackupRestoreDataResult => {
  const queryClient = useQueryClient();

  //1. Export to Json Logic
  const {
    data: exportedData,
    isLoading: isExporting,
    error: exportError,
    refetch: refetchBackup,
  } = useQuery<BackupRestoreType, Error>({
    queryKey: BACKUP_QUERY_KEY,
    queryFn: () => exportAllDataToJson(db),
    enabled: false,
    retry: false,
  });

  // 2. --- Import/Restore Logic ---
  const {
    mutateAsync: triggerRestore, // Renamed mutateAsync for clarity
    isPending: isRestoring,
    error: restoreError,
  } = useMutation<void, Error, BackupRestoreType>({
    mutationKey: RESTORE_MUTATION_KEY,
    mutationFn: (data: BackupRestoreType) => importAllDataFromJson(db, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
      console.log("Data successfully restored!");
    },
    onError: (error) => {
      console.error("Error during data restore:", error);
    },
  });

  return {
    exportedData,
    isExporting,
    exportError,
    triggerExport: async () => {
      await refetchBackup();
    },
    isRestoring,
    restoreError,
    triggerRestore,
  };
};
