import { mockFetch } from "@/lib/mockApi"; // Import the mock file

const { data } = useQuery({ 
  queryKey: ["/api/financial/list"],
  queryFn: async () => await mockFetch("/api/financial/list")
});
