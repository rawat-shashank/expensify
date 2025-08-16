import { SQLiteDatabase } from "expo-sqlite";
import { useQuery } from "@tanstack/react-query";

import {
  getSummaryCardDetails as dbGetSummaryCardDetails,
  SummaryCardType,
} from "@/database/generalSchema";

export const generalKeys = {
  all: ["general"] as const,
  summaryCard: () => [...generalKeys.all, "summaryCard"] as const,
};

export const useSummaryCard = (db: SQLiteDatabase) => {
  const {
    data: summaryCard,
    isLoading,
    error,
    refetch,
  } = useQuery<SummaryCardType, Error>({
    queryKey: generalKeys.summaryCard(),
    queryFn: async () => dbGetSummaryCardDetails(db),
  });

  return {
    summaryCard: summaryCard || {
      current_balance: 0,
      total_expense: 0,
      total_income: 0,
    },
    isLoading,
    error,
    refetch,
  };
};
