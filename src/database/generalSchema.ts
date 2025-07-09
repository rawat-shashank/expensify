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
    (SELECT SUM(CAST(amount AS REAL)) FROM accounts) AS opening_balance,
    SUM(CASE WHEN type = 'income' THEN CAST(amount AS REAL) ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN CAST(amount AS REAL) ELSE 0 END) AS total_expense,
    (
      (SELECT SUM(CAST(amount AS REAL)) FROM accounts) +
      SUM(CASE WHEN type = 'income' THEN CAST(amount AS REAL) ELSE 0 END) -
      SUM(CASE WHEN type = 'expense' THEN CAST(amount AS REAL) ELSE 0 END)
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
