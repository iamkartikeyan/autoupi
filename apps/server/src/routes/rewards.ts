import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { rewardsService } from '../services/rewards';

const router = Router();

const ClaimRewardSchema = z.object({
  rewardId: z.string(),
});

// GET /api/rewards
router.get('/', (req: Request, res: Response) => {
  const offers = rewardsService.getAllOffersAndRewards();
  return res.json({ offers });
});

// POST /api/rewards/claim
router.post('/claim', (req: Request, res: Response) => {
  try {
    const { rewardId } = ClaimRewardSchema.parse(req.body);
    const result = rewardsService.claimReward(rewardId);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to claim reward' });
  }
});

export default router;
