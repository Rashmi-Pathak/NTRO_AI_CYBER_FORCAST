import { Search, User, ChevronRight } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#020813]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/images/media_1788614184995.png" alt="NTRO Logo" className="h-10 object-contain" />
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-white relative">
            Home
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-8 h-1 bg-ntro-blue rounded-t-full shadow-[0_0_10px_#00a3ff]"></span>
          </a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sectors</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors border border-white/10">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors border border-white/10">
            <User className="w-4 h-4" />
          </button>
          <button className="hidden sm:flex items-center gap-2 text-xs font-semibold py-2 px-5 ml-2 border border-ntro-blue text-ntro-blue hover:bg-ntro-blue hover:text-white rounded shadow-[inset_0_0_10px_rgba(0,163,255,0.2)] transition-all">
            Launch Console
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
}
