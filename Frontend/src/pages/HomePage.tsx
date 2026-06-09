import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpen,
  Calculator,
  GraduationCap,
  Languages,
} from "lucide-react";

import { getDashboard } from "../api/scoreApi";
import { DashboardSkeleton } from "../components/Skeleton";
import type {
  DashboardData,
  MathScoreDistributionBucket,
  SubjectAverage,
} from "../types/score.type";

type MetricCard = {
  label: string;
  value: string;
  detail: string;
  icon: typeof GraduationCap;
  border: string;
  iconClass: string;
};

type ScoreDistributionChartBucket = MathScoreDistributionBucket & {
  rangeLabel: string;
};

const numberFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const emptyDashboard: DashboardData = {
  summary: {
    examYear: 2024,
    totalCandidates: 0,
  },
  subjectAverages: [],
  mathScoreDistribution: [],
  subjectScoreDistributions: [],
};

const formatAverage = (value: number | null | undefined) =>
  value === null || value === undefined ? "-" : value.toFixed(2);

const formatCount = (value: number | null | undefined) =>
  numberFormatter.format(value ?? 0);

const formatScoreRangeValue = (value: number) => value.toString();

const getScoreRangeLabel = (bucket: MathScoreDistributionBucket) => {
  if (
    typeof bucket.lowerBound === "number" &&
    typeof bucket.upperBound === "number"
  ) {
    return `${formatScoreRangeValue(bucket.lowerBound)} - ${formatScoreRangeValue(
      bucket.upperBound,
    )}`;
  }

  return bucket.label;
};

const getSubjectByCode = (
  subjects: SubjectAverage[],
  code: string,
): SubjectAverage | undefined =>
  subjects.find((subject) => subject.code === code);

const getScoreColor = (score: number) => {
  if (score >= 8) {
    return "#22c55e";
  }

  if (score >= 6) {
    return "#f97316";
  }

  if (score >= 4) {
    return "#fb7185";
  }

  return "#fca5a5";
};

const getAverageColor = (average: number | null) => {
  if (average === null) {
    return "bg-slate-300";
  }

  if (average >= 8) {
    return "bg-emerald-500";
  }

  if (average >= 6) {
    return "bg-orange-500";
  }

  return "bg-rose-500";
};

export default function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardData>(emptyDashboard);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("toan");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const result = await getDashboard();

        if (isMounted) {
          setDashboard({
            summary: result.summary ?? emptyDashboard.summary,
            subjectAverages: Array.isArray(result.subjectAverages)
              ? result.subjectAverages
              : [],
            mathScoreDistribution: Array.isArray(result.mathScoreDistribution)
              ? result.mathScoreDistribution
              : [],
            subjectScoreDistributions: Array.isArray(
              result.subjectScoreDistributions,
            )
              ? result.subjectScoreDistributions
              : [],
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard", error);

        if (isMounted) {
          setError("Unable to load dashboard data right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const math = getSubjectByCode(dashboard.subjectAverages, "toan");
  const literature = getSubjectByCode(dashboard.subjectAverages, "ngu_van");
  const foreignLanguage = getSubjectByCode(
    dashboard.subjectAverages,
    "ngoai_ngu",
  );

  const metricCards: MetricCard[] = [
    {
      label: "Total Candidates",
      value: compactFormatter.format(dashboard.summary.totalCandidates),
      detail: `Nationwide ${dashboard.summary.examYear}`,
      icon: GraduationCap,
      border: "border-t-blue-600",
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Math Average",
      value: formatAverage(math?.average),
      detail: `${formatCount(math?.candidateCount)} candidates`,
      icon: Calculator,
      border: "border-t-orange-500",
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      label: "Literature Average",
      value: formatAverage(literature?.average),
      detail: "Required subject nationwide",
      icon: BookOpen,
      border: "border-t-emerald-500",
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Foreign Language Average",
      value: formatAverage(foreignLanguage?.average),
      detail: `${formatAverage(foreignLanguage?.candidatePercentage)}% attempted`,
      icon: Languages,
      border: "border-t-cyan-500",
      iconClass: "bg-cyan-50 text-cyan-600",
    },
  ];

  const selectedSubject =
    getSubjectByCode(dashboard.subjectAverages, selectedSubjectCode) ?? math;
  const selectedDistribution =
    dashboard.subjectScoreDistributions?.find(
      (distribution) => distribution.code === selectedSubjectCode,
    ) ??
    (selectedSubjectCode === "toan"
      ? {
          code: "toan",
          name: "Math",
          candidateCount: math?.candidateCount ?? 0,
          buckets: dashboard.mathScoreDistribution,
        }
      : undefined);
  const selectedBuckets: MathScoreDistributionBucket[] =
    selectedDistribution?.buckets ?? [];
  const selectedCandidateCount =
    selectedDistribution?.candidateCount ?? selectedSubject?.candidateCount ?? 0;

  const chartBuckets = useMemo<ScoreDistributionChartBucket[]>(
    () =>
      selectedBuckets.map((bucket) => ({
        ...bucket,
        rangeLabel: getScoreRangeLabel(bucket),
      })),
    [selectedBuckets],
  );

  const maxSelectedBucket = useMemo(
    () =>
      Math.max(
        ...chartBuckets.map((bucket) => bucket.count),
        0,
      ),
    [chartBuckets],
  );

  return (
    <div className="page-shell">
      {error ? (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <DashboardSkeleton />
      ) : null}

      {!isLoading ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className={`panel border-t-4 ${card.border} p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">{card.label}</p>
                      <p className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
                        {card.value}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {card.detail}
                      </p>
                    </div>
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
            <article className="panel overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow">Score Distribution</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
                    {selectedSubject?.name ?? "Subject"} Score Distribution
                  </h2>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={selectedSubjectCode}
                    onChange={(event) =>
                      setSelectedSubjectCode(event.target.value)
                    }
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    aria-label="Select subject for score distribution"
                  >
                    {dashboard.subjectAverages.map((subject) => (
                      <option key={subject.code} value={subject.code}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                    {formatCount(selectedCandidateCount)} candidates
                  </span>
                </div>
              </div>

              <div className="h-[440px] px-3 py-5 sm:px-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartBuckets}
                    margin={{ top: 8, right: 12, left: 0, bottom: 48 }}
                  >
                    <CartesianGrid stroke="#eef2f7" vertical={false} />
                    <XAxis
                      dataKey="rangeLabel"
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-35}
                      textAnchor="end"
                      height={64}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={48}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(value) =>
                        Number(value) >= 1000
                          ? `${Math.round(Number(value) / 1000)}k`
                          : String(value)
                      }
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(15, 23, 42, 0.04)" }}
                      formatter={(value) => [
                        formatCount(Number(value)),
                        "Candidates",
                      ]}
                      labelFormatter={(label) => `Score range ${label}`}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartBuckets.map((bucket) => (
                        <Cell
                          key={`${bucket.score}-${bucket.rangeLabel}`}
                          fill={getScoreColor(bucket.score)}
                          opacity={
                            maxSelectedBucket > 0 && bucket.count === 0
                              ? 0.35
                              : 1
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="panel overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="eyebrow">Nationwide</p>
                  <h2 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
                    Subject Averages
                  </h2>
                </div>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                  {dashboard.summary.examYear}
                </span>
              </div>

              <div className="space-y-4 p-5">
                {dashboard.subjectAverages.map((subject) => {
                  const average = subject.average ?? 0;
                  const width = Math.min(Math.max((average / 10) * 100, 0), 100);

                  return (
                    <div
                      key={subject.code}
                      className="grid items-center gap-3 sm:grid-cols-[128px_1fr_56px]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {subject.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {formatCount(subject.candidateCount)}
                        </p>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${getAverageColor(
                            subject.average,
                          )}`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                      <p className="text-right text-sm font-semibold text-blue-900">
                        {formatAverage(subject.average)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        </>
      ) : null}
    </div>
  );
}
