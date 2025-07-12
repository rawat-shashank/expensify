export const categoryKeys = {
  all: ["category"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
  details: (id: number) => [...categoryKeys.all, "details", id] as const,
};
