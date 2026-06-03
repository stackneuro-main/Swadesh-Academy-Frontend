import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyProfile, googleLogin } from "./api/authApi";
import { AuthContext } from "./AuthContext";
import {
  clearStoredAuthToken,
  getStoredAuthToken,
  setStoredAuthToken,
} from "./utils/authStorage";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => getStoredAuthToken());

  const profileQuery = useQuery({
    queryKey: ["auth", "profile", token],
    queryFn: getMyProfile,
    enabled: Boolean(token),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: googleLogin,
    onSuccess: (data) => {
      setStoredAuthToken(data.access_token);
      setToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });

  useEffect(() => {
    if (!token || !profileQuery.isError) {
      return;
    }

    const message = profileQuery.error?.message || "";
    if (/invalid|expired|not found|unauthorized/i.test(message)) {
      clearStoredAuthToken();
      setToken(null);
    }
  }, [token, profileQuery.error, profileQuery.isError]);

  const signOut = useCallback(() => {
    clearStoredAuthToken();
    setToken(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
    queryClient.removeQueries({ queryKey: ["my-enrollments"] });
  }, [queryClient]);

  const signInWithGoogleToken = useCallback(async (googleToken) => {
    return loginMutation.mutateAsync(googleToken);
  }, [loginMutation]);

  const value = useMemo(() => {
    const user = profileQuery.data || null;

    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAuthLoading: Boolean(token) && profileQuery.isLoading,
      isSigningIn: loginMutation.isPending,
      authError: loginMutation.error?.message || "",
      signInWithGoogleToken,
      signOut,
      refreshProfile: () =>
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] }),
    };
  }, [
    loginMutation.error?.message,
    loginMutation.isPending,
    profileQuery.data,
    profileQuery.isLoading,
    queryClient,
    signInWithGoogleToken,
    signOut,
    token,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
