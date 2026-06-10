import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get()
  getRootHealth() {
    return this.getHealth();
  }

  @Get("health")
  getHealth() {
    return {
      success: true,
      status: "ok",
      service: "g-scores-api",
      message: "G-Score API is running",
    };
  }
}
