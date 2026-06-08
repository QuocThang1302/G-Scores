import type { ExamScore } from "../types/score.type";

type ScoreCardProps = {
  score: ExamScore;
};

type SubjectRow = {
  label: string;
  value: number | null | undefined;
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

  return String(value);
};

export default function ScoreCard({ score }: ScoreCardProps) {
  const subjects: SubjectRow[] = [
    { label: "Math", value: readScore(score, "toan") as number | null },
    {
      label: "Literature",
      value: readScore(score, "nguVan", "ngu_van") as number | null,
    },
    {
      label: "Foreign Language",
      value: readScore(score, "ngoaiNgu", "ngoai_ngu") as number | null,
    },
    {
      label: "Physics",
      value: readScore(score, "vatLi", "vat_li") as number | null,
    },
    {
      label: "Chemistry",
      value: readScore(score, "hoaHoc", "hoa_hoc") as number | null,
    },
    {
      label: "Biology",
      value: readScore(score, "sinhHoc", "sinh_hoc") as number | null,
    },
    {
      label: "History",
      value: readScore(score, "lichSu", "lich_su") as number | null,
    },
    {
      label: "Geography",
      value: readScore(score, "diaLi", "dia_li") as number | null,
    },
    {
      label: "Civic Education",
      value: readScore(score, "gdcd") as number | null,
    },
  ];

  const languageCode = readScore(score, "maNgoaiNgu", "ma_ngoai_ngu");

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Student Number
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
          {score.sbd}
        </h2>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">
                  Subject
                </th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {subjects.map((subject) => (
                <tr key={subject.label} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">
                    {subject.label}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-950">
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
