import { AuthGuard } from '@nestjs/passport';

export class JwtAdminAccessTokenGuard extends AuthGuard('jwt-admin') {
  constructor() {
    super();
  }
}