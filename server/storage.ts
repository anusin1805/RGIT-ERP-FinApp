import { db } from "./db";
import { 
  users, financialRecords, laborRecords, laborCompliance, 
  materials, materialTransactions, milestones, qcForms,
  type InsertUser, type InsertFinancialRecord, type InsertLaborRecord,
  type InsertLaborCompliance, type InsertMaterial, type InsertMaterialTransaction,
  type InsertMilestone, type InsertQcForm
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User
  getUser(id: number): Promise<typeof users.$inferSelect | undefined>;
  getUserByUsername(username: string): Promise<typeof users.$inferSelect | undefined>;
  createUser(user: InsertUser): Promise<typeof users.$inferSelect>;
  
  // Financial
  getFinancialRecords(type?: string): Promise<typeof financialRecords.$inferSelect[]>;
  createFinancialRecord(record: InsertFinancialRecord): Promise<typeof financialRecords.$inferSelect>;
  getFinancialStats(): Promise<{
    totalAdvance: number;
    totalRecovered: number;
    interestAccrued: number;
    bgExposure: number;
  }>;

  // Labor
  getLaborRecords(date?: string): Promise<typeof laborRecords.$inferSelect[]>;
  createLaborRecord(record: InsertLaborRecord): Promise<typeof laborRecords.$inferSelect>;
  getLaborCompliance(): Promise<typeof laborCompliance.$inferSelect[]>;
  createLaborCompliance(record: InsertLaborCompliance): Promise<typeof laborCompliance.$inferSelect>;

  // Materials
  getMaterials(): Promise<typeof materials.$inferSelect[]>;
  createMaterial(material: InsertMaterial): Promise<typeof materials.$inferSelect>;
  createMaterialTransaction(record: InsertMaterialTransaction): Promise<typeof materialTransactions.$inferSelect>;

  // Project
  getMilestones(): Promise<typeof milestones.$inferSelect[]>;
  createMilestone(milestone: InsertMilestone): Promise<typeof milestones.$inferSelect>;
  getQcForms(): Promise<typeof qcForms.$inferSelect[]>;
  createQcForm(form: InsertQcForm): Promise<typeof qcForms.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  // === User ===
  async getUser(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // === Financial ===
  async getFinancialRecords(type?: string) {
    if (type) {
      return await db.select().from(financialRecords).where(eq(financialRecords.type, type)).orderBy(desc(financialRecords.date));
    }
    return await db.select().from(financialRecords).orderBy(desc(financialRecords.date));
  }

  async createFinancialRecord(record: InsertFinancialRecord) {
    const [newRecord] = await db.insert(financialRecords).values(record).returning();
    return newRecord;
  }

  async getFinancialStats() {
    const records = await db.select().from(financialRecords);
    
    // Simple in-memory aggregation for now (can be optimized with SQL aggregations later)
    let totalAdvance = 0;
    let totalRecovered = 0;
    let bgExposure = 0;
    // Interest calculation would be dynamic based on dates, simplified here as stored or calculated
    const interestAccrued = 0; 

    records.forEach(r => {
      if (r.type === 'advance') totalAdvance += r.amount;
      if (r.type === 'recovery') totalRecovered += r.amount;
      if (r.type === 'bg' && r.status === 'active') bgExposure += r.amount;
    });

    return { totalAdvance, totalRecovered, interestAccrued, bgExposure };
  }

  // === Labor ===
  async getLaborRecords(date?: string) {
    // If date filtering is needed, add where clause. For now return all sorted by date.
    return await db.select().from(laborRecords).orderBy(desc(laborRecords.date));
  }

  async createLaborRecord(record: InsertLaborRecord) {
    const [newRecord] = await db.insert(laborRecords).values(record).returning();
    return newRecord;
  }

  async getLaborCompliance() {
    return await db.select().from(laborCompliance);
  }

  async createLaborCompliance(record: InsertLaborCompliance) {
    const [newRecord] = await db.insert(laborCompliance).values(record).returning();
    return newRecord;
  }

  // === Materials ===
  async getMaterials() {
    return await db.select().from(materials);
  }

  async createMaterial(material: InsertMaterial) {
    const [newRecord] = await db.insert(materials).values(material).returning();
    return newRecord;
  }

  async createMaterialTransaction(record: InsertMaterialTransaction) {
    // Transaction creates record AND updates stock
    return await db.transaction(async (tx) => {
      const [newTransaction] = await tx.insert(materialTransactions).values(record).returning();
      
      const [material] = await tx.select().from(materials).where(eq(materials.id, record.materialId));
      if (material) {
        const newStock = record.type === 'in' 
          ? material.stock + record.quantity 
          : material.stock - record.quantity;
        
        await tx.update(materials)
          .set({ stock: newStock })
          .where(eq(materials.id, record.materialId));
      }
      
      return newTransaction;
    });
  }

  // === Project ===
  async getMilestones() {
    return await db.select().from(milestones).orderBy(milestones.dueDate);
  }

  async createMilestone(milestone: InsertMilestone) {
    const [newRecord] = await db.insert(milestones).values(milestone).returning();
    return newRecord;
  }

  async getQcForms() {
    return await db.select().from(qcForms).orderBy(desc(qcForms.date));
  }

  async createQcForm(form: InsertQcForm) {
    const [newRecord] = await db.insert(qcForms).values(form).returning();
    return newRecord;
  }
}

export const storage = new DatabaseStorage();
