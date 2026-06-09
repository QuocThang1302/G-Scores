import { FormEvent, useState } from "react";
import axios from "axios";
import { FileSearch, Search } from "lucide-react";

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
        className="panel mt-6 p-5"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="icon-tile icon-tile-primary h-11 w-11">
              <FileSearch className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="eyebrow">Lookup</p>
              <h2 className="text-lg font-semibold tracking-normal text-foreground">
                Student Score Record
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-sm font-semibold text-muted">
                Student Number
              </span>
              <input
                value={sbd}
                onChange={(event) => setSbd(event.target.value)}
                inputMode="numeric"
                placeholder="Example: 01000001"
                className="app-input mt-2 h-12 w-full"
              />
            </label>
            <button
              type="submit"
              className="btn-primary h-12 sm:self-end"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Search
            </button>
          </div>
        </div>
      </form>

      {error ? (
        <div className="alert-danger mt-5">
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
