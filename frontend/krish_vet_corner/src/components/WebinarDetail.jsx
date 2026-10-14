
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
    dateStyle: "long",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  });
};

export default function WebinarDetail() {
  const { id } = useParams();
  const [webinar, setWebinar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/webinars/${id}`);
        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || "Failed to load webinar details.");
        }

        setWebinar(data.webinar || null);

        if (!data.webinar) {
          setError("Webinar details were not found.");
        }
      } catch (err) {
        setError(err.message || "Unable to load webinar details.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [id]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/webinars"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft size={18} />
          Back to All Webinars
        </Link>

        {loading && (
          <p className="py-16 text-center text-gray-600">
            Loading webinar details...
          </p>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Unable to load webinar
            </h1>
            <p className="mt-3 text-red-700">{error}</p>
            <Link
              to="/webinars"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Browse Webinars
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!loading && !error && webinar && (
          <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {webinar.posterUrl ? (
              <img
                src={webinar.posterUrl}
                alt={`${webinar.title} poster`}
                className="max-h-[520px] w-full bg-gray-100 object-contain"
              />
            ) : (
              <div className="flex h-64 items-center justify-center bg-emerald-50 text-emerald-600">
                <CalendarDays size={64} />
              </div>
            )}

            <div className="p-6 sm:p-10">
              <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                Webinar
              </span>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {webinar.title}
              </h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                  <CalendarDays
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(webinar.date, webinar.timeZone)}
                    </p>
                  </div>
                </div>

                {webinar.endDate && (
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <Clock
                      size={21}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {formatDate(webinar.endDate, webinar.timeZone)}
                      </p>
                    </div>
                  </div>
                )}

                {webinar.speakerName && (
                  <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 sm:col-span-2">
                    <UserRound
                      size={21}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Speaker</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {webinar.speakerName}
                      </p>
                      {webinar.speakerTitle && (
                        <p className="mt-1 text-sm text-gray-600">
                          {webinar.speakerTitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <section className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">
                  About This Webinar
                </h2>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-gray-600">
                  {webinar.description || "No description has been provided."}
                </p>
              </section>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">Registration Fee</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {webinar.feeType === "Paid"
                    ? `₹${webinar.feeAmount}`
                    : webinar.feeLabel || "Free"}
                </p>

                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Back to Home to Register
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
