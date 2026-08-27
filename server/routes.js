import { createServer } from "http";
import session from "express-session";
import { storage } from "./storage.js"; 
import { api } from "../shared/routes.js";
import { z } from "zod";

// Helper authentication guard for protected API endpoints
function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  next();
}

export async function registerRoutes(app) {
  // === 1. Session & Express Security Setup ===
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      proxy: true, // Enables proxy support for cookie handling on Render
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // === 2. Financial Routes ===
  app.get(api.financial.list.path, requireAuth, async (req, res) => {
    const records = await storage.getFinancialRecords(req.query.type);
    res.json(records);
  });

  app.post(api.financial.create.path, requireAuth, async (req, res) => {
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

  app.get(api.financial.stats.path, requireAuth, async (req, res) => {
    const stats = await storage.getFinancialStats();
    res.json(stats);
  });

  // === 3. Labor Routes ===
  app.get(api.labor.list.path, requireAuth, async (req, res) => {
    const records = await storage.getLaborRecords(req.query.date);
    res.json(records);
  });

  app.post(api.labor.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.labor.create.input.parse(req.body);
      const record = await storage.createLaborRecord(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.get(api.labor.complianceList.path, requireAuth, async (req, res) => {
    const records = await storage.getLaborCompliance();
    res.json(records);
  });

  app.post(api.labor.createCompliance.path, requireAuth, async (req, res) => {
    try {
      const input = api.labor.createCompliance.input.parse(req.body);
      const record = await storage.createLaborCompliance(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // === 4. Materials Routes ===
  app.get(api.materials.list.path, requireAuth, async (req, res) => {
    const records = await storage.getMaterials();
    res.json(records);
  });

  app.post(api.materials.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.materials.create.input.parse(req.body);
      const record = await storage.createMaterial(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.post(api.materials.transaction.path, requireAuth, async (req, res) => {
    try {
      const input = api.materials.transaction.input.parse(req.body);
      const record = await storage.createMaterialTransaction(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // === 5. Project Routes ===
  app.get(api.project.milestones.path, requireAuth, async (req, res) => {
    const records = await storage.getMilestones();
    res.json(records);
  });

  app.post(api.project.createMilestone.path, requireAuth, async (req, res) => {
    try {
      const input = api.project.createMilestone.input.parse(req.body);
      const record = await storage.createMilestone(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.get(api.project.qcList.path, requireAuth, async (req, res) => {
    const records = await storage.getQcForms();
    res.json(records);
  });

  app.post(api.project.createQc.path, requireAuth, async (req, res) => {
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

  // === CRITICAL FIX: Create and Return Server ===
  const httpServer = createServer(app);
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
