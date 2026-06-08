import { useEffect, useMemo, useState } from "react";
import { Award, Medal, Trophy } from "lucide-react";

import { getTopGroupA } from "../api/scoreApi";
import { TopGroupASkeleton } from "../components/Skeleton";
import type { TopGroupAStudent } from "../types/score.type";

type TopGroupARow = {
  sbd: string;
  math: number | null;
  physics: number | null;
  chemistry: number | null;
  total: number | null;
};

const readNumber = (
  item: TopGroupAStudent,
  keys: Array<keyof TopGroupAStudent>,
) => {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);

      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
};

const formatScore = (value: number | null) =>
  value === null ? "-" : value.toFixed(2).replace(/\.00$/, "");

const normalizeRows = (students: TopGroupAStudent[]): TopGroupARow[] =>
  students.map((student) => {
    const math = readNumber(student, ["toan"]);
    const physics = readNumber(student, ["vatLi", "vat_li"]);
    const chemistry = readNumber(student, ["hoaHoc", "hoa_hoc"]);
    const apiTotal = readNumber(student, [
      "tong_diem",
      "totalGroupA",
      "groupAScore",
      "totalScore",
    ]);
    const fallbackTotal =
      math !== null && physics !== null && chemistry !== null
        ? math + physics + chemistry
        : null;

    return {
      sbd: student.sbd,
      math,
      physics,
      chemistry,
      total: apiTotal ?? fallbackTotal,
    };
  });

export default function TopGroupAPage() {
  const [students, setStudents] = useState<TopGroupAStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTopStudents = async () => {
      try {
        const result = await getTopGroupA();

        if (isMounted) {
          setStudents(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error("Failed to load top Group A students", error);

        if (isMounted) {
          setError("Unable to load the top Group A ranking right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadTopStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  const rows = useMemo(() => normalizeRows(students), [students]);
  const podium = rows.slice(0, 3);
  const podiumIcons = [Trophy, Medal, Award];
  const podiumStyles = [
    "border-amber-200 bg-amber-50 text-amber-800",
    "border-slate-200 bg-slate-50 text-slate-800",
    "border-orange-200 bg-orange-50 text-orange-800",
  ];

  return (
    <div className="page-shell">
      <section>
        <h1 className="section-title">Top Group A</h1>
        <p className="section-copy">
          Top 10 students ranked by the combined Math, Physics, and Chemistry
          score.
        </p>
      </section>

      {isLoading ? <TopGroupASkeleton /> : null}

      {!isLoading && !error && podium.length > 0 ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {podium.map((student, index) => {
            const Icon = podiumIcons[index];

            return (
              <div
                key={student.sbd}
                className={`rounded-lg border p-5 shadow-soft ${podiumStyles[index]}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Rank {index + 1}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-normal">
                      {student.sbd}
                    </p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/70">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-4 text-sm font-medium">
                  Group A Total: {formatScore(student.total)}
                </p>
              </div>
            );
          })}
        </section>
      ) : null}

      {!isLoading ? (
      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="eyebrow">Ranking</p>
          <h2 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
            Top 10 Group A Students
          </h2>
        </div>

        {error ? (
          <div className="m-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {!error ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-20 table-head-cell">
                    Rank
                  </th>
                  <th className="table-head-cell">
                    SBD
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Math
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Physics
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Chemistry
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Group A Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row, index) => (
                  <tr key={row.sbd} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-950">
                      {row.sbd}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-600">
                      {formatScore(row.math)}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-600">
                      {formatScore(row.physics)}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-600">
                      {formatScore(row.chemistry)}
                    </td>
                    <td className="px-4 py-4 text-right text-base font-semibold text-slate-950">
                      {formatScore(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
      ) : null}
    </div>
  );
}
