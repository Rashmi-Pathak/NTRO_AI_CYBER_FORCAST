import { Twitter, Linkedin, Youtube, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#020813] border-t border-white/5 py-8">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/images/media_1788614184995.png" alt="NTRO Logo" className="h-8 object-contain" />
        </div>
        
        <div className="flex items-center gap-6 text-xs text-gray-400 font-mono tracking-widest uppercase">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Sectors</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        
        <div className="flex items-center gap-4 text-gray-400">
           <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
           <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
           <a href="#" className="hover:text-white transition-colors"><Youtube className="w-4 h-4" /></a>
           <a href="#" className="hover:text-white transition-colors"><AlertCircle className="w-4 h-4" /></a>
        </div>

        <div className="text-[10px] text-gray-500 text-right">
          A SAFER, MORE RESILIENT INDIA<br />
          © 2026 NTRO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
