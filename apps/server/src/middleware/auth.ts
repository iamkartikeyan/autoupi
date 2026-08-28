import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@auto-upi/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'autoupi_super_secret_jwt_key_development_2026_demo_secure';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    phone?: string;
    role: UserRole;
  };
  requestId?: string;
}

export const requestIdMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const reqId = (req.headers['x-request-id'] as string) || `req_${uuidv4().substring(0, 12)}`;
  req.requestId = reqId;
  res.setHeader('x-request-id', reqId);
  next();
};

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication token missing or invalid format',
      code: 'AUTH_UNAUTHORIZED',
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role || 'USER',
    };
    next();
  } catch (err: any) {
    return res.status(401).json({
      error: 'Token expired or invalid signature',
      code: 'AUTH_INVALID_TOKEN',
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireRole = (requiredRole: UserRole) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
        requestId: req.requestId,
      });
    }

    if (req.user.role !== requiredRole && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: `Insufficient permissions. Required role: ${requiredRole}`,
        code: 'AUTH_FORBIDDEN',
        requestId: req.requestId,
      });
    }

    next();
  };
};
