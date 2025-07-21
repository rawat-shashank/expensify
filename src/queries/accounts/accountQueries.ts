import { SQLiteDatabase } from "expo-sqlite";
import { useQuery } from "@tanstack/react-query";

import { accountKeys } from "./accountKeys";
import {
  AccountSummaryType,
  AccountType,
  getAccountSummaryList as dbGetAccountSummaryList,
  getAccountById as dbGetAccountById,
} from "@/database/accountsSchema";

export const useGetAllAccountSummaryList = (db: SQLiteDatabase) => {
  return useQuery<AccountSummaryType[], Error>({
    queryKey: accountKeys.summaryList(),
    queryFn: () => dbGetAccountSummaryList(db),
  });
};

export const useGetAccountById = (db: SQLiteDatabase, accountId: number) => {
  return useQuery<AccountType | null, Error>({
    queryKey: accountKeys.details(accountId),
    queryFn: () => dbGetAccountById(accountId, db),
    enabled: !!accountId, // Only run the query if accountId is provided
  });
};
