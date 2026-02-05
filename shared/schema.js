import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === Users & Auth ===
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  replitId: text("replit_id").unique(), // For Replit Auth
  username: text("username").notNull().unique(),
  role: text("role").notNull().default("engineer"), // 'manager', 'engineer', 'accountant'
  name: text("name").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// === Financial Management ===
export const financialRecords = pgTable("financial_records", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'advance', 'ra_bill', 'bg', 'expense'
  description: text("description").notNull(),
  amount: integer("amount").notNull(), // In Rupees
  date: timestamp("date").defaultNow(),
  status: text("status").default("pending"), // 'pending', 'approved', 'paid', 'recovered'
  metadata: text("metadata"), // JSON string for extra details like BG expiry, Interest rate
});

// === Labor Management ===
export const laborRecords = pgTable("labor_records", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'mason', 'bar_bender', 'carpenter', 'unskilled'
  count: integer("count").notNull(),
  source: text("source").notNull().default("market"), // 'nbcc', 'market'
  date: date("date").notNull(), // Attendance date
  shift: text("shift").default("day"),
});

export const laborCompliance = pgTable("labor_compliance", {
  id: serial("id").primaryKey(),
  contractorName: text("contractor_name").notNull(),
  epfRegistration: text("epf_registration"),
  safetyChecklist: boolean("safety_checklist").default(false),
  welfareFacilities: boolean("welfare_facilities").default(false),
  date: date("date").notNull(),
});

// === Material & Inventory ===
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'steel', 'cement', 'equipment'
  unit: text("unit").notNull(), // 'MT', 'bags', 'units'
  stock: integer("stock").notNull().default(0),
  grihaCompliant: boolean("griha_compliant").default(false),
  minLevel: integer("min_level").default(10), // Alert level
});

export const materialTransactions = pgTable("material_transactions", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull(),
  type: text("type").notNull(), // 'in', 'out'
  quantity: integer("quantity").notNull(),
  date: timestamp("date").defaultNow(),
  reference: text("reference"), // PO number or Location
});

// === Project Management ===
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").default("pending"), // 'pending', 'in_progress', 'completed', 'delayed'
  progress: integer("progress").default(0), // 0-100
});

export const qcForms = pgTable("qc_forms", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'plaster', 'rcc', 'flooring', 'waterproofing'
  location: text("location").notNull(),
  inspectorId: integer("inspector_id"), // Link to user
  date: timestamp("date").defaultNow(),
  status: text("status").default("pending"), // 'pending', 'approved', 'rejected'
  remarks: text("remarks"),
  data: text("data"), // JSON string for form fields
});

// === SCHEMAS ===
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({ id: true, date: true });
export const insertLaborRecordSchema = createInsertSchema(laborRecords).omit({ id: true });
export const insertLaborComplianceSchema = createInsertSchema(laborCompliance).omit({ id: true });
export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });
export const insertMaterialTransactionSchema = createInsertSchema(materialTransactions).omit({ id: true, date: true });
export const insertMilestoneSchema = createInsertSchema(milestones).omit({ id: true });
export const insertQcFormSchema = createInsertSchema(qcForms).omit({ id: true, date: true });

// === TYPES ===
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer;

export type FinancialRecord = typeof financialRecords.$inferSelect;
export type InsertFinancialRecord = z.infer;

export type LaborRecord = typeof laborRecords.$inferSelect;
export type InsertLaborRecord = z.infer;

export type LaborCompliance = typeof laborCompliance.$inferSelect;
export type InsertLaborCompliance = z.infer;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type MaterialTransaction = typeof materialTransactions.$inferSelect;
export type InsertMaterialTransaction = z.infer;

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer;

export type QcForm = typeof qcForms.$inferSelect;
export type InsertQcForm = z.infer;
