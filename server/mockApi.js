// client/src/lib/mockApi.ts

// This mimics the database data for the static GitHub page
export const MOCK_DATA = {
  financial: [
    { id: 1, type: "advance", description: "Mobilization Advance", amount: 55298034, status: "approved", date: new Date().toISOString() },
    { id: 2, type: "bg", description: "Performance Guarantee", amount: 27645000, status: "active", date: new Date().toISOString() },
  ],
  milestones: [
    { id: 1, name: "Start of Hostel Foundation", dueDate: "2026-03-01", progress: 0 },
    { id: 2, name: "Auditorium Roof Casting", dueDate: "2026-06-15", progress: 0 },
  ],
  labor: [
     { id: 1, category: "mason", count: 15, source: "market", date: new Date().toISOString() }
  ],
  materials: [
    { id: 1, name: "Cement (GRIHA Compliant)", stock: 500, unit: "bags" }
  ]
};

// A fake fetch function that returns data immediately
export async function mockFetch(endpoint: string) {
  console.log(`Fetching mock data for: ${endpoint}`);
  
  if (endpoint.includes("/financial/list")) return MOCK_DATA.financial;
  if (endpoint.includes("/project/milestones")) return MOCK_DATA.milestones;
  if (endpoint.includes("/labor/list")) return MOCK_DATA.labor;
  if (endpoint.includes("/materials/list")) return MOCK_DATA.materials;
  
  return [];
}
