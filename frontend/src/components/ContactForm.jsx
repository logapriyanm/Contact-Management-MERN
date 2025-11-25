import React, { useState } from "react";
import axios from "axios";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FiMail, FiPhone } from "react-icons/fi";

const ContactForm = ({ setContacts }) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("Interested");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim() || !email.trim()) {
      setMessage({ type: "error", text: "Name and Email are required." });
      return;
    }

    if (!backendUrl) {
      setMessage({ type: "error", text: "Backend URL not configured." });
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${backendUrl}/contacts`, { name, company, email, phone, status });
      const res = await axios.get(`${backendUrl}/contacts`);
      setContacts(Array.isArray(res.data) ? res.data : []);
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setStatus("Interested");
      setMessage({ type: "success", text: "Contact saved." });
    } catch (err) {
      console.error("Submit error:", err);
      setMessage({ type: "error", text: "Failed to save contact." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      {message && (
        <div
          role="status"
          className={`px-3 py-2 rounded text-sm ${message.type === "success" ? "bg-green-50 text-green-800 dark:bg-green-900/30" : "bg-red-50 text-red-800 dark:bg-red-900/30"}`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Add Contact</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 dark:text-slate-300 mb-1">Name *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
            required
            aria-label="Name"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-600 dark:text-slate-300 mb-1">Company</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company / Organization"
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
            aria-label="Company"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 dark:text-slate-300 mb-1">Email *</span>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="pl-10 p-3 rounded-md w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              required
              aria-label="Email"
            />
          </div>
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-slate-600 dark:text-slate-300 mb-1">Phone</span>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="pl-10 p-3 rounded-md w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              aria-label="Phone"
            />
          </div>
        </label>
      </div>

      <div className="relative">
        <label className="flex flex-col">
          <span className="text-sm text-slate-600 dark:text-slate-300 mb-1">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 appearance-none pr-9"
            aria-label="Status"
          >
            <option>Interested</option>
            <option>Follow-up</option>
            <option>Closed</option>
          </select>
        </label>

        <div className="absolute right-3 top-3/5 transform -translate-y-1/2 text-slate-500 dark:text-slate-300 pointer-events-none">
          <IoIosArrowDropdownCircle size={18} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md text-white font-medium transition ${
          submitting ? "bg-sky-300 cursor-wait" : "bg-sky-600 hover:bg-sky-700"
        }`}
        aria-label="Submit contact"
      >
        {submitting ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactForm;
