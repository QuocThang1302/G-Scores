import type { ExamScore } from "../types/score.type";

type ScoreCardProps = {
  score: ExamScore;
};

type SubjectRow = {
  label: string;
  value: number | null | undefined;
  group: "Core" | "Science" | "Social";
};

const readScore = (
  score: ExamScore,
  camelKey: keyof ExamScore,
  snakeKey?: keyof ExamScore,
) => {
  const camelValue = score[camelKey];
  const snakeValue = snakeKey ? score[snakeKey] : undefined;
  return camelValue ?? snakeValue;
};

const formatScore = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return String(value);
};

export default function ScoreCard({ score }: ScoreCardProps) {
  const subjects: SubjectRow[] = [
    {
      label: "Math",
      value: readScore(score, "toan") as number | null,
      group: "Core",
    },
    {
      label: "Literature",
      value: readScore(score, "nguVan", "ngu_van") as number | null,
      group: "Core",
    },
    {
      label: "Foreign Language",
      value: readScore(score, "ngoaiNgu", "ngoai_ngu") as number | null,
      group: "Core",
    },
    {
      label: "Physics",
      value: readScore(score, "vatLi", "vat_li") as number | null,
      group: "Science",
    },
    {
      label: "Chemistry",
      value: readScore(score, "hoaHoc", "hoa_hoc") as number | null,
      group: "Science",
    },
    {
      label: "Biology",
      value: readScore(score, "sinhHoc", "sinh_hoc") as number | null,
      group: "Science",
    },
    {
      label: "History",
      value: readScore(score, "lichSu", "lich_su") as number | null,
      group: "Social",
    },
    {
      label: "Geography",
      value: readScore(score, "diaLi", "dia_li") as number | null,
      group: "Social",
    },
    {
      label: "Civic Education",
      value: readScore(score, "gdcd") as number | null,
      group: "Social",
    },
  ];

  const languageCode = readScore(score, "maNgoaiNgu", "ma_ngoai_ngu") as
    | string
    | null
    | undefined;
  const topAdmissionGroups = score.topAdmissionGroups ?? [];
  const availableScores = subjects.filter(
    (subject) => subject.value !== null && subject.value !== undefined,
  );
  const averageScore =
    availableScores.length > 0
      ? availableScores.reduce(
          (total, subject) => total + Number(subject.value),
          0,
        ) / availableScores.length
      : null;

  return (
    <section className="panel overflow-hidden">
      <div className="score-hero border-b border-divider-strong px-5 py-5">
        <p className="score-hero-muted text-xs font-semibold uppercase tracking-wider">
          Student Number
        </p>
        <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_28rem] sm:items-end">
          <h2 className="break-all text-3xl font-semibold tracking-normal sm:self-end">
            {score.sbd}
          </h2>
          {topAdmissionGroups.length > 0 ? (
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              {topAdmissionGroups.map((group) => (
                <div
                  key={group.code}
                  className="score-hero-tile flex h-24 flex-col items-center justify-center rounded-lg px-3 py-3 text-center shadow-sm"
                >
                  <p className="text-xs font-semibold">
                    {group.code}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-normal">
                    {formatScore(group.totalScore)}
                  </p>
                  <p className="score-hero-muted mt-1 truncate text-xs">
                    {group.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:w-80 sm:justify-self-end">
              <div className="score-hero-tile rounded-lg px-3 py-2">
                <p className="score-hero-muted text-xs">Subjects</p>
                <p className="mt-1 text-lg font-semibold">
                  {availableScores.length}/9
                </p>
              </div>
              <div className="score-hero-tile rounded-lg px-3 py-2">
                <p className="score-hero-muted text-xs">Average</p>
                <p className="mt-1 text-lg font-semibold">
                  {averageScore === null ? "-" : averageScore.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid min-w-0 gap-4 p-5 lg:grid-cols-[1fr_220px]">
        <div className="max-w-full overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-full table-fixed divide-y divide-border text-sm sm:min-w-[480px]">
            <thead className="bg-surface">
              <tr>
                <th className="w-[52%] table-head-cell sm:w-[58%] xl:w-[82%]">
                  Subject
                </th>
                <th className="w-[26%] table-head-cell sm:w-[26%] xl:w-[11%]">
                  Group
                </th>
                <th className="w-[22%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-subtle sm:w-[16%] xl:w-[7%]">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted bg-surface">
              {subjects.map((subject) => (
                <tr key={subject.label} className="hover:bg-surface-raised">
                  <td className="table-cell font-medium text-foreground">
                    {subject.label}
                  </td>
                  <td className="table-cell">
                    <span className="rounded-md bg-surface-muted px-1.5 py-1 text-xs font-medium text-muted sm:px-2">
                      {subject.group}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-foreground">
                    {formatScore(subject.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-border bg-surface-raised p-4">
          <p className="text-sm font-semibold text-foreground">
            Foreign Language Code
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-foreground">
            {formatScore(languageCode)}
          </p>
        </div>
      </div>
    </section>
  );
}
