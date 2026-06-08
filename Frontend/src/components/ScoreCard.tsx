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
      <div className="border-b border-blue-700 bg-gradient-to-r from-blue-950 via-blue-800 to-sky-500 px-5 py-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-200">
          Student Number
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-semibold tracking-normal">
            {score.sbd}
          </h2>
          {topAdmissionGroups.length > 0 ? (
            <div className="grid gap-2 sm:min-w-[28rem] sm:grid-cols-3">
              {topAdmissionGroups.map((group) => (
                <div
                  key={group.code}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-3 text-center shadow-sm"
                >
                  <p className="text-xs font-semibold text-amber-300">
                    {group.code}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-normal">
                    {formatScore(group.totalScore)}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-200">
                    {group.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:w-80">
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <p className="text-xs text-slate-300">Subjects</p>
                <p className="mt-1 text-lg font-semibold">
                  {availableScores.length}/9
                </p>
              </div>
              <div className="rounded-lg bg-white/10 px-3 py-2">
                <p className="text-xs text-slate-300">Average</p>
                <p className="mt-1 text-lg font-semibold">
                  {averageScore === null ? "-" : averageScore.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-white">
              <tr>
                <th className="table-head-cell">
                  Subject
                </th>
                <th className="table-head-cell">
                  Group
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {subjects.map((subject) => (
                <tr key={subject.label} className="hover:bg-slate-50">
                  <td className="table-cell font-medium text-slate-900">
                    {subject.label}
                  </td>
                  <td className="table-cell">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                      {subject.group}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-950">
                    {formatScore(subject.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
          <p className="text-sm font-semibold text-teal-900">
            Foreign Language Code
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-teal-950">
            {formatScore(languageCode)}
          </p>
        </div>
      </div>
    </section>
  );
}
