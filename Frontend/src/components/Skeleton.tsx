import type { CSSProperties } from "react";

type SkeletonBlockProps = {
  className?: string;
  style?: CSSProperties;
};

function SkeletonBlock({ className = "", style }: SkeletonBlockProps) {
  return (
    <div
      className={`skeleton-block rounded-md ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

function MetricCardSkeleton() {
  return (
    <article className="panel border-t-4 border-t-border p-5">
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
      <section className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <MetricCardSkeleton key={index} />
        ))}
      </section>

      <section className="mt-6 grid min-w-0 gap-4 xl:grid-cols-[1fr_0.95fr]">
        <article className="panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <SkeletonBlock className="h-3 w-36" />
              <SkeletonBlock className="mt-3 h-6 w-56" />
            </div>
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <SkeletonBlock className="h-10 w-36" />
              <SkeletonBlock className="h-10 w-32" />
            </div>
          </div>
          <div className="min-w-0 overflow-x-auto px-5 py-5">
            <div className="h-[360px] w-full min-w-[720px] sm:min-w-0">
              <div className="flex h-full items-end gap-2 border-b border-l border-border-muted px-3 pb-4">
                {Array.from({ length: 20 }, (_, index) => (
                  <SkeletonBlock
                    key={index}
                    className="flex-1 rounded-t"
                    style={{ height: `${20 + ((index * 17) % 70)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="panel overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
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
                className="grid min-w-0 items-center gap-3 sm:grid-cols-[128px_1fr_56px]"
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
      <section className="mt-6 grid min-w-0 gap-4 md:grid-cols-3">
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
        <div className="min-w-0 overflow-x-auto">
          <SkeletonBlock className="h-[420px] w-full min-w-[720px] sm:min-w-0" />
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-border">
          <div className="grid min-w-0 grid-cols-2 gap-px bg-surface-muted p-4 sm:grid-cols-5">
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
      <section className="mt-6 grid min-w-0 gap-4 md:grid-cols-3">
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
        <div className="border-b border-border px-5 py-4">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="mt-3 h-6 w-52" />
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[720px] divide-y divide-border-muted">
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[80px_1fr_110px_110px_110px_140px] items-center gap-4 px-4 py-4"
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
        </div>
      </section>
    </>
  );
}

export function ScoreCardSkeleton() {
  return (
    <section className="panel overflow-hidden">
      <div className="score-hero border-b border-divider-strong px-5 py-5">
        <SkeletonBlock className="score-hero-skeleton h-3 w-36" />
        <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_28rem] sm:items-end">
          <SkeletonBlock className="score-hero-skeleton h-9 w-40 sm:self-end" />
          <div className="grid min-w-0 gap-2 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="score-hero-tile flex h-24 flex-col justify-center rounded-lg px-3 py-3"
              >
                <SkeletonBlock className="score-hero-skeleton mx-auto h-3 w-10" />
                <SkeletonBlock className="score-hero-skeleton mx-auto mt-2 h-7 w-16" />
                <SkeletonBlock className="score-hero-skeleton mx-auto mt-2 h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 p-5 lg:grid-cols-[1fr_220px]">
        <div className="max-w-full overflow-x-auto rounded-lg border border-border">
          {Array.from({ length: 10 }, (_, index) => (
            <div
              key={index}
              className="grid w-full min-w-full grid-cols-[minmax(0,1fr)_72px_56px] gap-3 border-b border-border-muted px-4 py-4 last:border-b-0 sm:min-w-[480px] sm:grid-cols-[minmax(0,1fr)_120px_80px] sm:gap-4 xl:grid-cols-[minmax(0,1fr)_80px_56px]"
            >
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-5 w-16" />
              <SkeletonBlock className="h-4 w-10 justify-self-end" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-surface-raised p-4">
          <SkeletonBlock className="h-4 w-36 bg-border-strong/60" />
          <SkeletonBlock className="mt-4 h-9 w-20 bg-border-strong/60" />
        </div>
      </div>
    </section>
  );
}
