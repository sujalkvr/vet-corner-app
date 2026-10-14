
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  UserRound,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { API_URL } from "../api";

const formatDate = (date, timeZone) => {
  if (!date) return "Date to be announced";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Date to be announced";

  return parsedDate.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  });
};

export default function AllWebinars() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await fetch(`${API_URL}/api/webinars`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Failed to load webinars.");
        }

        setWebinars(Array.isArray(data.webinars) ? data.webinars : []);
      } catch (err) {
        setError(err.message || "Unable to load webinars.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="mb-10">
          <p className="font-semibold uppercase tracking-widest text-emerald-700">
            Learn with Krish Vet Corner
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            All Webinars
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Explore our webinars, meet the speakers, and find sessions that
            interest you.
          </p>
        </div>

        {loading && (
          <p className="py-12 text-center text-gray-600">
            Loading webinars...
          </p>
        )}

        {!loading && error && (
          <p className="rounded-xl bg-red-50 p-5 text-center text-red-700">
            {error}
          </p>
        )}

        {!loading && !error && webinars.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <CalendarDays
              size={42}
              className="mx-auto text-emerald-600"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No webinars available
            </h2>
            <p className="mt-2 text-gray-600">
              Please check back later for upcoming webinars.
            </p>
          </div>
        )}

        {!loading && !error && webinars.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
              <article
                key={webinar._id}
                className="flex h-[520px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 shrink-0 overflow-hidden bg-emerald-50">
                  {webinar.posterUrl ? (
                    <img
                      src={webinar.posterUrl}
                      alt={`${webinar.title} poster`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-emerald-600">
                      <CalendarDays size={48} />
                    </div>
                  )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-5">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <span className="line-clamp-2">
                      {formatDate(webinar.date, webinar.timeZone)}
                    </span>
                  </div>

                  {webinar.endDate && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                      <Clock
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span className="line-clamp-2">
                        Ends: {formatDate(webinar.endDate, webinar.timeZone)}
                      </span>
                    </div>
                  )}

                  <h2 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-gray-900">
                    {webinar.title}
                  </h2>

                  <div className="mt-2 flex items-start gap-2 text-sm text-gray-600">
                    <UserRound
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <span className="line-clamp-2">
                      {webinar.speakerName}
                      {webinar.speakerTitle
                        ? ` · ${webinar.speakerTitle}`
                        : ""}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {webinar.description}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    {webinar.feeType === "Paid"
                      ? `Fee: ₹${webinar.feeAmount}`
                      : `Fee: ${webinar.feeLabel || "Free"}`}
                  </p>

                  <div className="mt-auto pt-4">
                    <Link
                      to={`/webinar/${webinar._id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
    