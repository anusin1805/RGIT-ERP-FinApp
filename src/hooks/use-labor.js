import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useLaborRecords() {
  return useQuery({
    queryKey: ["labor"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/labor");
      return res.json();
    },
  });
}

export function useCreateLaborRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/labor", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labor"] });
      toast({
        title: "Success",
        description: "Labor record created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useLaborCompliance() {
  return useQuery({
    queryKey: ["labor-compliance"],
    queryFn: async () => {
      // Assuming the endpoint is /api/labor/compliance based on the name
      const res = await apiRequest("GET", "/api/labor/compliance");
      return res.json();
    },
  });
}
