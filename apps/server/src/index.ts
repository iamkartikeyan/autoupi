import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

import authRoutes from './routes/auth';
import accountsRoutes from './routes/accounts';
import beneficiariesRoutes from './routes/beneficiaries';
import paymentsRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import bankRoutes from './routes/bank';
import qrRoutes from './routes/qr';
import rewardsRoutes from './routes/rewards';
import referralsRoutes from './routes/referrals';
import notificationsRoutes from './routes/notifications';
import webhooksRoutes from './routes/webhooks';
import { requestIdMiddleware } from './middleware/auth';
import { settlementEngine } from './services/settlement';
import { notificationService } from './services/notifications';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Socket.io initialization
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Allow sandbox web client and mobile clients
    methods: ['GET', 'POST'],
  },
});

settlementEngine.setSocketServer(io);
notificationService.setSocketServer(io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('subscribe:transaction', (transactionId: string) => {
    socket.join(`tx:${transactionId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    service: 'Auto-UPI Settlement Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use(requestIdMiddleware);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/webhooks', webhooksRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);
  return res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

server.listen(PORT, () => {
  console.log(`🚀 [Auto-UPI Backend] Server running on http://localhost:${PORT}`);
  console.log(`⚡ [Auto-UPI Backend] Real-time WebSockets active`);
});

export { app, server, io };
