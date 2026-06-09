import { Injectable, NotFoundException } from "@nestjs/common";
import { ExamScore, Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { ScoreField, Subject, SUBJECTS } from "./models/subject.model";
import {
  AdmissionGroupScoringStrategy,
  SumAdmissionGroupScoringStrategy,
} from "./strategies/admission-group-scoring.strategy";

type SerializedExamScore = Omit<ExamScore, "id"> & {
  id: string;
  topAdmissionGroups: AdmissionGroupScore[];
};

type AdmissionGroupSubject = {
  field: ScoreField;
  label: string;
};

type AdmissionGroupDefinition = {
  code: string;
  name: string;
  subjects: AdmissionGroupSubject[];
};

type AdmissionGroupScore = {
  code: string;
  name: string;
  subjects: string[];
  totalScore: number;
};

type AdmissionGroupOption = {
  code: string;
  name: string;
  subjects: AdmissionGroupSubject[];
};

type TopAdmissionGroupSubjectScore = AdmissionGroupSubject & {
  score: number;
};

type TopAdmissionGroupStudent = {
  sbd: string;
  subjects: TopAdmissionGroupSubjectScore[];
  totalScore: number;
};

type TopAdmissionGroupReport = {
  group: AdmissionGroupOption;
  students: TopAdmissionGroupStudent[];
};

type ScoreLevelsReportItem = {
  subject: string;
  excellent: number;
  good: number;
  average: number;
  poor: number;
};

type ScoreLevelsAggregateRow = Record<string, number | null>;

type ScoreLevelKey = "excellent" | "good" | "average" | "poor";

type GroupAScoreRow = {
  sbd: string;
  toan: number;
  vat_li: number;
  hoa_hoc: number;
  tong_diem: number;
};

type TopAdmissionGroupRow = {
  sbd: string;
  total_score: number;
  [key: string]: number | string;
};

type DashboardAggregateRow = Record<string, number | null> & {
  total_candidates: number;
};

type ScoreDistributionRow = {
  score: number;
  count: number;
};

type ScoreDistributionBySubjectRow = ScoreDistributionRow & {
  subject_code: string;
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

const ADMISSION_GROUPS: readonly AdmissionGroupDefinition[] = [
  {
    code: "A00",
    name: "Math-Physics-Chemistry",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "vatLi", label: "Physics" },
      { field: "hoaHoc", label: "Chemistry" },
    ],
  },
  {
    code: "A01",
    name: "Math-Physics-English",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "vatLi", label: "Physics" },
      { field: "ngoaiNgu", label: "Foreign Language" },
    ],
  },
  {
    code: "A02",
    name: "Math-Physics-Biology",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "vatLi", label: "Physics" },
      { field: "sinhHoc", label: "Biology" },
    ],
  },
  {
    code: "B00",
    name: "Math-Chemistry-Biology",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "hoaHoc", label: "Chemistry" },
      { field: "sinhHoc", label: "Biology" },
    ],
  },
  {
    code: "C00",
    name: "Literature-History-Geography",
    subjects: [
      { field: "nguVan", label: "Literature" },
      { field: "lichSu", label: "History" },
      { field: "diaLi", label: "Geography" },
    ],
  },
  {
    code: "D01",
    name: "Math-Literature-English",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "nguVan", label: "Literature" },
      { field: "ngoaiNgu", label: "Foreign Language" },
    ],
  },
  {
    code: "D07",
    name: "Math-Chemistry-English",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "hoaHoc", label: "Chemistry" },
      { field: "ngoaiNgu", label: "Foreign Language" },
    ],
  },
  {
    code: "D08",
    name: "Math-Biology-English",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "sinhHoc", label: "Biology" },
      { field: "ngoaiNgu", label: "Foreign Language" },
    ],
  },
  {
    code: "D09",
    name: "Math-History-English",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "lichSu", label: "History" },
      { field: "ngoaiNgu", label: "Foreign Language" },
    ],
  },
  {
    code: "D10",
    name: "Math-Geography-English",
    subjects: [
      { field: "toan", label: "Math" },
      { field: "diaLi", label: "Geography" },
      { field: "ngoaiNgu", label: "Foreign Language" },
    ],
  },
];

@Injectable()
export class ScoresService {
  private dashboardCache: DashboardReport | null = null;
  private dashboardCacheGeneratedAt = 0;
  private dashboardCachePromise: Promise<DashboardReport> | null = null;
  private readonly dashboardCacheTtlMs = 10 * 60 * 1000;
  private scoreLevelsReportCache: ScoreLevelsReportItem[] | null = null;
  private scoreLevelsReportCacheGeneratedAt = 0;
  private scoreLevelsReportCachePromise: Promise<
    ScoreLevelsReportItem[]
  > | null = null;
  private readonly scoreLevelsReportCacheTtlMs = 10 * 60 * 1000;
  private topGroupACache: GroupAScoreRow[] | null = null;
  private topGroupACacheGeneratedAt = 0;
  private topGroupACachePromise: Promise<GroupAScoreRow[]> | null = null;
  private readonly topGroupACacheTtlMs = 10 * 60 * 1000;
  private readonly topAdmissionGroupCache = new Map<
    string,
    { generatedAt: number; report: TopAdmissionGroupReport }
  >();
  private readonly topAdmissionGroupCachePromises = new Map<
    string,
    Promise<TopAdmissionGroupReport>
  >();
  private readonly topAdmissionGroupCacheTtlMs = 10 * 60 * 1000;
  private readonly admissionGroupScoringStrategy: AdmissionGroupScoringStrategy =
    new SumAdmissionGroupScoringStrategy();

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
    const now = Date.now();

    if (
      this.scoreLevelsReportCache &&
      now - this.scoreLevelsReportCacheGeneratedAt <
        this.scoreLevelsReportCacheTtlMs
    ) {
      return this.scoreLevelsReportCache;
    }

    if (this.scoreLevelsReportCachePromise) {
      return this.scoreLevelsReportCachePromise;
    }

    this.scoreLevelsReportCachePromise = this.buildScoreLevelsReport()
      .then((report) => {
        this.scoreLevelsReportCache = report;
        this.scoreLevelsReportCacheGeneratedAt = Date.now();
        return report;
      })
      .finally(() => {
        this.scoreLevelsReportCachePromise = null;
      });

    return this.scoreLevelsReportCachePromise;
  }

  async getDashboard(): Promise<DashboardReport> {
    const now = Date.now();

    if (
      this.dashboardCache &&
      now - this.dashboardCacheGeneratedAt < this.dashboardCacheTtlMs
    ) {
      return this.dashboardCache;
    }

    if (this.dashboardCachePromise) {
      return this.dashboardCachePromise;
    }

    this.dashboardCachePromise = this.buildDashboard()
      .then((report) => {
        this.dashboardCache = report;
        this.dashboardCacheGeneratedAt = Date.now();
        return report;
      })
      .finally(() => {
        this.dashboardCachePromise = null;
      });

    return this.dashboardCachePromise;
  }

  private async buildDashboard(): Promise<DashboardReport> {
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
    const now = Date.now();

    if (
      this.topGroupACache &&
      now - this.topGroupACacheGeneratedAt < this.topGroupACacheTtlMs
    ) {
      return this.topGroupACache;
    }

    if (this.topGroupACachePromise) {
      return this.topGroupACachePromise;
    }

    this.topGroupACachePromise = this.buildTopGroupA()
      .then((report) => {
        this.topGroupACache = report;
        this.topGroupACacheGeneratedAt = Date.now();
        return report;
      })
      .finally(() => {
        this.topGroupACachePromise = null;
      });

    return this.topGroupACachePromise;
  }

  getAdmissionGroups(): AdmissionGroupOption[] {
    return ADMISSION_GROUPS.map((group) => this.toAdmissionGroupOption(group));
  }

  async getTopAdmissionGroup(
    groupCode: string,
  ): Promise<TopAdmissionGroupReport> {
    const normalizedGroupCode = groupCode.trim().toUpperCase();
    const cachedReport = this.topAdmissionGroupCache.get(normalizedGroupCode);
    const now = Date.now();

    if (
      cachedReport &&
      now - cachedReport.generatedAt < this.topAdmissionGroupCacheTtlMs
    ) {
      return cachedReport.report;
    }

    const pendingReport =
      this.topAdmissionGroupCachePromises.get(normalizedGroupCode);

    if (pendingReport) {
      return pendingReport;
    }

    const reportPromise = this.buildTopAdmissionGroup(normalizedGroupCode)
      .then((report) => {
        this.topAdmissionGroupCache.set(normalizedGroupCode, {
          generatedAt: Date.now(),
          report,
        });
        return report;
      })
      .finally(() => {
        this.topAdmissionGroupCachePromises.delete(normalizedGroupCode);
      });

    this.topAdmissionGroupCachePromises.set(normalizedGroupCode, reportPromise);

    return reportPromise;
  }

  private buildTopGroupA(): Promise<GroupAScoreRow[]> {
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
      ORDER BY (toan + vat_li + hoa_hoc) DESC, sbd ASC
      LIMIT 10
    `;
  }

  private async buildTopAdmissionGroup(
    groupCode: string,
  ): Promise<TopAdmissionGroupReport> {
    const group = this.getAdmissionGroupDefinition(groupCode);
    const subjectColumns = group.subjects.map((subject) =>
      Prisma.raw(this.getScoreDbColumn(subject.field)),
    );
    const scoreSelections = subjectColumns.map((column, index) =>
      Prisma.sql`${column} AS ${Prisma.raw(`subject_${index + 1}_score`)}`,
    );
    const notNullConditions = subjectColumns.map(
      (column) => Prisma.sql`${column} IS NOT NULL`,
    );
    const totalExpression =
      this.admissionGroupScoringStrategy.buildTotalScoreSqlExpression(
        subjectColumns,
      );

    const rows = await this.prisma.$queryRaw<TopAdmissionGroupRow[]>(Prisma.sql`
      SELECT
        sbd,
        ${Prisma.join(scoreSelections)},
        ${totalExpression} AS total_score
      FROM exam_scores
      WHERE ${Prisma.join(notNullConditions, " AND ")}
      ORDER BY total_score DESC, sbd ASC
      LIMIT 10
    `);

    return {
      group: this.toAdmissionGroupOption(group),
      students: rows.map((row) => ({
        sbd: row.sbd,
        subjects: group.subjects.map((subject, index) => ({
          ...subject,
          score: this.toNumber(row[`subject_${index + 1}_score`] as number),
        })),
        totalScore: this.roundTo(this.toNumber(row.total_score), 2),
      })),
    };
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

  private async getSubjectScoreDistributions(): Promise<
    SubjectScoreDistribution[]
  > {
    const rows = await this.prisma.$queryRaw<ScoreDistributionBySubjectRow[]>`
      WITH score_buckets AS (
        SELECT
          subject_scores.subject_code,
          LEAST(
            FLOOR(subject_scores.score * 2) / 2,
            9.5::double precision
          ) AS score
        FROM exam_scores
        CROSS JOIN LATERAL (
          VALUES
            ('toan', toan),
            ('ngu_van', ngu_van),
            ('ngoai_ngu', ngoai_ngu),
            ('vat_li', vat_li),
            ('hoa_hoc', hoa_hoc),
            ('sinh_hoc', sinh_hoc),
            ('lich_su', lich_su),
            ('dia_li', dia_li),
            ('gdcd', gdcd)
        ) AS subject_scores(subject_code, score)
        WHERE subject_scores.score IS NOT NULL
      )
      SELECT subject_code, score, COUNT(*)::int AS count
      FROM score_buckets
      GROUP BY subject_code, score
      ORDER BY subject_code, score
    `;
    const rowsBySubject = new Map<string, ScoreDistributionRow[]>();

    for (const row of rows) {
      const subjectRows = rowsBySubject.get(row.subject_code) ?? [];
      subjectRows.push({
        score: row.score,
        count: row.count,
      });
      rowsBySubject.set(row.subject_code, subjectRows);
    }

    return SUBJECTS.map((subject) => {
      const buckets = this.buildHalfPointBuckets(
        rowsBySubject.get(subject.code) ?? [],
      );

      return {
        code: subject.code,
        name: subject.name,
        displayName: subject.displayName,
        candidateCount: buckets.reduce(
          (total, bucket) => total + bucket.count,
          0,
        ),
        buckets,
      };
    });
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
        label: this.formatScoreRangeLabel(score, upperBound),
        lowerBound: score,
        upperBound,
        count: countsByScore.get(this.getScoreKey(score)) ?? 0,
      };
    });
  }

  private formatScoreRangeLabel(lowerBound: number, upperBound: number): string {
    return `${this.formatScoreLabel(lowerBound)} - ${this.formatScoreLabel(
      upperBound,
    )}`;
  }

  private formatScoreLabel(score: number): string {
    return score.toString();
  }

  private async buildScoreLevelsReport(): Promise<ScoreLevelsReportItem[]> {
    const rows = await this.prisma.$queryRaw<ScoreLevelsAggregateRow[]>`
      SELECT
        COUNT(*) FILTER (WHERE toan >= 8)::int AS toan_excellent,
        COUNT(*) FILTER (WHERE toan >= 6 AND toan < 8)::int AS toan_good,
        COUNT(*) FILTER (WHERE toan >= 4 AND toan < 6)::int AS toan_average,
        COUNT(*) FILTER (WHERE toan < 4)::int AS toan_poor,

        COUNT(*) FILTER (WHERE ngu_van >= 8)::int AS ngu_van_excellent,
        COUNT(*) FILTER (WHERE ngu_van >= 6 AND ngu_van < 8)::int AS ngu_van_good,
        COUNT(*) FILTER (WHERE ngu_van >= 4 AND ngu_van < 6)::int AS ngu_van_average,
        COUNT(*) FILTER (WHERE ngu_van < 4)::int AS ngu_van_poor,

        COUNT(*) FILTER (WHERE ngoai_ngu >= 8)::int AS ngoai_ngu_excellent,
        COUNT(*) FILTER (WHERE ngoai_ngu >= 6 AND ngoai_ngu < 8)::int AS ngoai_ngu_good,
        COUNT(*) FILTER (WHERE ngoai_ngu >= 4 AND ngoai_ngu < 6)::int AS ngoai_ngu_average,
        COUNT(*) FILTER (WHERE ngoai_ngu < 4)::int AS ngoai_ngu_poor,

        COUNT(*) FILTER (WHERE vat_li >= 8)::int AS vat_li_excellent,
        COUNT(*) FILTER (WHERE vat_li >= 6 AND vat_li < 8)::int AS vat_li_good,
        COUNT(*) FILTER (WHERE vat_li >= 4 AND vat_li < 6)::int AS vat_li_average,
        COUNT(*) FILTER (WHERE vat_li < 4)::int AS vat_li_poor,

        COUNT(*) FILTER (WHERE hoa_hoc >= 8)::int AS hoa_hoc_excellent,
        COUNT(*) FILTER (WHERE hoa_hoc >= 6 AND hoa_hoc < 8)::int AS hoa_hoc_good,
        COUNT(*) FILTER (WHERE hoa_hoc >= 4 AND hoa_hoc < 6)::int AS hoa_hoc_average,
        COUNT(*) FILTER (WHERE hoa_hoc < 4)::int AS hoa_hoc_poor,

        COUNT(*) FILTER (WHERE sinh_hoc >= 8)::int AS sinh_hoc_excellent,
        COUNT(*) FILTER (WHERE sinh_hoc >= 6 AND sinh_hoc < 8)::int AS sinh_hoc_good,
        COUNT(*) FILTER (WHERE sinh_hoc >= 4 AND sinh_hoc < 6)::int AS sinh_hoc_average,
        COUNT(*) FILTER (WHERE sinh_hoc < 4)::int AS sinh_hoc_poor,

        COUNT(*) FILTER (WHERE lich_su >= 8)::int AS lich_su_excellent,
        COUNT(*) FILTER (WHERE lich_su >= 6 AND lich_su < 8)::int AS lich_su_good,
        COUNT(*) FILTER (WHERE lich_su >= 4 AND lich_su < 6)::int AS lich_su_average,
        COUNT(*) FILTER (WHERE lich_su < 4)::int AS lich_su_poor,

        COUNT(*) FILTER (WHERE dia_li >= 8)::int AS dia_li_excellent,
        COUNT(*) FILTER (WHERE dia_li >= 6 AND dia_li < 8)::int AS dia_li_good,
        COUNT(*) FILTER (WHERE dia_li >= 4 AND dia_li < 6)::int AS dia_li_average,
        COUNT(*) FILTER (WHERE dia_li < 4)::int AS dia_li_poor,

        COUNT(*) FILTER (WHERE gdcd >= 8)::int AS gdcd_excellent,
        COUNT(*) FILTER (WHERE gdcd >= 6 AND gdcd < 8)::int AS gdcd_good,
        COUNT(*) FILTER (WHERE gdcd >= 4 AND gdcd < 6)::int AS gdcd_average,
        COUNT(*) FILTER (WHERE gdcd < 4)::int AS gdcd_poor
      FROM exam_scores
    `;
    const aggregate = rows[0] ?? {};

    return SUBJECTS.map((subject) => ({
      subject: subject.name,
      excellent: this.readScoreLevelCount(
        aggregate,
        subject.code,
        "excellent",
      ),
      good: this.readScoreLevelCount(aggregate, subject.code, "good"),
      average: this.readScoreLevelCount(aggregate, subject.code, "average"),
      poor: this.readScoreLevelCount(aggregate, subject.code, "poor"),
    }));
  }

  private readScoreLevelCount(
    aggregate: ScoreLevelsAggregateRow,
    subjectCode: string,
    level: ScoreLevelKey,
  ): number {
    return this.toNumber(aggregate[`${subjectCode}_${level}`]);
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

  private toAdmissionGroupOption(
    group: AdmissionGroupDefinition,
  ): AdmissionGroupOption {
    return {
      code: group.code,
      name: group.name,
      subjects: group.subjects,
    };
  }

  private getAdmissionGroupDefinition(
    groupCode: string,
  ): AdmissionGroupDefinition {
    const group = ADMISSION_GROUPS.find((group) => group.code === groupCode);

    if (!group) {
      throw new NotFoundException(`No admission group found for ${groupCode}.`);
    }

    return group;
  }

  private getScoreDbColumn(field: ScoreField): string {
    const columns: Record<ScoreField, string> = {
      toan: "toan",
      nguVan: "ngu_van",
      ngoaiNgu: "ngoai_ngu",
      vatLi: "vat_li",
      hoaHoc: "hoa_hoc",
      sinhHoc: "sinh_hoc",
      lichSu: "lich_su",
      diaLi: "dia_li",
      gdcd: "gdcd",
    };

    return columns[field];
  }

  private getTopAdmissionGroups(score: ExamScore): AdmissionGroupScore[] {
    return ADMISSION_GROUPS.map((group) => {
      const subjectScores = group.subjects.map((subject) => ({
        ...subject,
        score: score[subject.field],
      }));
      const totalScore =
        this.admissionGroupScoringStrategy.calculateTotalScore(subjectScores);

      if (totalScore === null) {
        return null;
      }

      return {
        code: group.code,
        name: group.name,
        subjects: group.subjects.map((subject) => subject.label),
        totalScore: this.roundTo(totalScore, 2),
      };
    })
      .filter((group): group is AdmissionGroupScore => group !== null)
      .sort((left, right) => {
        if (right.totalScore !== left.totalScore) {
          return right.totalScore - left.totalScore;
        }

        return left.code.localeCompare(right.code);
      })
      .slice(0, 3);
  }

  private serializeExamScore(score: ExamScore): SerializedExamScore {
    return {
      ...score,
      id: score.id.toString(),
      topAdmissionGroups: this.getTopAdmissionGroups(score),
    };
  }
}
