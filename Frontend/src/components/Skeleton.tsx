import type { CSSProperties } from "react";

type SkeletonBlockProps = {
  className?: string;
  style?: CSSProperties;
};

function SkeletonBlock({ className = "", style }: SkeletonBlockProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/80 ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

function MetricCardSkeleton() {
  return (
    <article className="panel border-t-4 border-t-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="mt-4 h-9 w-24" />
          <SkeletonBlock className="mt-3 h-4 w-40" />
        </div>
        <SkeletonBlock className="h-11 w-11 shrink-0 rounded-lg" />
      </div>
    </article>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <article className="panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SkeletonBlock className="h-3 w-36" />
              <SkeletonBlock className="mt-3 h-6 w-56" />
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-10 w-36" />
              <SkeletonBlock className="h-10 w-32" />
            </div>
          </div>
          <div className="h-[360px] px-5 py-5">
            <div className="flex h-full items-end gap-2 border-b border-l border-slate-100 px-3 pb-4">
              {Array.from({ length: 20 }, (_, index) => (
                <SkeletonBlock
                  key={index}
                  className="flex-1 rounded-t"
                  style={{ height: `${20 + ((index * 17) % 70)}%` }}
                />
              ))}
            </div>
          </div>
        </article>

        <article className="panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <SkeletonBlock className="h-3 w-28" />
              <SkeletonBlock className="mt-3 h-6 w-44" />
            </div>
            <SkeletonBlock className="h-9 w-20" />
          </div>
          <div className="space-y-5 p-5">
            {Array.from({ length: 9 }, (_, index) => (
              <div
                key={index}
                className="grid items-center gap-3 sm:grid-cols-[128px_1fr_56px]"
              >
                <div>
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="mt-2 h-3 w-16" />
                </div>
                <SkeletonBlock className="h-2.5 rounded-full" />
                <SkeletonBlock className="h-4 w-10 justify-self-end" />
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

export function ReportPageSkeleton() {
  return (
    <>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="panel p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="mt-3 h-7 w-28" />
              </div>
              <SkeletonBlock className="h-11 w-11 rounded-lg" />
            </div>
          </div>
        ))}
      </section>

      <section className="panel mt-6 p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="mt-3 h-6 w-48" />
          </div>
          <SkeletonBlock className="h-9 w-28" />
        </div>
        <SkeletonBlock className="h-[420px] w-full" />
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-5 gap-px bg-slate-100 p-4">
            {Array.from({ length: 25 }, (_, index) => (
              <SkeletonBlock key={index} className="h-4" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function TopGroupSkeleton() {
  return (
    <>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="mt-3 h-8 w-28" />
              </div>
              <SkeletonBlock className="h-12 w-12 rounded-lg" />
            </div>
            <SkeletonBlock className="mt-5 h-4 w-40" />
          </div>
        ))}
      </section>

      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="mt-3 h-6 w-52" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="grid min-w-[720px] grid-cols-[80px_1fr_110px_110px_110px_140px] items-center gap-4 px-4 py-4"
            >
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <SkeletonBlock className="h-5 w-28" />
              <SkeletonBlock className="h-4 w-14 justify-self-end" />
              <SkeletonBlock className="h-4 w-14 justify-self-end" />
              <SkeletonBlock className="h-4 w-14 justify-self-end" />
              <SkeletonBlock className="h-5 w-16 justify-self-end" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function ScoreCardSkeleton() {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-blue-700 bg-gradient-to-r from-blue-950 via-blue-800 to-sky-500 px-5 py-5 text-white">
        <SkeletonBlock className="h-3 w-36 bg-white/25" />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SkeletonBlock className="h-9 w-40 bg-white/25" />
          <div className="grid gap-2 sm:min-w-[28rem] sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-3"
              >
                <SkeletonBlock className="mx-auto h-3 w-10 bg-white/25" />
                <SkeletonBlock className="mx-auto mt-2 h-7 w-16 bg-white/25" />
                <SkeletonBlock className="mx-auto mt-2 h-3 w-20 bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_220px]">
        <div className="overflow-hidden rounded-lg border border-slate-200">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_120px_80px] gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0"
            >
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-5 w-16" />
              <SkeletonBlock className="h-4 w-10 justify-self-end" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
          <SkeletonBlock className="h-4 w-36 bg-teal-200/70" />
          <SkeletonBlock className="mt-4 h-9 w-20 bg-teal-200/70" />
        </div>
      </div>
    </section>
  );
}
