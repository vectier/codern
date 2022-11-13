import {
  Controller, Get, Headers, Inject, Ip, Query, Redirect, Res,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { GoogleAuthUrlResponse } from 'api-types';
import { FastifyReply } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/services/AuthService';

@Controller('/auth')
export class AuthController {

  private readonly client: ClientGrpc;
  private readonly configService: ConfigService;

  public constructor(
    configService: ConfigService,
    @Inject('AUTH_PACKAGE') client: ClientGrpc,
  ) {
    this.client = client;
    this.configService = configService;
  }

  @Get('/google')
  public getGoogleOAuthUrl(): Observable<GoogleAuthUrlResponse> {
    const service = this.client.getService<AuthService>('AuthService');
    return service.getGoogleOAuthUrl({});
  }

  @Redirect()
  @Get('/google/callback')
  public async loginWithGoogle(
    @Query('code') code: string,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<{ url: string }> {
    const loginUrl = this.configService.get('frontendLoginUrl');
    const homeUrl = this.configService.get('frontendHomeUrl');
    const service = this.client.getService<AuthService>('AuthService');

    try {
      const result = await firstValueFrom(service.loginWithGoogle({ code, userAgent, ipAddress }));
      response.header('Set-Cookie', result.cookieHeader);
      return { url: homeUrl };
    } catch {
      return { url: loginUrl };
    }
  }

}