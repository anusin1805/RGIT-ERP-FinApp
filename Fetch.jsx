const { data } = useQuery({ 
  queryKey: ["/api/financial/list"],
  queryFn: async () => {
    const res = await fetch("/api/financial/list"); // Fails on GitHub Pages
    return res.json();
  }
});
