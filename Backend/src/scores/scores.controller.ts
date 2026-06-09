import { Controller, Get, Param } from "@nestjs/common";

import { SearchScoreDto } from "./dto/search-score.dto";
import { ScoresService } from "./scores.service";

@Controller("scores")
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get("reports/score-levels")
  async getScoreLevelsReport() {
    return {
      success: true,
      data: await this.scoresService.getScoreLevelsReport(),
    };
  }

  @Get("dashboard")
  async getDashboard() {
    return {
      success: true,
      data: await this.scoresService.getDashboard(),
    };
  }

  @Get("reports/top-group-a")
  async getTopGroupA() {
    return {
      success: true,
      data: await this.scoresService.getTopGroupA(),
    };
  }

  @Get("reports/top-groups")
  getAdmissionGroups() {
    return {
      success: true,
      data: this.scoresService.getAdmissionGroups(),
    };
  }

  @Get("reports/top-groups/:groupCode")
  async getTopAdmissionGroup(@Param("groupCode") groupCode: string) {
    return {
      success: true,
      data: await this.scoresService.getTopAdmissionGroup(groupCode),
    };
  }

  @Get(":sbd")
  async findBySbd(@Param() params: SearchScoreDto) {
    return {
      success: true,
      data: await this.scoresService.findBySbd(params.sbd),
    };
  }
}
