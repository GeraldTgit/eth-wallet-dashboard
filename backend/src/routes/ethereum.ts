import express from 'express';
import { getEthereumData } from '../services/ethereumService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const address = req.query.address as string;

  try {
    const data = await getEthereumData(address);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
