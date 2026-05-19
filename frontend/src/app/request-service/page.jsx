"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function RequestServicePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    description: "",
    serviceName: "Service 1",
  });

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "phone") {
      val = val.replace(/\D/g, "").slice(0, 10);
    }
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/leads", formData);
      toast.success(data.message);
      setFormData({
        name: "",
        phone: "",
        city: "",
        description: "",
        serviceName: "Service 1",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-6 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Toaster position="top-center" toastOptions={{
        className: 'text-sm font-bold',
        style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }
      }} />

      <div className="max-w-xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Request Service</h1>
          <p className="text-slate-600 mt-3 text-lg font-medium">Submit a new lead to the distribution pool.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/40 space-y-6">
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3.5 text-base text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-bold placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="9999999999"
              pattern="[0-9]{10}"
              maxLength="10"
              title="Phone number must be exactly 10 digits"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3.5 text-base text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-bold placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Delhi"
              value={formData.city}
              onChange={handleChange}
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3.5 text-base text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-bold placeholder-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Service Type</label>
            <div className="relative">
              <select
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                className="w-full border-2 border-slate-200 rounded-xl px-5 py-3.5 text-base text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-bold cursor-pointer appearance-none"
              >
                <option value="Service 1">Service 1</option>
                <option value="Service 2">Service 2</option>
                <option value="Service 3">Service 3</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide">Description (Optional)</label>
            <textarea
              name="description"
              placeholder="Brief details about the request..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3.5 text-base text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 transition-all font-bold placeholder-slate-400 resize-none"
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {loading ? "Submitting Request..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}