import express from 'express';
import { getGoals, createGoal, generateGoals, deleteAllGoals } from '../controllers/goalController';

const router = express.Router();

router.get('/', getGoals);
router.post('/', createGoal);
router.post('/generate', generateGoals);
router.delete('/deleteAll', deleteAllGoals);

export default router;