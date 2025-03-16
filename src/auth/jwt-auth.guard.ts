import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGurad extends AuthGuard('jwt') {}
