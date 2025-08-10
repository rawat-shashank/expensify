import { SQLiteDatabase } from "expo-sqlite";

// ---- Interface ----
interface SummaryCardType {
  current_balance: number;
  total_expense: number;
  total_income: number;
}

// --- SQL Queries ---
const SQL_SUMMARY_CARD = `
  SELECT
    COALESCE((SELECT SUM(CAST(amount AS REAL)) FROM accounts), 0) AS opening_balance,
    COALESCE(SUM(CASE WHEN type = 'income' THEN CAST(amount AS REAL) ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN type = 'expense' THEN CAST(amount AS REAL) ELSE 0 END), 0) AS total_expense,
    COALESCE(
      (
        (SELECT SUM(CAST(amount AS REAL)) FROM accounts) +
        SUM(CASE WHEN type = 'income' THEN CAST(amount AS REAL) ELSE 0 END) -
        SUM(CASE WHEN type = 'expense' THEN CAST(amount AS REAL) ELSE 0 END)
      ), 0
    ) AS current_balance
  FROM
    transactions;
`;

// ---- Database Operations ----
const getSummaryCardDetails = async (
  db: SQLiteDatabase,
): Promise<SummaryCardType> => {
  const result = await db.getFirstAsync(SQL_SUMMARY_CARD);
  return result as SummaryCardType;
};

export { SummaryCardType, getSummaryCardDetails };
