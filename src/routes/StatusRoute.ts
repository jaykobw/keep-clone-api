import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'API status success',
  });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'API status success',
  });
});

export default router;
