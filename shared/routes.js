import { z } from 'zod';
import { 
  insertUserSchema, 
  insertFinancialRecordSchema, 
  insertLaborRecordSchema, 
  insertLaborComplianceSchema,
  insertMaterialSchema,
  insertMaterialTransactionSchema,
  insertMilestoneSchema,
  insertQcFormSchema,
  financialRecords,
  laborRecords,
  laborCompliance,
  materials,
  materialTransactions,
  milestones,
  qcForms
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // === Financial ===
  financial: {
    list: {
      method: 'GET' as const,
      path: '/api/financial',
      input: z.object({
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/financial',
      input: insertFinancialRecordSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
    stats: { // For dashboard aggregation
      method: 'GET' as const,
      path: '/api/financial/stats',
      responses: {
        200: z.object({
          totalAdvance: z.number(),
          totalRecovered: z.number(),
          interestAccrued: z.number(),
          bgExposure: z.number(),
        }),
      },
    },
  },

  // === Labor ===
  labor: {
    list: {
      method: 'GET' as const,
      path: '/api/labor',
      input: z.object({ date: z.string().optional() }).optional(),
      responses: {
        200: z.array(z.custom()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/labor',
      input: insertLaborRecordSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
    complianceList: {
      method: 'GET' as const,
      path: '/api/labor/compliance',
      responses: {
        200: z.array(z.custom()),
      },
    },
    createCompliance: {
      method: 'POST' as const,
      path: '/api/labor/compliance',
      input: insertLaborComplianceSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
  },

  // === Materials ===
  materials: {
    list: {
      method: 'GET' as const,
      path: '/api/materials',
      responses: {
        200: z.array(z.custom()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/materials',
      input: insertMaterialSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
    transaction: {
      method: 'POST' as const,
      path: '/api/materials/transaction',
      input: insertMaterialTransactionSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
  },

  // === Project (Milestones & QC) ===
  project: {
    milestones: {
      method: 'GET' as const,
      path: '/api/milestones',
      responses: {
        200: z.array(z.custom()),
      },
    },
    createMilestone: {
      method: 'POST' as const,
      path: '/api/milestones',
      input: insertMilestoneSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
    qcList: {
      method: 'GET' as const,
      path: '/api/qc',
      responses: {
        200: z.array(z.custom()),
      },
    },
    createQc: {
      method: 'POST' as const,
      path: '/api/qc',
      input: insertQcFormSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record: string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
