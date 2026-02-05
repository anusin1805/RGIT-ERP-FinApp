import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useMilestones() {
  return useQuery({
    queryKey: [api.project.milestones.path],
    queryFn: async () => {
      const res = await fetch(api.project.milestones.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch milestones");
      return api.project.milestones.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.project.createMilestone.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create milestone");
      return api.project.createMilestone.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.project.milestones.path] });
    },
  });
}

export function useQcForms() {
  return useQuery({
    queryKey: [api.project.qcList.path],
    queryFn: async () => {
      const res = await fetch(api.project.qcList.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch QC forms");
      return api.project.qcList.responses[200].parse(await res.json());
    },
  });
}

export function useCreateQcForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.project.createQc.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create QC form");
      return api.project.createQc.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.project.qcList.path] });
    },
  });
}
