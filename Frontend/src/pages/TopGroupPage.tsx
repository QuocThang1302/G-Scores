import { useEffect, useMemo, useState } from "react";
import { Award, Medal, Trophy } from "lucide-react";

import { getAdmissionGroups, getTopAdmissionGroup } from "../api/scoreApi";
import { TopGroupSkeleton } from "../components/Skeleton";
import type {
  AdmissionGroupOption,
  TopGroupReport,
  TopGroupStudent,
} from "../types/score.type";

const DEFAULT_GROUP_CODE = "A00";

const formatScore = (value: number | null | undefined) =>
  value === null || value === undefined
    ? "-"
    : value.toFixed(2).replace(/\.00$/, "");

export default function TopGroupPage() {
  const [groups, setGroups] = useState<AdmissionGroupOption[]>([]);
  const [selectedGroupCode, setSelectedGroupCode] =
    useState(DEFAULT_GROUP_CODE);
  const [report, setReport] = useState<TopGroupReport | null>(null);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadGroups = async () => {
      try {
        const result = await getAdmissionGroups();

        if (isMounted) {
          setGroups(Array.isArray(result) ? result : []);

          if (
            Array.isArray(result) &&
            result.length > 0 &&
            !result.some((group) => group.code === DEFAULT_GROUP_CODE)
          ) {
            setSelectedGroupCode(result[0].code);
          }
        }
      } catch (error) {
        console.error("Failed to load admission groups", error);

        if (isMounted) {
          setError("Unable to load admission groups right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingGroups(false);
        }
      }
    };

    void loadGroups();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadTopGroup = async () => {
      setIsLoadingReport(true);
      setError("");

      try {
        const result = await getTopAdmissionGroup(selectedGroupCode);

        if (isMounted) {
          setReport(result);
        }
      } catch (error) {
        console.error("Failed to load top group students", error);

        if (isMounted) {
          setReport(null);
          setError("Unable to load the top group ranking right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingReport(false);
        }
      }
    };

    void loadTopGroup();

    return () => {
      isMounted = false;
    };
  }, [selectedGroupCode]);

  const selectedGroup = groups.find((group) => group.code === selectedGroupCode);
  const currentGroup =
    report?.group.code === selectedGroupCode ? report.group : selectedGroup;
  const rows: TopGroupStudent[] =
    report?.group.code === selectedGroupCode ? report.students : [];
  const podium = rows.slice(0, 3);
  const podiumIcons = [Trophy, Medal, Award];
  const podiumStyles = [
    "border-amber-200 bg-amber-50 text-amber-800",
    "border-slate-200 bg-slate-50 text-slate-800",
    "border-orange-200 bg-orange-50 text-orange-800",
  ];
  const subjectLabels = useMemo(
    () => currentGroup?.subjects.map((subject) => subject.label) ?? [],
    [currentGroup],
  );
  const totalColumnCount = subjectLabels.length + 3;

  return (
    <div className="page-shell">
      <section>
        <h1 className="section-title">Top Group</h1>
        <p className="section-copy">
          Top 10 students ranked by the selected admission group total score.
        </p>
      </section>

      <section className="panel mt-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Medal className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Admission Group</p>
              <h2 className="text-lg font-semibold tracking-normal text-slate-950">
                {currentGroup
                  ? `${currentGroup.code} - ${currentGroup.name}`
                  : selectedGroupCode}
              </h2>
            </div>
          </div>

          <select
            value={selectedGroupCode}
            onChange={(event) => setSelectedGroupCode(event.target.value)}
            disabled={isLoadingGroups || groups.length === 0}
            className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 lg:min-w-72"
            aria-label="Select admission group"
          >
            {groups.length > 0 ? (
              groups.map((group) => (
                <option key={group.code} value={group.code}>
                  {group.code} - {group.name}
                </option>
              ))
            ) : (
              <option value={selectedGroupCode}>{selectedGroupCode}</option>
            )}
          </select>
        </div>

        {currentGroup ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {currentGroup.subjects.map((subject) => (
              <span
                key={subject.field}
                className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                {subject.label}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {isLoadingReport ? <TopGroupSkeleton /> : null}

      {!isLoadingReport && !error && podium.length > 0 ? (
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
                  {currentGroup?.code ?? selectedGroupCode} Total:{" "}
                  {formatScore(student.totalScore)}
                </p>
              </div>
            );
          })}
        </section>
      ) : null}

      {!isLoadingReport ? (
        <section className="panel mt-6 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <p className="eyebrow">Ranking</p>
            <h2 className="mt-1 text-lg font-semibold tracking-normal text-slate-950">
              Top 10 {currentGroup?.code ?? selectedGroupCode} Students
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
                    <th className="w-20 table-head-cell">Rank</th>
                    <th className="table-head-cell">SBD</th>
                    {subjectLabels.map((label) => (
                      <th
                        key={label}
                        className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {currentGroup?.code ?? selectedGroupCode} Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.length > 0 ? (
                    rows.map((row, index) => (
                      <tr key={row.sbd} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-950">
                          {row.sbd}
                        </td>
                        {row.subjects.map((subject) => (
                          <td
                            key={subject.field}
                            className="px-4 py-4 text-right text-slate-600"
                          >
                            {formatScore(subject.score)}
                          </td>
                        ))}
                        <td className="px-4 py-4 text-right text-base font-semibold text-slate-950">
                          {formatScore(row.totalScore)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={totalColumnCount}
                        className="px-4 py-8 text-center text-sm font-medium text-slate-500"
                      >
                        No students found for this group.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
