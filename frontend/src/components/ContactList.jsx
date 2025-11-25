import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FiSearch, FiTrash2, FiMail, FiPhone } from "react-icons/fi";

const ContactList = ({ setContacts, contacts }) => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "";

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!backendUrl) {
        setError("Backend URL not configured (VITE_BACKEND_URL).");
        setContacts([]);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      if (filter) params.append("status", filter);
      if (search) params.append("search", search);

      try {
        const res = await axios.get(`${backendUrl}/contacts${params.toString() ? `?${params.toString()}` : ""}`, { signal });
        setContacts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (err?.name === "CanceledError" || axios.isCancel?.(err)) {
          // ignore
        } else {
          console.error("Fetch contacts error:", err);
          setError("Unable to fetch contacts.");
          setContacts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [filter, search, setContacts, backendUrl]);

  const handleDelete = async (id) => {
    if (!confirm("Delete contact?")) return;
    if (!backendUrl) {
      alert("Backend URL not configured.");
      return;
    }
    try {
      await axios.delete(`${backendUrl}/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete.");
    }
  };

  const handleStatusChange = async (id, status) => {
    if (!backendUrl) {
      alert("Backend URL not configured.");
      return;
    }
    try {
      await axios.put(`${backendUrl}/contacts/${id}`, { status });
      setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        {/* Filter select with custom icon */}
        <div className="relative w-full md:w-48">
          <select
            className="appearance-none w-full p-2 pr-9 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter contacts by status"
          >
            <option value="">All Status</option>
            <option value="Interested">Interested</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300">
            <IoIosArrowDropdownCircle />
          </div>
        </div>

        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
            placeholder="Search name or company"
            aria-label="Search contacts"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center py-20 text-lg text-slate-700 dark:text-slate-200">Loading...</p>
      ) : error ? (
        <div className="rounded p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
      ) : contacts.length === 0 ? (
        <p className="text-center py-10 text-slate-500 dark:text-slate-400">No contacts found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {contacts.map((c) => (
            <article
              key={c._id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md transition"
              aria-labelledby={`contact-${c._id}`}
            >
              <div>
                <h3 id={`contact-${c._id}`} className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {c.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">{c.company || "—"}</p>

                <div className="mt-3 text-sm space-y-1 text-slate-600 dark:text-slate-300 border-t pt-3 border-slate-100 dark:border-slate-800">
                  <p className="flex items-center gap-2">
                    <FiMail className="text-slate-500 dark:text-slate-300" />
                    <a href={`mailto:${c.email}`} className="text-slate-700 dark:text-slate-200">{c.email}</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <FiPhone className="text-slate-500 dark:text-slate-300" />
                    <a href={`tel:${c.phone ?? ""}`} className="text-slate-700 dark:text-slate-200">{c.phone || "—"}</a>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {/* per-contact status select with custom icon */}
                <div className="relative w-40">
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    className="appearance-none w-full p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    aria-label={`Change status for ${c.name}`}
                  >
                    <option>Interested</option>
                    <option>Follow-up</option>
                    <option>Closed</option>
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300">
                    <IoIosArrowDropdownCircle />
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(c._id)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition text-sm"
                  aria-label={`Delete ${c.name}`}
                >
                  <FiTrash2 />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
