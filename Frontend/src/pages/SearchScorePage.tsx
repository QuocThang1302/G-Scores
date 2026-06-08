import { FormEvent, useState } from "react";
import axios from "axios";
import { FileSearch, Search, ShieldCheck } from "lucide-react";

import { getScoreBySbd } from "../api/scoreApi";
import ScoreCard from "../components/ScoreCard";
import { ScoreCardSkeleton } from "../components/Skeleton";
import type { ExamScore } from "../types/score.type";

export default function SearchScorePage() {
  const [sbd, setSbd] = useState("");
  const [score, setScore] = useState<ExamScore | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedSbd = sbd.trim();
    setError("");
    setScore(null);

    if (!trimmedSbd) {
      setError("Please enter a student number.");
      return;
    }

    if (!/^\d+$/.test(trimmedSbd)) {
      setError("Student number can contain numbers only.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await getScoreBySbd(trimmedSbd);
      setScore(result);
    } catch (error) {
      console.error("Failed to search score", error);

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("No score was found for this student number.");
      } else {
        setError("Unable to load scores right now. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section>
        <h1 className="section-title">Search Scores</h1>
        <p className="section-copy">
          Enter a student number to retrieve the matching THPT 2024 exam score
          record.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="panel mt-6 grid gap-5 p-5 lg:grid-cols-[1fr_280px]"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Lookup</p>
              <h2 className="text-lg font-semibold tracking-normal text-slate-950">
                Student Score Record
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Student Number
              </span>
              <input
                value={sbd}
                onChange={(event) => setSbd(event.target.value)}
                inputMode="numeric"
                placeholder="Example: 01000001"
                className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100 sm:self-end"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Search
            </button>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-950">
                Validation
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Numeric student numbers only.
              </p>
            </div>
          </div>
        </aside>
      </form>

      {error ? (
        <div className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6">
        {isLoading ? <ScoreCardSkeleton /> : null}
        {!isLoading && score ? <ScoreCard score={score} /> : null}
      </div>
    </div>
  );
}
