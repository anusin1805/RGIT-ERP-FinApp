import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchUser() {
  const response = await fetch("/api/auth/user");
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}

async function logout() {
  await fetch("/api/logout");
  window.location.href = "/";
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: rawUser, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  // --- CRASH PREVENTION FIX ---
  // We create a "safe" user object that works even if fields are missing.
  const user = rawUser
    ? {
        ...rawUser,
        // If 'name' is missing, build it from first/last name
        name: rawUser.name || `${rawUser.firstName || ""} ${rawUser.lastName || ""}`.trim() || rawUser.email,
        // If 'username' is missing, use email
        username: rawUser.username || rawUser.email,
        // If 'avatar' is missing, use 'picture' (from Google) or a placeholder
        avatar: rawUser.avatar || rawUser.picture || rawUser.profileImageUrl || "",
        // Default role if missing
        role: rawUser.role || "admin", 
      }
    : null;

  return {
    user,
    isLoading,
    error,
    logout: logoutMutation.mutate,
  };
}
