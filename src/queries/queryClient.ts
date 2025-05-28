// src/queries/queryClient.ts
import { QueryClient, focusManager } from "@tanstack/react-query";
import { AppState } from "react-native";
import type { AppStateStatus } from "react-native";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // Cache data for 24 hours
      refetchOnMount: true, // Always refetch on mount (good for initial app load)
      refetchOnWindowFocus: true, // Will be overridden by RN specific focusManager
      refetchOnReconnect: true, // Will be overridden by onlineManager
      retry: 3, // Retry failed queries 3 times
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

AppState.addEventListener("change", onAppStateChange);
