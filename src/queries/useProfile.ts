// src/queries/useProfile.ts
import {
  ProfileData,
  getProfileData,
  saveProfileData,
} from "@/database/profileSchema";
import {
  QueryObserverResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { SQLiteDatabase } from "expo-sqlite";
import { useCallback } from "react";

export const profileKeys = {
  all: ["profile"] as const,
  details: () => [...profileKeys.all, "details"] as const,
};

interface UseProfileResult {
  profileData: ProfileData | undefined;
  isLoading: boolean;
  error: Error | null;
  saveProfile: (name: string, currency: string) => Promise<void>;
  fetchProfile: () => Promise<
    QueryObserverResult<ProfileData | undefined, Error>
  >;
}

const useProfile = (db: SQLiteDatabase): UseProfileResult => {
  const queryClient = useQueryClient();

  // 1. useQuery for fetching profile data
  const {
    data: profileData,
    isLoading,
    error,
    refetch, // This is the manual refetch function provided by useQuery
  } = useQuery<ProfileData | undefined, Error>({
    queryKey: profileKeys.details(),
    queryFn: async () => {
      const data = await getProfileData(db);
      return data;
    },
  });

  // 2. useMutation for saving profile data
  const { mutateAsync: saveProfileMutation } = useMutation<
    void,
    Error,
    { name: string; currency: string }
  >({
    mutationFn: async ({ name, currency }) => {
      // The mutation function is responsible for performing the side-effect (saving data)
      await saveProfileData(name, currency, db);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.details() });
    },
    onError: (err) => {
      console.error("TanStack Query: Error saving profile:", err);
    },
  });

  // 3. Wrapper for saveProfile to match your existing API
  const saveProfile = useCallback(
    async (name: string, currency: string) => {
      await saveProfileMutation({ name, currency });
    },
    [saveProfileMutation],
  );

  // 4. Expose refetch as fetchProfile to maintain existing API
  const fetchProfile = useCallback(() => {
    return refetch();
  }, [refetch]);

  return {
    profileData,
    isLoading,
    error,
    saveProfile,
    fetchProfile,
  };
};

export default useProfile;
