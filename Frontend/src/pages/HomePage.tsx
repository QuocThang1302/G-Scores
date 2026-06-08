import { ArrowRight, BarChart3, Medal, Search } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Search Scores",
    description: "Look up a student's THPT 2024 scores by student number.",
    to: "/search",
    icon: Search,
    accent: "bg-teal-50 text-teal-700",
  },
  {
    title: "Score Reports",
    description: "Review score distribution by subject and performance level.",
    to: "/reports",
    icon: BarChart3,
    accent: "bg-amber-50 text-amber-700",
  },
  {
    title: "Top Group A",
    description: "View the top 10 students by Math, Physics, and Chemistry.",
    to: "/top-group-a",
    icon: Medal,
    accent: "bg-rose-50 text-rose-700",
  },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="rounded-lg bg-[#0f2a43] px-6 py-8 text-white shadow-soft sm:px-8">
        <p className="text-sm font-medium text-teal-100">
          Vietnam High School Graduation Exam
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
          Welcome to G-Scores
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base">
          Search THPT 2024 exam scores, inspect score-level reports, and review
          the top Group A results from the connected backend API.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              to={card.to}
              className="panel group block p-5 transition hover:-translate-y-0.5 hover:border-teal-200"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.accent}`}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-normal text-slate-950">
                {card.title}
              </h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                Open
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
