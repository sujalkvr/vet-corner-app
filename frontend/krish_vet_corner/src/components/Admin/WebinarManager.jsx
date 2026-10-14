import { useEffect, useState } from "react";
import { API_URL } from "../../api";
import {
  CalendarDays,
  Upload,
  Pencil,
  Trash2,
  Users,
  X,
  RefreshCw,
} from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  speakerName: "",
  speakerTitle: "",
  date: "",
  endDate: "",
  timeZone: "Asia/Kolkata",
  isPublished: false,
  feeType: "Free",
  feeLabel: "",
  feeAmount: "0",
};

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export default function WebinarManager() {
  const [webinars, setWebinars] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [poster, setPoster] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reviewComments, setReviewComments] = useState({});
  const [proofPreview, setProofPreview] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);

  const token = () => localStorage.getItem("adminToken");

  const request = async (path, options = {}) => {
    const response = await fetch(`${API_URL}/api/webinars${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token()}`,
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  };

  const fetchWebinars = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request("/admin/all");
      setWebinars(data.webinars || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebinars();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setPoster(null);
    setEditingId(null);
  };

  const handleEdit = (webinar) => {
    setEditingId(webinar._id);
    setForm({
      title: webinar.title || "",
      description: webinar.description || "",
      speakerName: webinar.speakerName || "",
      speakerTitle: webinar.speakerTitle || "",
      feeType: webinar.feeType || "Free",
      feeLabel: webinar.feeLabel || "",
      feeAmount: String(webinar.feeAmount ?? 0),
      date: webinar.date
        ? new Date(webinar.date).toISOString().slice(0, 16)
        : "",
      endDate: webinar.endDate
        ? new Date(webinar.endDate).toISOString().slice(0, 16)
        : "",
      timeZone: webinar.timeZone || "Asia/Kolkata",
      isPublished: Boolean(webinar.isPublished),
    });
    setPoster(null);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!editingId && !poster) {
        throw new Error("Please select a webinar poster.");
      }

      const body = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        body.append(key, String(value));
      });

      if (poster) body.append("poster", poster);

      const data = await request(editingId ? `/${editingId}` : "", {
        method: editingId ? "PUT" : "POST",
        body,
      });

      setMessage(editingId ? "Webinar updated." : "Webinar created.");
      resetForm();
      await fetchWebinars();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (webinar) => {
    if (!window.confirm(`Delete "${webinar.title}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await request(`/${webinar._id}`, { method: "DELETE" });
      setMessage("Webinar deleted.");
      if (editingId === webinar._id) resetForm();
      if (viewingId === webinar._id) {
        setViewingId(null);
        setRegistrations([]);
      }
      await fetchWebinars();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewRegistrations = async (webinar) => {
    setError("");
    setMessage("");

    try {
      const data = await request(`/${webinar._id}/registrations`);
      setRegistrations(data.registrations || []);
      setViewingId(webinar._id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReview = async (person, status) => {
    const decision = status === "Approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${decision} this payment?`)) {
      return;
    }

    setReviewingId(person._id);
    setError("");
    setMessage("");

    try {
      const data = await request(
        `/${viewingId}/registrations/${person._id}/review`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            comments: reviewComments[person._id] || "",
          }),
        },
      );

      setMessage(data.message || `Payment ${status.toLowerCase()}.`);

      const updated = await request(`/${viewingId}/registrations`);
      setRegistrations(updated.registrations || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewingId(null);
    }
  };

  const handleViewProof = async (person) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/webinars/${viewingId}/registrations/${person._id}/payment-proof`,
        {
          headers: {
            Authorization: `Bearer ${token()}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not load payment screenshot.");
      }

      const blob = await response.blob();

      // Release the previous preview URL before replacing it.
      if (proofPreview?.url) {
        URL.revokeObjectURL(proofPreview.url);
      }

      setProofPreview({
        url: URL.createObjectURL(blob),
        name: person.name,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = () => {
    if (!registrations.length) {
      setError("There are no registrations to export.");
      return;
    }

    const columns = [
      "Name",
      "Position",
      "Email",
      "Mobile",
      "Gender",
      "Address",
      "City",
      "Country",
      "Fee Type",
      "Fee Label",
      "Fee Amount",
      "Transaction ID",
      "Payment Status",
      "Admin Comments",
      "Registered At",
    ];

    const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = registrations.map((item) => [
      item.name,
      item.position,
      item.email,
      item.mobile,
      item.gender,
      item.address,
      item.city,
      item.country,
      item.feeType,
      item.feeLabel,
      item.feeAmount,
      item.transactionId,
      item.paymentStatus,
      item.adminComments,
      item.createdAt ? new Date(item.createdAt).toLocaleString() : "",
    ]);

    const csv = [columns, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "webinar-registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not set";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Webinar Management
          </h2>
          <p className="mt-1 text-gray-600">
            Create events, manage publication and view attendees.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchWebinars}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-emerald-700"
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold">
            {editingId ? "Edit Webinar" : "Create Webinar"}
          </h3>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <X size={16} /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-700">
            Webinar title *
            <input
              className={`${inputClass} mt-2`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              maxLength={200}
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Speaker name *
            <input
              className={`${inputClass} mt-2`}
              value={form.speakerName}
              onChange={(e) =>
                setForm({ ...form, speakerName: e.target.value })
              }
              required
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Speaker designation
            <input
              className={`${inputClass} mt-2`}
              value={form.speakerTitle}
              onChange={(e) =>
                setForm({ ...form, speakerTitle: e.target.value })
              }
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Start date and time *
            <input
              type="datetime-local"
              className={`${inputClass} mt-2`}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            End date and time
            <input
              type="datetime-local"
              className={`${inputClass} mt-2`}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </label>

          <label className="block text-sm font-semibold text-gray-700">
            Time zone
            <select
              className={`${inputClass} mt-2`}
              value={form.timeZone}
              onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
            >
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="UTC">UTC</option>
              <option value="Asia/Dubai">Dubai</option>
              <option value="Europe/London">London</option>
              <option value="America/New_York">New York</option>
            </select>
          </label>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h4 className="font-bold text-gray-900">Registration Fee</h4>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-gray-700">
              Fee type *
              <select
                className={`${inputClass} mt-2`}
                value={form.feeType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    feeType: e.target.value,
                    feeAmount:
                      e.target.value === "Free"
                        ? "0"
                        : form.feeAmount === "0"
                          ? ""
                          : form.feeAmount,
                    feeLabel: e.target.value === "Paid" ? "" : form.feeLabel,
                  })
                }
                required
              >
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </label>

            {form.feeType === "Free" ? (
              <label className="block text-sm font-semibold text-gray-700">
                Free-fee display label
                <input
                  className={`${inputClass} mt-2`}
                  value={form.feeLabel}
                  onChange={(e) =>
                    setForm({ ...form, feeLabel: e.target.value })
                  }
                  maxLength={100}
                  placeholder="e.g. Your Love"
                />
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Optional. The webinar remains free.
                </span>
              </label>
            ) : (
              <label className="block text-sm font-semibold text-gray-700">
                Fee amount (₹) *
                <input
                  type="number"
                  className={`${inputClass} mt-2`}
                  value={form.feeAmount}
                  onChange={(e) =>
                    setForm({ ...form, feeAmount: e.target.value })
                  }
                  min="1"
                  step="0.01"
                  required
                />
              </label>
            )}
          </div>
        </div>

        <label className="block text-sm font-semibold text-gray-700">
          Description *
          <textarea
            className={`${inputClass} mt-2 min-h-32`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>

        <label className="block text-sm font-semibold text-gray-700">
          Webinar poster {!editingId && "*"}
          <div className="mt-2 rounded-xl border-2 border-dashed border-gray-300 p-5 text-center">
            <Upload className="mx-auto mb-2 text-gray-500" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setPoster(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
            <p className="mt-2 text-xs font-normal text-gray-500">
              JPG, PNG, WebP or GIF. Maximum 5 MB.
              {editingId && " Leave empty to keep the existing poster."}
            </p>
            {poster && (
              <p className="mt-2 text-sm text-emerald-700">
                Selected: {poster.name}
              </p>
            )}
          </div>
        </label>

        <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
            className="h-4 w-4"
          />
          Publish webinar
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
        >
          {saving ? "Saving..." : editingId ? "Save Changes" : "Create Webinar"}
        </button>
      </form>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">
          All Webinars ({webinars.length})
        </h3>

        {loading && <p className="text-gray-500">Loading webinars...</p>}

        {!loading && webinars.length === 0 && (
          <div className="rounded-2xl border bg-white p-10 text-center text-gray-600">
            <CalendarDays className="mx-auto mb-3" size={36} />
            No webinars yet. Create your first one above.
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          {webinars.map((webinar) => (
            <article
              key={webinar._id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              {webinar.posterUrl && (
                <img
                  src={webinar.posterUrl}
                  alt={`${webinar.title} poster`}
                  className="h-48 w-full bg-gray-100 object-cover"
                />
              )}

              <div className="space-y-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      webinar.isPublished
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {webinar.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(webinar.date)}
                  </span>
                </div>

                <h4 className="text-lg font-bold">{webinar.title}</h4>
                <p className="text-sm text-gray-600">
                  Speaker: {webinar.speakerName}
                  {webinar.speakerTitle ? ` · ${webinar.speakerTitle}` : ""}
                </p>
                <p className="text-sm font-semibold text-emerald-700">
                  {webinar.feeType === "Paid"
                    ? `Fee: ₹${webinar.feeAmount}`
                    : `Fee: ${webinar.feeLabel || "Free"}`}
                </p>
                <p className="whitespace-pre-wrap text-sm text-gray-600">
                  {webinar.description}
                </p>

                <div className="flex flex-wrap gap-2 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(webinar)}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    <Pencil size={16} /> Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleViewRegistrations(webinar)}
                    className="inline-flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    <Users size={16} /> Registrations
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(webinar)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>

                {viewingId === webinar._id && (
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h5 className="font-bold">
                        Registrations ({registrations.length})
                      </h5>

                      <button
                        type="button"
                        onClick={handleExport}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Export CSV
                      </button>
                    </div>

                    {registrations.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No registrations for this webinar yet.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[1100px] text-left text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Name",
                                "Email",
                                "Mobile",
                                "Address",
                                "Fee",
                                "Payment Status",
                                "Payment Proof",
                                "Admin Review",
                              ].map((heading) => (
                                <th
                                  key={heading}
                                  className="px-3 py-3 font-semibold"
                                >
                                  {heading}
                                </th>
                              ))}
                            </tr>
                          </thead>

                          <tbody>
                            {registrations.map((person) => (
                              <tr
                                key={person._id}
                                className="border-t align-top"
                              >
                                <td className="px-3 py-3">{person.name}</td>

                                <td className="px-3 py-3">{person.email}</td>

                                <td className="px-3 py-3">{person.mobile}</td>

                                <td className="px-3 py-3">
                                  <div>{person.address || "Not provided"}</div>
                                  <div className="text-xs text-gray-500">
                                    {[person.city, person.country]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </div>
                                </td>

                                <td className="px-3 py-3">
                                  {person.feeType === "Paid"
                                    ? `₹${person.feeAmount}`
                                    : person.feeLabel || "Free"}
                                </td>

                                <td className="px-3 py-3">
                                  <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                      person.paymentStatus === "Approved"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : person.paymentStatus === "Rejected"
                                          ? "bg-red-100 text-red-700"
                                          : person.paymentStatus ===
                                              "Pending Review"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {person.paymentStatus || "Not Required"}
                                  </span>

                                  {person.transactionId && (
                                    <p className="mt-2 break-all text-xs text-gray-500">
                                      Transaction ID: {person.transactionId}
                                    </p>
                                  )}
                                </td>

                                <td className="px-3 py-3">
                                  {person.feeType === "Paid" &&
                                  person.paymentScreenshotPath ? (
                                    <button
                                      type="button"
                                      onClick={() => handleViewProof(person)}
                                      className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                    >
                                      View Screenshot
                                    </button>
                                  ) : (
                                    <span className="text-gray-400">
                                      Not applicable
                                    </span>
                                  )}
                                </td>

                                <td className="min-w-[240px] px-3 py-3">
                                  {person.paymentStatus === "Pending Review" ? (
                                    <div className="space-y-2">
                                      <textarea
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                                        rows={3}
                                        maxLength={2000}
                                        placeholder="Optional comments for attendee"
                                        value={reviewComments[person._id] || ""}
                                        onChange={(e) =>
                                          setReviewComments((previous) => ({
                                            ...previous,
                                            [person._id]: e.target.value,
                                          }))
                                        }
                                      />

                                      <div className="flex flex-wrap gap-2">
                                        <button
                                          type="button"
                                          disabled={reviewingId === person._id}
                                          onClick={() =>
                                            handleReview(person, "Approved")
                                          }
                                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                          {reviewingId === person._id
                                            ? "Saving..."
                                            : "Approve"}
                                        </button>

                                        <button
                                          type="button"
                                          disabled={reviewingId === person._id}
                                          onClick={() =>
                                            handleReview(person, "Rejected")
                                          }
                                          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-600">
                                      {person.reviewedBy && (
                                        <p>Reviewed by: {person.reviewedBy}</p>
                                      )}

                                      {person.adminComments && (
                                        <p className="mt-1 whitespace-pre-wrap">
                                          Comments: {person.adminComments}
                                        </p>
                                      )}

                                      {person.paymentStatus ===
                                        "Not Required" && (
                                        <span>No review required</span>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {proofPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => {
            URL.revokeObjectURL(proofPreview.url);
            setProofPreview(null);
          }}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">Payment Screenshot</h3>
                <p className="text-sm text-gray-500">
                  Registration: {proofPreview.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(proofPreview.url);
                  setProofPreview(null);
                }}
                className="rounded-lg border p-2 hover:bg-gray-50"
                aria-label="Close screenshot"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={proofPreview.url}
              alt="Payment proof"
              className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
