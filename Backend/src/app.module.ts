import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { ScoresModule } from "./scores/scores.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    ScoresModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
