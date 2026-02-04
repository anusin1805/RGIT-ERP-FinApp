import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertLaborRecord, type InsertLaborCompliance } from "@shared/routes";

export function useLaborRecords(date?: string) {
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

export function useCreateLaborRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLaborRecord) => {
      const res = await fetch(api.labor.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create labor record");
      return api.labor.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.labor.list.path] });
    },
  });
}

export function useLaborCompliance() {
  return useQuery({
    queryKey: [api.labor.complianceList.path],
    queryFn: async () => {
      const res = await fetch(api.labor.complianceList.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch compliance records");
      return api.labor.complianceList.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLaborCompliance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLaborCompliance) => {
      const res = await fetch(api.labor.createCompliance.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create compliance record");
      return api.labor.createCompliance.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.labor.complianceList.path] });
    },
  });
}
