
import { useEffect, useState } from "react";
import { CalendarDays, Clock, UserRound, ArrowRight, X } from "lucide-react";
import { API_URL } from "../api";

const emptyForm = {
  name: "",
  position: "",
  email: "",
  mobile: "",
  gender: "",
  city: "",
  country: "",
};

const WebinarSection = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/webinars`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load webinars.");
        }

        setWebinars(data.webinars || []);
      } catch (err) {
        setError(err.message || "Could not load webinars.");
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  const formatDate = (date, timeZone = "Asia/Kolkata") => {
    if (!date) return "Date to be announced";

    return new Date(date).toLocaleString("en-IN", {
      timeZone,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const openRegistration = (webinar) => {
    setSelectedWebinar(webinar);
    setForm(emptyForm);
    setMessage("");
    setFormError("");
  };

  const closeRegistration = () => {
    if (submitting) return;
    setSelectedWebinar(null);
    setForm(emptyForm);
    setMessage("");
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedWebinar) return;

    setSubmitting(true);
    setFormError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/webinars/${selectedWebinar._id}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setMessage(
        data.emailSent === false
          ? "Registration successful, but email delivery failed. Please contact the organizer."
          : "Registration successful! Check your email for confirmation."
      );
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="webinars" className="bg-gradient-to-b from-white to-emerald-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
            <CalendarDays size={16} />
            Learn with our experts
          </span>

          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Upcoming Webinars
          </h2>

          <p className="mt-3 text-gray-600">
            Join our sessions to learn more about pet health and veterinary care.
          </p>
        </div>

        {loading && (
          <p className="py-10 text-center text-gray-600">
            Loading webinars...
          </p>
        )}

        {!loading && error && (
          <div role="alert" className="mx-auto max-w-2xl rounded-xl bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && webinars.length === 0 && (
          <div className="mx-auto max-w-xl rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
            <CalendarDays className="mx-auto mb-3 text-emerald-600" size={36} />
            <h3 className="text-xl font-semibold text-gray-900">
              No upcoming webinars
            </h3>
            <p className="mt-2 text-gray-600">
              Please check back soon for upcoming sessions.
            </p>
          </div>
        )}

        {!loading && !error && webinars.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
              <article
                key={webinar._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={webinar.posterUrl}
                    alt={`${webinar.title} poster`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-emerald-700 shadow-sm">
                    Webinar
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
                    <CalendarDays size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span>
                      {formatDate(webinar.date, webinar.timeZone)}
                    </span>
                  </div>

                  {webinar.endDate && (
                    <div className="mb-3 flex items-start gap-2 text-sm text-gray-600">
                      <Clock size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                      <span>
                        Ends: {formatDate(webinar.endDate, webinar.timeZone)}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold leading-snug text-gray-900">
                    {webinar.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <UserRound size={17} className="shrink-0 text-emerald-600" />
                    <span>
                      {webinar.speakerName}
                      {webinar.speakerTitle ? ` · ${webinar.speakerTitle}` : ""}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 whitespace-pre-line text-sm leading-6 text-gray-600">
                    {webinar.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => openRegistration(webinar)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Register Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {selectedWebinar && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRegistration();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="webinar-registration-title"
            className="my-6 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  Webinar registration
                </p>
                <h3 id="webinar-registration-title" className="mt-1 text-2xl font-bold text-gray-900">
                  {selectedWebinar.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {formatDate(selectedWebinar.date, selectedWebinar.timeZone)}
                </p>
              </div>

              <button
                type="button"
                onClick={closeRegistration}
                disabled={submitting}
                aria-label="Close registration form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            {message ? (
              <div role="status" className="rounded-xl bg-emerald-50 p-5 text-emerald-800">
                {message}
                <button
                  type="button"
                  onClick={closeRegistration}
                  className="mt-4 block rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full name *
                    <input
                      required
                      maxLength={120}
                      autoComplete="name"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </label>

                  <label className="text-sm font-semibold text-gray-700">
                    Position *
                    <input
                      required
                      maxLength={120}
                      autoComplete="organization-title"
                      placeholder="e.g. Veterinary student"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                    />
                  </label>

                  <label className="text-sm font-semibold text-gray-700">
                    Email address *
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </label>

                  <label className="text-sm font-semibold text-gray-700">
                    Mobile number *
                    <input
                      required
                      type="tel"
                      maxLength={25}
                      autoComplete="tel"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                  </label>

                  <label className="text-sm font-semibold text-gray-700">
                    Gender *
                    <select
                      required
                      className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-gray-700">
                    City *
                    <input
                      required
                      autoComplete="address-level2"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </label>

                  <label className="text-sm font-semibold text-gray-700 sm:col-span-2">
                    Country *
                    <input
                      required
                      autoComplete="country-name"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </label>
                </div>

                {formError && (
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                </button>

                <p className="text-xs leading-5 text-gray-500">
                  Your details will be used to manage this webinar registration
                  and send related confirmation information.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default WebinarSection;
