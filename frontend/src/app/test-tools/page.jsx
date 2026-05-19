"use client";

import { useState } from "react";
import api from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function TestToolsPage() {
  const [loading, setLoading] = useState(false);

  const generateLeads = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/test/generate-leads");
      toast.success(`${data.totalRequests} requests completed`);
    } catch (error) {
      toast.error("Failed to generate leads");
    } finally {
      setLoading(false);
    }
  };

  const resetQuota = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/webhooks/payment", {
        eventId: `payment_${Date.now()}`,
      });
      toast.success(data.message);
    } catch (error) {
      toast.error("Quota reset failed");
    } finally {
      setLoading(false);
    }
  };

  const testIdempotency = async () => {
    try {
      setLoading(true);
      const eventId = "fixed_payment_id";
      await api.post("/webhooks/payment", { eventId });
      const { data } = await api.post("/webhooks/payment", { eventId });
      toast.success(data.message);
    } catch (error) {
      toast.error("Idempotency test failed");
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

      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Test Tools</h1>
          <p className="text-lg text-slate-600 mt-3 font-medium">Simulate real-world conditions to verify backend logic.</p>
        </div>

        <div className="space-y-6">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="text-left flex-1">
              <h2 className="text-xl font-black text-slate-900 mb-2">Concurrency Test</h2>
              <p className="text-slate-600 font-medium leading-relaxed">Fires 10 simultaneous POST requests to test MongoDB transaction safety and race conditions.</p>
            </div>
            <button
              onClick={generateLeads}
              disabled={loading}
              className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-slate-900/20 disabled:opacity-50 whitespace-nowrap"
            >
              Generate 10 Leads
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="text-left flex-1">
              <h2 className="text-xl font-black text-slate-900 mb-2">Reset Quotas</h2>
              <p className="text-slate-600 font-medium leading-relaxed">Simulates a successful payment webhook to immediately reset all provider quotas back to 10.</p>
            </div>
            <button
              onClick={resetQuota}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-blue-600/20 disabled:opacity-50 whitespace-nowrap"
            >
              Simulate Payment
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="text-left flex-1">
              <h2 className="text-xl font-black text-slate-900 mb-2">Idempotency Test</h2>
              <p className="text-slate-600 font-medium leading-relaxed">Fires the exact same webhook payload twice to ensure the quota reset only processes once.</p>
            </div>
            <button
              onClick={testIdempotency}
              disabled={loading}
              className="w-full md:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-slate-900/10 disabled:opacity-50 whitespace-nowrap"
            >
              Test Idempotency
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}