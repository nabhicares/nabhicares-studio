import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma.service';

// Resolves the tenant for this request (from subdomain, JWT claim, or header)
// and sets it as a Postgres session variable so every query in this request
// is automatically scoped by the RLS policies in prisma/sql/rls.sql.
//
// This is the ONLY place tenant scoping should be "trusted" from - never
// pull tenantId from a request body or query param for filtering.

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isSuperAdmin = req.user?.role === 'SUPER_ADMIN';
    const tenantId = req.user?.tenantId;

    const isValidUuid = (v: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

    if (isSuperAdmin) {
      await this.prisma.$executeRawUnsafe(`SET app.is_super_admin = 'true'`);
    } else if (tenantId && isValidUuid(tenantId)) {
      // Safe to interpolate only because we've just validated it's a UUID -
      // $executeRawUnsafe doesn't parameterize SET, so this check is load-bearing.
      await this.prisma.$executeRawUnsafe(
        `SET app.current_tenant_id = '${tenantId}'`,
      );
    }
    // No tenant resolved -> RLS policies default-deny. Request will get
    // empty results rather than an error, which is the safe failure mode.

    next();
  }
}
