import { Request, Response, NextFunction } from 'express';
import { Session } from '../models/Session';
import AppError from '../utils/ErrorHelper';

export default class SessionController {
  /**
   * Get all user sessions
   * @param req Express.request
   * @param res Express.response
   * @param next Express.nextFunction
   * @returns {Promise<void | Response<void | Record<string, any>>>}
   */
  static async index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<void | Record<string, any>>> {
    const userId = (req as Record<string, any>)?.user?.id;

    const allSessions = await Session.findAll({
      attributes: {
        exclude: [
          'id',
          'userId',
          'name',
          'sessionUserAgent',
          'expiresAt',
          'updatedAt',
        ],
      },
      where: {
        userId,
      },
    });

    if (!allSessions) {
      return next(new AppError('An internal error occured', 400));
    }

    return res.status(200).json({
      status: 'success',
      data: allSessions,
    });
  }

  /**
   * Destroy a single instance of a session
   * @param req Express.request
   * @param res Express.response
   * @param next Express.nextFunction
   * @returns {Promise<void | Response<void | Record<string, any>>>}
   */
  static async destory(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<void | Record<string, any>>> {
    const userId = (req as Record<string, any>)?.user?.id;
    const sessionId = req.params?.id;

    if (!sessionId) {
      return next(new AppError('Session token is invalid or required', 400));
    }

    const destorySession = await Session.destroy({
      where: {
        token: sessionId,
        userId,
      },
    });

    if (!destorySession) {
      return next(new AppError('Failed to end session', 400));
    }

    return res.status(204).json({
      status: 'success',
      message: 'Session terminated succesfully',
    });
  }
}
