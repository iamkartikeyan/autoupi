import { NotificationItem } from '@auto-upi/shared';
import { Server as SocketIOServer } from 'socket.io';
import { db } from '../db';

export class NotificationService {
  private notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      type: 'PAYMENT',
      title: 'Remittance Credited Successfully',
      message: '₹29,225.00 INR has been deposited into Priya Sharma\'s SBI account via domestic UPI rail.',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      isRead: false,
      referenceId: 'tx_upi_992810',
    },
    {
      id: 'notif_2',
      type: 'REWARD',
      title: 'Cashback Credited to Bank Escrow',
      message: '₹500.00 referral bonus from Rohan Mehta\'s transfer credited to JPMorgan Chase custody vault.',
      timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
      isRead: false,
    },
    {
      id: 'notif_3',
      type: 'SECURITY',
      title: 'Tier 2 KYC Upgraded',
      message: 'Your institutional daily remittance limit is now active at $50,000.00 USD.',
      timestamp: new Date(Date.now() - 3600000 * 50).toISOString(),
      isRead: true,
    },
  ];

  private io: SocketIOServer | null = null;

  public setSocketServer(io: SocketIOServer) {
    this.io = io;
  }

  public createNotification(params: {
    type: 'PAYMENT' | 'REWARD' | 'SECURITY' | 'SYSTEM';
    title: string;
    message: string;
    referenceId?: string;
  }): NotificationItem {
    const item: NotificationItem = {
      id: `notif_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
      type: params.type,
      title: params.title,
      message: params.message,
      timestamp: new Date().toISOString(),
      isRead: false,
      referenceId: params.referenceId,
    };

    this.notifications.unshift(item);

    if (this.io) {
      this.io.emit('notification:new', item);
    }

    return item;
  }

  public getNotifications(userId: string = db.currentUser.id): NotificationItem[] {
    return this.notifications;
  }

  public markAsRead(id: string): void {
    const found = this.notifications.find((n) => n.id === id);
    if (found) {
      found.isRead = true;
    }
  }

  public markAllAsRead(userId: string = db.currentUser.id): void {
    this.notifications.forEach((n) => {
      n.isRead = true;
    });
  }
}

export const notificationService = new NotificationService();
