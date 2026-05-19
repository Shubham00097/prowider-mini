"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
  const [providerId, setProviderId] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [providers, setProviders] = useState([]);

  const fetchProviders = async () => {
    try {
      const { data } = await api.get("/providers");
      setProviders(data.providers);
      if (data.providers.length > 0 && !providerId) {
        setProviderId(data.providers[0]._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboard = async () => {
    if (!providerId) return;
    try {
      const { data } = await api.get(`/providers/${providerId}/dashboard`);
      setDashboardData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [providerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboard();
    }, 3000);
    return () => clearInterval(interval);
  }, [providerId]);

  return (
    <div className="py-12 px-6 bg-slate-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Provider Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitor real-time provider assignments and capacity</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Select Provider</label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="bg-transparent text-base font-bold text-slate-900 focus:outline-none cursor-pointer"
            >
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        {dashboardData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Remaining Quota</p>
                <p className="text-5xl font-black text-slate-900">{dashboardData.provider.remainingQuota}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-green-600 font-bold text-2xl">
                 ✓
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Used Quota</p>
                <p className="text-5xl font-black text-slate-900">{dashboardData.provider.usedQuota}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-2xl">
                 !
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Leads</p>
                <p className="text-5xl font-black text-slate-900">{dashboardData.totalLeads}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl">
                 #
              </div>
            </div>
          </div>
        ) : (
           <div className="h-36 flex items-center justify-center text-slate-500 font-medium bg-white border-2 border-slate-200 border-dashed rounded-2xl">Loading statistics...</div>
        )}

        {/* Leads Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Assignments</h2>
            <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
              Live Updates
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Name</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Phone</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">City</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Service</th>
                  <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Assigned At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {dashboardData?.leads?.length > 0 ? dashboardData.leads.map((item) => (
                  <tr key={item.assignmentId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 font-bold text-slate-900 text-base">{item.lead.name}</td>
                    <td className="px-8 py-6 text-slate-600 font-medium">{item.lead.phone}</td>
                    <td className="px-8 py-6 text-slate-600 font-medium">{item.lead.city}</td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {item.lead.serviceId.name}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-slate-500 text-sm font-bold">
                      {new Date(item.assignedAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold text-lg">
                      No leads assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}