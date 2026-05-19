import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center p-6 min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Lead Distribution System</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">A professional, real-world simulation of lead generation and assignment with robust MongoDB concurrency handling.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/request-service" className="group block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200">
            <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Request Service</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Submit a new service lead. Triggers the automatic distribution algorithm immediately.</p>
          </Link>

          <Link href="/dashboard" className="group block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200">
            <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Provider Dashboard</h2>
            <p className="text-slate-600 font-medium leading-relaxed">View real-time lead assignments and monitor quota usage dynamically per provider.</p>
          </Link>

          <Link href="/test-tools" className="group block bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200">
            <div className="w-14 h-14 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Test Tools</h2>
            <p className="text-slate-600 font-medium leading-relaxed">Simulate massive concurrency, trigger payments, and verify webhook idempotency.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
