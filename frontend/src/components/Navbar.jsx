import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-sm">PM</div>
          Prowider Mini
        </Link>
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-600">
          <Link href="/request-service" className="hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all">Request Service</Link>
          <Link href="/dashboard" className="hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all">Dashboard</Link>
          <Link href="/test-tools" className="hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg transition-all">Test Tools</Link>
        </div>
      </div>
    </nav>
  );
}
