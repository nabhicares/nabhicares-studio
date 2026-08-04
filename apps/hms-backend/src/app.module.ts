import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { TenantMiddleware } from './modules/tenant/tenant.middleware';

// Feature modules (identity, patients, appointments, pharmacy, billing) each
// own their tables and expose a service interface - no module reaches into
// another module's Prisma models directly. That boundary is what lets any
// one of these become its own microservice later without a rewrite.

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
