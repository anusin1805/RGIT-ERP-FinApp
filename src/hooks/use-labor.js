import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

// ✅ FIXED: Removed "?: string"
export function useLaborRecords(date) {
  return useQuery({
    queryKey: [api.labor.list.path, date],
    queryFn: async () => {
      const url = date 
        ? `${api.labor.list.path}?date=${date}`
        : api.labor.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch labor records");
      return api.labor.list.responses[200].parse(await res.json());
    },
  });
}

export function useLaborStats() {
  return useQuery({
    queryKey: [api.labor.stats.path],
    queryFn: async () => {
      const res = await fetch(api.labor.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch labor stats");
      return api.labor.stats.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLaborRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    // ✅ FIXED: Removed ": InsertLaborRecord"
    mutationFn: async (data) => {
      const res = await fetch(api.labor.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create record");
      return api.labor.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.labor.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.labor.stats.path] });
    },
  });
}
