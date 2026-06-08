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

type DashboardAggregateRow = Record<string, number | null> & {
  total_candidates: number;
};

type ScoreDistributionRow = {
  score: number;
  count: number;
};

type SubjectAverageItem = {
  code: string;
  name: string;
  displayName: string;
  average: number | null;
  candidateCount: number;
  candidatePercentage: number;
};

type ScoreDistributionBucket = {
  score: number;
  label: string;
  lowerBound: number;
  upperBound: number;
  count: number;
};

type SubjectScoreDistribution = {
  code: string;
  name: string;
  displayName: string;
  candidateCount: number;
  buckets: ScoreDistributionBucket[];
};

type DashboardReport = {
  summary: {
    examYear: number;
    totalCandidates: number;
  };
  subjectAverages: SubjectAverageItem[];
  mathScoreDistribution: ScoreDistributionBucket[];
  subjectScoreDistributions: SubjectScoreDistribution[];
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

  async getDashboard(): Promise<DashboardReport> {
    const [aggregateRows, subjectScoreDistributions] = await Promise.all([
      this.getDashboardAggregates(),
      this.getSubjectScoreDistributions(),
    ]);
    const aggregate = aggregateRows[0] ?? { total_candidates: 0 };
    const totalCandidates = this.toNumber(aggregate.total_candidates);
    const mathScoreDistribution =
      subjectScoreDistributions.find((subject) => subject.code === "toan")
        ?.buckets ?? [];

    return {
      summary: {
        examYear: 2024,
        totalCandidates,
      },
      subjectAverages: SUBJECTS.map((subject) =>
        this.toSubjectAverageItem(subject, aggregate, totalCandidates),
      ),
      mathScoreDistribution,
      subjectScoreDistributions,
    };
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

  private getDashboardAggregates(): Promise<DashboardAggregateRow[]> {
    return this.prisma.$queryRaw<DashboardAggregateRow[]>`
      SELECT
        COUNT(*)::int AS total_candidates,
        COUNT(toan)::int AS toan_count,
        ROUND(AVG(toan)::numeric, 2)::double precision AS toan_average,
        COUNT(ngu_van)::int AS ngu_van_count,
        ROUND(AVG(ngu_van)::numeric, 2)::double precision AS ngu_van_average,
        COUNT(ngoai_ngu)::int AS ngoai_ngu_count,
        ROUND(AVG(ngoai_ngu)::numeric, 2)::double precision AS ngoai_ngu_average,
        COUNT(vat_li)::int AS vat_li_count,
        ROUND(AVG(vat_li)::numeric, 2)::double precision AS vat_li_average,
        COUNT(hoa_hoc)::int AS hoa_hoc_count,
        ROUND(AVG(hoa_hoc)::numeric, 2)::double precision AS hoa_hoc_average,
        COUNT(sinh_hoc)::int AS sinh_hoc_count,
        ROUND(AVG(sinh_hoc)::numeric, 2)::double precision AS sinh_hoc_average,
        COUNT(lich_su)::int AS lich_su_count,
        ROUND(AVG(lich_su)::numeric, 2)::double precision AS lich_su_average,
        COUNT(dia_li)::int AS dia_li_count,
        ROUND(AVG(dia_li)::numeric, 2)::double precision AS dia_li_average,
        COUNT(gdcd)::int AS gdcd_count,
        ROUND(AVG(gdcd)::numeric, 2)::double precision AS gdcd_average
      FROM exam_scores
    `;
  }

  private getSubjectScoreDistributions(): Promise<SubjectScoreDistribution[]> {
    return Promise.all(
      SUBJECTS.map(async (subject) =>
        this.getSubjectScoreDistribution(subject),
      ),
    );
  }

  private async getSubjectScoreDistribution(
    subject: Subject,
  ): Promise<SubjectScoreDistribution> {
    const column = Prisma.raw(subject.code);
    const rows = await this.prisma.$queryRaw<ScoreDistributionRow[]>(
      Prisma.sql`
        WITH score_buckets AS (
          SELECT LEAST(FLOOR(${column} * 2) / 2, 9.5::double precision) AS score
          FROM exam_scores
          WHERE ${column} IS NOT NULL
        )
        SELECT score, COUNT(*)::int AS count
        FROM score_buckets
        GROUP BY score
        ORDER BY score
      `,
    );
    const buckets = this.buildHalfPointBuckets(rows);

    return {
      code: subject.code,
      name: subject.name,
      displayName: subject.displayName,
      candidateCount: buckets.reduce((total, bucket) => total + bucket.count, 0),
      buckets,
    };
  }

  private toSubjectAverageItem(
    subject: Subject,
    aggregate: DashboardAggregateRow,
    totalCandidates: number,
  ): SubjectAverageItem {
    const candidateCount = this.toNumber(aggregate[`${subject.code}_count`]);
    const average = this.toNullableNumber(aggregate[`${subject.code}_average`]);

    return {
      code: subject.code,
      name: subject.name,
      displayName: subject.displayName,
      average,
      candidateCount,
      candidatePercentage:
        totalCandidates === 0
          ? 0
          : this.roundTo((candidateCount / totalCandidates) * 100, 2),
    };
  }

  private buildHalfPointBuckets(
    rows: ScoreDistributionRow[],
  ): ScoreDistributionBucket[] {
    const countsByScore = new Map(
      rows.map((row) => [
        this.getScoreKey(row.score),
        this.toNumber(row.count),
      ]),
    );

    return Array.from({ length: 20 }, (_, index) => {
      const score = this.roundTo(index * 0.5, 1);
      const upperBound = index === 19 ? 10 : this.roundTo(score + 0.5, 1);

      return {
        score,
        label: score.toString(),
        lowerBound: score,
        upperBound,
        count: countsByScore.get(this.getScoreKey(score)) ?? 0,
      };
    });
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

  private toNumber(value: number | bigint | null | undefined): number {
    if (typeof value === "bigint") {
      return Number(value);
    }

    return value ?? 0;
  }

  private toNullableNumber(
    value: number | bigint | null | undefined,
  ): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    return this.toNumber(value);
  }

  private roundTo(value: number, digits: number): number {
    return Number(value.toFixed(digits));
  }

  private getScoreKey(score: number): string {
    return score.toFixed(1);
  }

  private serializeExamScore(score: ExamScore): SerializedExamScore {
    return {
      ...score,
      id: score.id.toString(),
    };
  }
}
