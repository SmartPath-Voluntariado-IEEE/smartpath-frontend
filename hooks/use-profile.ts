import { useEffect, useState, useCallback } from "react";
import { loadProfile, saveProfile, clearProfile, type UserProfile } from "@/lib/profile-store";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
    const onUpdate = () => setProfile(loadProfile());
    window.addEventListener("smartpath:profile-updated", onUpdate);
    return () => window.removeEventListener("smartpath:profile-updated", onUpdate);
  }, []);

  const save = useCallback((p: UserProfile) => {
    saveProfile(p);
    setProfile(p);
  }, []);

  const clear = useCallback(() => {
    clearProfile();
    setProfile(null);
  }, []);

  return { profile, hydrated, save, clear };
}
