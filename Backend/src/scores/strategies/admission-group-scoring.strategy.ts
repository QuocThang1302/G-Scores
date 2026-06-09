import { Prisma } from "@prisma/client";

export type AdmissionGroupSubjectScoreInput = {
  score: number | null | undefined;
};

export interface AdmissionGroupScoringStrategy {
  calculateTotalScore(
    subjectScores: readonly AdmissionGroupSubjectScoreInput[],
  ): number | null;
  buildTotalScoreSqlExpression(
    subjectColumns: readonly Prisma.Sql[],
  ): Prisma.Sql;
}

export class SumAdmissionGroupScoringStrategy
  implements AdmissionGroupScoringStrategy
{
  calculateTotalScore(
    subjectScores: readonly AdmissionGroupSubjectScoreInput[],
  ): number | null {
    const scores = subjectScores.map((subject) => subject.score);

    if (
      scores.some(
        (score) =>
          score === null || score === undefined || Number.isNaN(Number(score)),
      )
    ) {
      return null;
    }

    return scores.reduce<number>((total, score) => total + Number(score), 0);
  }

  buildTotalScoreSqlExpression(
    subjectColumns: readonly Prisma.Sql[],
  ): Prisma.Sql {
    return Prisma.sql`(${Prisma.join(subjectColumns, " + ")})`;
  }
}
