import { AuthGuard } from '@nestjs/passport';

export class JwtRefreshAdminTokenGuard extends AuthGuard('ref-admin') {
  constructor() {
    super();
  }
}