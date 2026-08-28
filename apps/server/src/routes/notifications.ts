import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notifications';
import { db } from '../db';

const router = Router();

// GET /api/notifications
router.get('/', (req: Request, res: Response) => {
  const notifications = notificationService.getNotifications(db.currentUser.id);
  return res.json({ notifications });
});

// POST /api/notifications/:id/read
router.post('/:id/read', (req: Request, res: Response) => {
  notificationService.markAsRead(req.params.id);
  return res.json({ success: true });
});

// POST /api/notifications/read-all
router.post('/read-all', (req: Request, res: Response) => {
  notificationService.markAllAsRead(db.currentUser.id);
  return res.json({ success: true });
});

export default router;
