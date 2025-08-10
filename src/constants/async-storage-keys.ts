export enum ASYNC_STORAGE_KEYS {
  USER_ACCOUNT = "userAccount",
}

export interface UserAccountData {
  name: string;
  materialYou: boolean;
}

export const DEFAULT_USER_DATA = {
  name: "User",
  materialYou: true,
};
