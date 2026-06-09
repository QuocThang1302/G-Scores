import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Layers, TrendingDown, TrendingUp } from "lucide-react";

import { getScoreLevelReport } from "../api/scoreApi";
import { ReportPageSkeleton } from "../components/Skeleton";
import type { ScoreLevelReport } from "../types/score.type";

type ReportChartRow = {
  subject: string;
  excellent: number;
  good: number;
  average: number;
  poor: number;
};

const readNumber = (
  item: ScoreLevelReport,
  keys: Array<keyof ScoreLevelReport>,
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

  return 0;
};

const normalizeReports = (reports: ScoreLevelReport[]): ReportChartRow[] =>
  reports.map((item) => ({
    subject: item.subject ?? item.subjectName ?? item.name ?? "Unknown",
    excellent: readNumber(item, [
      "excellent",
      "greaterThanOrEqual8",
      "gte8",
      "ge8",
      "score_gte_8",
    ]),
    good: readNumber(item, ["good", "from6ToUnder8", "score_6_to_8"]),
    average: readNumber(item, ["average", "from4ToUnder6", "score_4_to_6"]),
    poor: readNumber(item, ["poor", "lessThan4", "score_lt_4"]),
  }));

export default function ReportPage() {
  const [reports, setReports] = useState<ScoreLevelReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      try {
        const result = await getScoreLevelReport();

        if (isMounted) {
          setReports(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error("Failed to load score reports", error);

        if (isMounted) {
          setError("Unable to load score reports right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => normalizeReports(reports), [reports]);
  const totals = useMemo(
    () =>
      chartData.reduce(
        (result, row) => ({
          excellent: result.excellent + row.excellent,
          good: result.good + row.good,
          average: result.average + row.average,
          poor: result.poor + row.poor,
        }),
        { excellent: 0, good: 0, average: 0, poor: 0 },
      ),
    [chartData],
  );
  const summaryCards = [
    {
      label: "Subjects",
      value: chartData.length.toLocaleString(),
      icon: Layers,
      accent: "bg-slate-100 text-slate-700",
    },
    {
      label: "Scores >= 8",
      value: totals.excellent.toLocaleString(),
      icon: TrendingUp,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Scores < 4",
      value: totals.poor.toLocaleString(),
      icon: TrendingDown,
      accent: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="page-shell">
      <section>
        <h1 className="section-title">Score Reports</h1>
        <p className="section-copy">
          Score-level distribution by subject across four ranges: 8 and above,
          6 to under 8, 4 to under 6, and under 4.
        </p>
      </section>

      {isLoading ? <ReportPageSkeleton /> : null}

      {!isLoading && !error ? (
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.label} className="panel p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
                      {card.value}
                    </p>
                  </div>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-lg ${card.accent}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {!isLoading ? (
      <section className="panel mt-6 p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Distribution</p>
            <h2 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
              Score Level Overview
            </h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Recharts
          </span>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {!error ? (
          <>
            <div className="h-[420px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 16, right: 12, left: 24 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tickLine={false} axisLine={false} width={72} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="excellent" name=">= 8" fill="#0f766e" />
                  <Bar dataKey="good" name="6 to <8" fill="#2563eb" />
                  <Bar dataKey="average" name="4 to <6" fill="#f59e0b" />
                  <Bar dataKey="poor" name="< 4" fill="#e11d48" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="table-head-cell">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      &gt;= 8
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      6 to &lt;8
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      4 to &lt;6
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      &lt; 4
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {chartData.map((row) => (
                    <tr key={row.subject} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.subject}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {row.excellent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {row.good.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {row.average.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">
                        {row.poor.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>
      ) : null}
    </div>
  );
}
