import { Request, Response, NextFunction } from 'express';
import requestIP from 'request-ip';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from 'jsonwebtoken';
import { loginSchema, signupSchema } from '../validators/AuthValidation';
import {
  createJWTAccessToken,
  createJWTRefreshToken,
  decodeJWTToken,
} from '../utils/jwt';
import { UserAgentParser } from '../utils/UserAgentParser';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { bcryptCompare } from '../utils/Hashlib';
import { IUser } from '../types/User';
import Cookie from '../utils/CookierHelper';
import AppError from '../utils/ErrorHelper';
import joiValidationOptions from '../validators/ValidationConfig';

export default class AuthController {
  /**
   * Static function to create a new session and send auth cookies
   * @param user Instance of user
   * @param req Express.req
   * @param res Express.res
   * @param next Express.next
   * @returns {Promise<void | Response<any | Record<string, any>>>}
   */
  private static async createSession(
    user: IUser,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any | Record<string, any>>> {
    const sessionPayload = {
      userId: user?.id,
      token: uuidv4(),
      sessionIP: requestIP.getClientIp(req),
      sessionUserAgent: req.header('user-agent'),
      sessionOS: UserAgentParser(req.header('user-agent') as string),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };

    const sessionCreated = await Session.create(sessionPayload);

    if (!sessionCreated) {
      return next(new AppError('An internal error occured', 500));
    }

    const jwtAccessToken = createJWTAccessToken({
      id: user?.id,
      username: user?.username,
    });

    const jwtRefreshToken = createJWTRefreshToken({
      token: sessionCreated?.token,
    });

    Cookie.createCookie(
      res,
      `${process.env.JWT_ACCESS_COOKIE_NAME}`,
      jwtAccessToken,
      {
        expires: new Date(Date.now() + 6 + 3600 * 1000), // 1 hour
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      },
    );

    Cookie.createCookie(
      res,
      `${process.env.JWT_REFRESH_COOKIE_NAME}`,
      jwtRefreshToken,
      {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      },
    );

    return res.status(200).json({
      status: 'success',
      user: {
        username: user?.username,
        email: user?.email,
        avatar: `${process.env.APP_URL}/images/user/${user?.avatar}`,
        refreshtoken: jwtRefreshToken,
        accesstoken: jwtAccessToken,
      },
    });
  }

  /**
   * Static function to register an new user
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns {Promise<void | Response<string, any>>}
   */
  static async Signup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response<any, Record<string, any>>> {
    const signupValidation = signupSchema.validate(
      req.body,
      joiValidationOptions,
    );

    if (signupValidation.error) {
      return next(new AppError(signupValidation.error.message, 400));
    }

    const userCreated = (await User.create(req.body)) as IUser;

    if (!userCreated) {
      return next(new AppError('An internal error occured!', 500));
    }

    AuthController.createSession(userCreated, req, res, next);
  }

  /**
   * Authenticate and login a user
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns {Promise<void | Record<string, any>>}
   */
  static async Login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Record<string, any>> {
    const loginValidation = loginSchema.validate(
      req.body,
      joiValidationOptions,
    );

    if (loginValidation.error) {
      return next(new AppError(loginValidation.error.message, 400));
    }

    const { email, password }: { email: string; password: string } = req.body;

    const getUser = await User.findOne({
      where: {
        email,
      },
    });

    const thePassword = bcryptCompare(password, `${getUser?.password}`);

    if (!getUser || !thePassword) {
      return next(new AppError('Invalid user credentials', 401));
    }

    if (!getUser?.isEnabled) {
      return next(new AppError('Account disabled', 401));
    }

    AuthController.createSession(getUser, req, res, next);
  }

  /**
   * Logout user from session
   * @param req Request
   * @param res Response
   * @param next NextFunction
   * @returns {Promise<void | Record<string, any>>}
   */
  static async Logout(req: Request, res: Response, next: NextFunction) {
    const jwtRefreshCookie =
      Cookie.getCookie(req)[`${process.env.JWT_REFRESH_COOKIE_NAME}`];

    const decodedItem: JwtPayload = (await decodeJWTToken(
      jwtRefreshCookie,
      `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
    )) as JwtPayload;

    await Session.destroy({
      where: {
        token: decodedItem?.token,
      },
    });

    // Invalidate cookies
    res.clearCookie(`${process.env.JWT_ACCESS_COOKIE_NAME}`);
    res.clearCookie(`${process.env.JWT_REFRESH_COOKIE_NAME}`);

    return res.status(200).json({
      status: 'success',
      message: 'Logout success',
    });
  }
}
