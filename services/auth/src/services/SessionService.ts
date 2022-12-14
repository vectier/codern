import crypto from 'crypto';
import cookie from 'cookie';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Session } from '@prisma/client';
import { Timestamp } from '@codern/shared';
import { ExpectedInvalidError } from '@codern/internal';
import { SessionRepository } from '@/repositories/SessionRepository';
import { SessionError } from '@/utils/errors/SessionError';

@Injectable()
export class SessionService {

  public static readonly SESSION_MAX_AGE_IN_SEC = 60 * 60 * 24 * 7;
  public static readonly SESSION_SIGN_PREFIX = '$:';

  private readonly configService: ConfigService;
  private readonly sessionRepository: SessionRepository;

  public constructor(
    configService: ConfigService,
    sessionRepository: SessionRepository,
  ) {
    this.configService = configService;
    this.sessionRepository = sessionRepository;
  }

  public signSessionId(id: string): string {
    const secretKey = this.configService.get('sessionSecret');
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(id)
      .digest('base64')
      // eslint-disable-next-line no-useless-escape
      .replace(/\=+$/, '');
    return `${SessionService.SESSION_SIGN_PREFIX}${id}.${signature}`;
  }

  public unSignSessionId(input: string): string | null {
    const prefix = SessionService.SESSION_SIGN_PREFIX;
    if (!input.startsWith(prefix)) return null;

    const payload = input.slice(prefix.length, input.lastIndexOf('.'));
    const expectedInput = this.signSessionId(payload);
    const expectedBuffer = Buffer.from(expectedInput);
    const inputBuffer = Buffer.from(input);

    return (
      (expectedBuffer.length === inputBuffer.length)
      && (crypto.timingSafeEqual(expectedBuffer, inputBuffer))
    ) ? payload : null;
  }

  public async getSession(input: string): Promise<Session | null> {
    const sessionId = this.unSignSessionId(input);
    if (!sessionId) return null;

    const session = await this.sessionRepository.getSessionById(sessionId);
    if (!session) return null;

    return session;
  }

  public async validateSessionOrThrow(incomingSession: string): Promise<Session> {
    const session = await this.getSession(incomingSession);
    if (!session) throw new ExpectedInvalidError(SessionError.Invalid);

    if (Timestamp.now() >= session.expiryAt) {
      this.destroySession(session.id);
      throw new ExpectedInvalidError(SessionError.Expired);
    }

    return session;
  }

  public async createSession(
    userId: string,
    userAgent: string,
    ipAddress: string,
  ): Promise<string> {
    await this.sessionRepository.deleteSession({ userId, userAgent, ipAddress });

    const sessionId = crypto.randomUUID();
    const signedSessionId = this.signSessionId(sessionId);
    const createdAt = Timestamp.now();
    const expiryAt = createdAt + SessionService.SESSION_MAX_AGE_IN_SEC;
    const cookieHeader = cookie.serialize('sid', signedSessionId, {
      path: '/',
      httpOnly: true,
      maxAge: SessionService.SESSION_MAX_AGE_IN_SEC,
    });

    await this.sessionRepository.createSession({
      id: sessionId,
      user: { connect: { id: userId } },
      ipAddress,
      userAgent,
      expiryAt,
      createdAt,
    });

    return cookieHeader;
  }

  public destroySession(id: string): Promise<void> {
    return this.sessionRepository.deleteSession({ id });
  }

  public destroySessionCookie(): string {
    return cookie.serialize('sid', '', {
      path: '/',
      maxAge: 0,
    });
  }

}
