import { useState, useEffect, useCallback } from "react";
import {
  saveProfileData,
  ProfileData,
  getProfileData,
} from "@/database/profileSchema";
import { SQLiteDatabase } from "expo-sqlite";

interface UseProfileResult {
  profileData: ProfileData | undefined;
  loading: boolean;
  error: Error | null;
  saveProfile: (name: string, currency: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const useProfile = (db: SQLiteDatabase): UseProfileResult => {
  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
    console.log("useProfile: fetchProfile called!"); // Add this
    try {
      setLoading(true);
      const data = await getProfileData(db);
      setProfileData(data);
      console.log("useProfile: Fetched data:", data); // Add this
      setError(null);
    } catch (err: any) {
      setError(err);
      setProfileData(undefined);
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const saveProfile = useCallback(
    async (name: string, currency: string) => {
      try {
        setLoading(true);
        await saveProfileData(name, currency, db);
        await fetchProfile();
      } catch (err: any) {
        setError(err);
        console.error("Error saving user data:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchProfile, db],
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await fetchProfile();
      } catch (err: any) {
        setError(err);
        console.error("Error initializing user data:", err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [fetchProfile, db]);

  return { profileData, loading, error, saveProfile, fetchProfile };
};

export default useProfile;
