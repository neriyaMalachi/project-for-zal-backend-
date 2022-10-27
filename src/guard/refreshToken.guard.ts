import { AuthGuard } from '@nestjs/passport';

export class JwtRefreshTokenGuard extends AuthGuard(['jwt-ref', 'ref-admin']) {
  constructor() {
    super();
  }
}