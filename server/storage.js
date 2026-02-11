import { db } from "./db";
import { 
  financialRecords, laborRecords, laborCompliance, 
  materials, materialTransactions, milestones, qcForms,
} from "../shared/schema";
// FIXED: Added 'desc' to imports
import { eq, desc } from "drizzle-orm"; 
import { users } from "../shared/models/auth"; // Adjusted import path to be safe

export interface IAuthStorage {
  getUser(id: string): Promise<any>;
  upsertUser(user: any): Promise<any>;
}

class AuthStorage implements IAuthStorage {
  async getUser(id) {
    // FIXED: Added 'id' as the second argument to eq()
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
}

export const authStorage = new AuthStorage();

export class DatabaseStorage {
  // === User ===
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.email, username)); // changed to email since you use Google Auth
    return user;
  }

  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // === Financial ===
  async getFinancialRecords(type) {
    if (type) {
      return await db.select().from(financialRecords).where(eq(financialRecords.type, type)).orderBy(desc(financialRecords.date));
    }
    return await db.select().from(financialRecords).orderBy(desc(financialRecords.date));
  }

  async createFinancialRecord(record) {
    const [newRecord] = await db.insert(financialRecords).values(record).returning();
    return newRecord;
  }

  async getFinancialStats() {
    const records = await db.select().from(financialRecords);
    
    let totalAdvance = 0;
    let totalRecovered = 0;
    let bgExposure = 0;
    const interestAccrued = 0; 

    records.forEach(r => {
      // Ensure we treat amounts as numbers
      const amount = Number(r.amount);
      if (r.type === 'advance') totalAdvance += amount;
      if (r.type === 'recovery') totalRecovered += amount;
      if (r.type === 'bg' && r.status === 'active') bgExposure += amount;
    });

    return { totalAdvance, totalRecovered, interestAccrued, bgExposure };
  }

  // === Labor ===
  async getLaborRecords(date) {
    return await db.select().from(laborRecords).orderBy(desc(laborRecords.date));
  }

  async createLaborRecord(record) {
    const [newRecord] = await db.insert(laborRecords).values(record).returning();
    return newRecord;
  }

  async getLaborCompliance() {
    return await db.select().from(laborCompliance);
  }

  async createLaborCompliance(record) {
    const [newRecord] = await db.insert(laborCompliance).values(record).returning();
    return newRecord;
  }

  // === Materials ===
  async getMaterials() {
    return await db.select().from(materials);
  }

  async createMaterial(material) {
    const [newRecord] = await db.insert(materials).values(material).returning();
    return newRecord;
  }

  async createMaterialTransaction(record) {
    return await db.transaction(async (tx) => {
      const [newTransaction] = await tx.insert(materialTransactions).values(record).returning();
      
      const [material] = await tx.select().from(materials).where(eq(materials.id, record.materialId));
      if (material) {
        const quantity = Number(record.quantity);
        const currentStock = Number(material.stock);
        
        const newStock = record.type === 'in' 
          ? currentStock + quantity 
          : currentStock - quantity;
        
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

  async createMilestone(milestone) {
    const [newRecord] = await db.
