import { Injectable, NotFoundException } from "@nestjs/common";
import { ExamScore, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { Subject, SUBJECTS } from "./models/subject.model";

type SerializedExamScore = Omit<ExamScore, "id"> & {
  id: string;
};

type ScoreLevelsReportItem = {
  subject: string;
  excellent: number;
  good: number;
  average: number;
  poor: number;
};

type GroupAScoreRow = {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  tong_diem: number;
};

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findBySbd(sbd: string): Promise<SerializedExamScore> {
    const score = await this.prisma.examScore.findUnique({
      where: {
        sbd,
      },
    });

    if (!score) {
      throw new NotFoundException(`No score found for student number ${sbd}.`);
    }

    return this.serializeExamScore(score);
  }

  async getScoreLevelsReport(): Promise<ScoreLevelsReportItem[]> {
    return Promise.all(
      SUBJECTS.map(async (subject) => this.getSubjectScoreLevels(subject)),
    );
  }

  async getTopGroupA(): Promise<GroupAScoreRow[]> {
    return this.prisma.$queryRaw<GroupAScoreRow[]>`
      SELECT
        sbd,
        toan,
        vat_li,
        hoa_hoc,
        (toan + vat_li + hoa_hoc) AS tong_diem
      FROM exam_scores
      WHERE toan IS NOT NULL
        AND vat_li IS NOT NULL
        AND hoa_hoc IS NOT NULL
      ORDER BY tong_diem DESC
      LIMIT 10
    `;
  }

  private async getSubjectScoreLevels(
    subject: Subject,
  ): Promise<ScoreLevelsReportItem> {
    const [excellent, good, average, poor] = await this.prisma.$transaction([
      this.prisma.examScore.count({
        where: this.buildScoreWhere(subject, { gte: 8 }),
      }),
      this.prisma.examScore.count({
        where: this.buildScoreWhere(subject, { gte: 6, lt: 8 }),
      }),
      this.prisma.examScore.count({
        where: this.buildScoreWhere(subject, { gte: 4, lt: 6 }),
      }),
      this.prisma.examScore.count({
        where: this.buildScoreWhere(subject, { lt: 4 }),
      }),
    ]);

    return {
      subject: subject.name,
      excellent,
      good,
      average,
      poor,
    };
  }

  private buildScoreWhere(
    subject: Subject,
    filter: Prisma.FloatNullableFilter<"ExamScore">,
  ): Prisma.ExamScoreWhereInput {
    return {
      [subject.scoreField]: filter,
    };
  }

  private serializeExamScore(score: ExamScore): SerializedExamScore {
    return {
      ...score,
      id: score.id.toString(),
    };
  }
}
