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

const cssRgb = (variableName: string) => `rgb(var(${variableName}))`;
const chartAxisTick = {
  fontSize: 12,
  fill: cssRgb("--color-subtle"),
};
const chartTooltipContentStyle = {
  backgroundColor: cssRgb("--color-surface"),
  border: `1px solid ${cssRgb("--color-border")}`,
  borderRadius: 8,
  color: cssRgb("--color-foreground"),
};
const chartTooltipLabelStyle = {
  color: cssRgb("--color-foreground"),
};
const chartTooltipItemStyle = {
  color: cssRgb("--color-muted"),
};
const scoreLevelColumns = [
  { key: "excellent", label: ">= 8" },
  { key: "good", label: "6 to <8" },
  { key: "average", label: "4 to <6" },
  { key: "poor", label: "< 4" },
] as const;

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
      accent: "icon-tile icon-tile-neutral",
    },
    {
      label: "Scores >= 8",
      value: totals.excellent.toLocaleString(),
      icon: TrendingUp,
      accent: "icon-tile icon-tile-success",
    },
    {
      label: "Scores < 4",
      value: totals.poor.toLocaleString(),
      icon: TrendingDown,
      accent: "icon-tile icon-tile-danger",
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
        <section className="mt-6 grid min-w-0 gap-4 md:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.label} className="panel p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-subtle">
                      {card.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-normal text-foreground">
                      {card.value}
                    </p>
                  </div>
                  <span
                    className={`h-11 w-11 ${card.accent}`}
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
            <h2 className="mt-1 text-lg font-semibold tracking-normal text-foreground">
              Score Level Overview
            </h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-xs font-semibold text-muted">
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Recharts
          </span>
        </div>

        {error ? (
          <div className="alert-danger">
            {error}
          </div>
        ) : null}

        {!error ? (
          <>
            <div className="h-[420px] min-w-0 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 16, right: 12, left: 24 }}
                >
                  <CartesianGrid
                    stroke={cssRgb("--color-chart-grid")}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={80}
                    tick={chartAxisTick}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={72}
                    tick={chartAxisTick}
                  />
                  <Tooltip
                    contentStyle={chartTooltipContentStyle}
                    itemStyle={chartTooltipItemStyle}
                    labelStyle={chartTooltipLabelStyle}
                  />
                  <Legend wrapperStyle={{ color: cssRgb("--color-muted") }} />
                  <Bar
                    dataKey="excellent"
                    name=">= 8"
                    fill={cssRgb("--color-primary")}
                  />
                  <Bar
                    dataKey="good"
                    name="6 to <8"
                    fill={cssRgb("--color-accent")}
                  />
                  <Bar
                    dataKey="average"
                    name="4 to <6"
                    fill={cssRgb("--color-warning")}
                  />
                  <Bar
                    dataKey="poor"
                    name="< 4"
                    fill={cssRgb("--color-danger")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 grid min-w-0 gap-3 sm:hidden">
              {chartData.map((row) => (
                <div
                  key={row.subject}
                  className="min-w-0 rounded-lg border border-border bg-surface-raised p-4"
                >
                  <p className="font-semibold text-foreground">
                    {row.subject}
                  </p>
                  <dl className="mt-3 grid grid-cols-2 gap-2">
                    {scoreLevelColumns.map((column) => (
                      <div
                        key={column.key}
                        className="rounded-lg bg-surface px-3 py-2"
                      >
                        <dt className="text-xs font-semibold uppercase tracking-wider text-subtle">
                          {column.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-foreground">
                          {row[column.key].toLocaleString()}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="mt-6 hidden overflow-hidden rounded-lg border border-border sm:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] divide-y divide-border text-sm">
                  <thead className="bg-surface-raised">
                    <tr>
                      <th className="table-head-cell">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-subtle">
                        &gt;= 8
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-subtle">
                        6 to &lt;8
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-subtle">
                        4 to &lt;6
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-subtle">
                        &lt; 4
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-muted bg-surface">
                    {chartData.map((row) => (
                      <tr key={row.subject} className="hover:bg-surface-raised">
                        <td className="px-4 py-3 font-medium text-foreground">
                          {row.subject}
                        </td>
                        <td className="px-4 py-3 text-right text-muted">
                          {row.excellent.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted">
                          {row.good.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted">
                          {row.average.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-muted">
                          {row.poor.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </section>
      ) : null}
    </div>
  );
}
