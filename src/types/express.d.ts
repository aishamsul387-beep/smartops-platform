declare global {
  namespace Express {
    interface Request {
      user?: {
        businessId: string;
        staffId: string;
        role?: string;
        permissions?: string[];
      };
    }
  }
}

export {};
