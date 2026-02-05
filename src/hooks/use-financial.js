import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useFinancialRecords(type?: string) {
  return useQuery({
    queryKey: [api.financial.list.path, type],
    queryFn: async () => {
      const url = type 
        ? `${api.financial.list.path}?type=${type}`
        : api.financial.list.path;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch financial records");
      return api.financial.list.responses[200].parse(await res.json());
    },
  });
}

export function useFinancialStats() {
  return useQuery({
    queryKey: [api.financial.stats.path],
    queryFn: async () => {
      const res = await fetch(api.financial.stats.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch financial stats");
      return api.financial.stats.responses[200].parse(await res.json());
    },
  });
}

export function useCreateFinancialRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertFinancialRecord) => {
      const res = await fetch(api.financial.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create record");
      return api.financial.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.financial.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.financial.stats.path] });
    },
  });
}
