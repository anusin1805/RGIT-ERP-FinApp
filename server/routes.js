import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";

export async function registerRoutes(app) {
  // === Financial Routes ===
  app.get(api.financial.list.path, async (req, res) => {
    const records = await storage.getFinancialRecords(req.query.type);
    res.json(records);
  });

  app.post(api.financial.create.path, async (req, res) => {
    try {
      const input = api.financial.create.input.parse(req.body);
      const record = await storage.createFinancialRecord(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.financial.stats.path, async (req, res) => {
    const stats = await storage.getFinancialStats();
    res.json(stats);
  });

  // === Labor Routes ===
  app.get(api.labor.list.path, async (req, res) => {
    const records = await storage.getLaborRecords(req.query.date);
    res.json(records);
  });

  app.post(api.labor.create.path, async (req, res) => {
    try {
      const input = api.labor.create.input.parse(req.body);
      const record = await storage.createLaborRecord(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.get(api.labor.complianceList.path, async (req, res) => {
    const records = await storage.getLaborCompliance();
    res.json(records);
  });

  app.post(api.labor.createCompliance.path, async (req, res) => {
    try {
      const input = api.labor.createCompliance.input.parse(req.body);
      const record = await storage.createLaborCompliance(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // === Materials Routes ===
  app.get(api.materials.list.path, async (req, res) => {
    const records = await storage.getMaterials();
    res.json(records);
  });

  app.post(api.materials.create.path, async (req, res) => {
    try {
      const input = api.materials.create.input.parse(req.body);
      const record = await storage.createMaterial(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.post(api.materials.transaction.path, async (req, res) => {
    try {
      const input = api.materials.transaction.input.parse(req.body);
      const record = await storage.createMaterialTransaction(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // === Project Routes ===
  app.get(api.project.milestones.path, async (req, res) => {
    const records = await storage.getMilestones();
    res.json(records);
  });

  app.post(api.project.createMilestone.path, async (req, res) => {
    try {
      const input = api.project.createMilestone.input.parse(req.body);
      const record = await storage.createMilestone(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.get(api.project.qcList.path, async (req, res) => {
    const records = await storage.getQcForms();
    res.json(records);
  });

  app.post(api.project.createQc.path, async (req, res) => {
    try {
      const input = api.project.createQc.input.parse(req.body);
      const record = await storage.createQcForm(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // === Seed Data (Initial) ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getFinancialRecords();
  if (existing.length === 0) {
    // 1. Mobilization Advance
    await storage.createFinancialRecord({
      type: "advance",
      description: "Mobilization Advance (10% of 55.29 Cr)",
      amount: 55298034, // ₹5.52 Cr
      status: "approved",
      metadata: JSON.stringify({ interestRate: 10 }),
    });

    // 2. Bank Guarantee
    await storage.createFinancialRecord({
      type: "bg",
      description: "Performance Guarantee (5%)",
      amount: 27645000,
      status: "active",
      metadata: JSON.stringify({ expiryDate: "2026-07-30" }),
    });

    // 3. Milestones
    const milestones = [
      { name: "Start of Hostel Foundation", dueDate: new Date("2026-03-01"), progress: 0 },
      { name: "Auditorium Roof Casting", dueDate: new Date("2026-06-15"), progress: 0 },
      { name: "Guest House Completion", dueDate: new Date("2026-12-20"), progress: 0 },
    ];
    for (const m of milestones) await storage.createMilestone(m);

    // 4. Materials
    await storage.createMaterial({ name: "Cement (GRIHA Compliant)", category: "cement", unit: "bags", stock: 500, grihaCompliant: true });
    await storage.createMaterial({ name: "Steel TMT Bars", category: "steel", unit: "MT", stock: 20, grihaCompliant: false });
    
    // 5. Labor
    await storage.createLaborRecord({ category: "mason", count: 15, source: "market", date: new Date().toISOString() });
    await storage.createLaborRecord({ category: "bar_bender", count: 8, source: "market", date: new Date().toISOString() });
  }
}
