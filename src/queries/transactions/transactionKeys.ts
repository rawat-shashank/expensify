export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "lists"] as const,
  listPaginated: (accountId?: number) =>
    accountId
      ? ([...transactionKeys.lists(), "paginated", accountId] as const)
      : ([...transactionKeys.lists(), "paginated", "all"] as const),
  details: (id: number) => [...transactionKeys.all, "detail", id] as const,
};
