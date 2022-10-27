import { AuthGuard } from '@nestjs/passport';

export class JwtAccessTokenGuard extends AuthGuard(['jwt', 'jwt-admin']) {
  constructor() {
    super();
  }
}