import { Play, ChevronRight, Activity, Target, Shield, Globe2, ArrowRight, CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#020813] text-white overflow-x-hidden font-sans">
      
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('/images/media_1788618016749.png')] bg-cover bg-center mix-blend-screen" />
      
      <Navbar />

      <main className="relative z-10 flex-grow pt-24">
        
        {/* HERO SECTION */}
        <section className="relative px-6 lg:px-12 max-w-[1440px] mx-auto min-h-[85vh] flex items-center overflow-hidden rounded-3xl mt-4 border border-white/10 shadow-[0_0_50px_rgba(0,163,255,0.1)]">
          <div className="absolute inset-0 bg-[url('/images/media_1788617943338.jpg')] bg-cover bg-center opacity-60 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020813] via-[#020813]/80 to-transparent" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full relative z-10 p-8 md:p-16">
            <div className="flex flex-col text-left">
              <div className="text-ntro-blue font-mono text-xs tracking-[0.3em] mb-6 uppercase flex items-center gap-3">
                <span>PREDICT</span>
                <span className="w-1 h-1 rounded-full bg-ntro-blue shadow-[0_0_8px_#00a3ff]"></span>
                <span>PREVENT</span>
                <span className="w-1 h-1 rounded-full bg-ntro-blue shadow-[0_0_8px_#00a3ff]"></span>
                <span>PROTECT</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-white drop-shadow-[0_0_25px_rgba(0,163,255,0.4)] leading-[1.1]">
                A SAFER, MORE <br /> RESILIENT INDIA
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-6 font-medium">
                AI-powered intelligence for a secure digital future.
              </p>
              
              <p className="text-gray-400 max-w-lg mb-10 text-sm md:text-base leading-relaxed">
                Real-time threat monitoring, predictive insights, and nationwide cyber intelligence — built for stronger government infrastructure.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 mb-16">
                <button className="bg-ntro-blue hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,163,255,0.4)] hover:shadow-[0_0_30px_rgba(0,163,255,0.6)]">
                  Enter Command Center <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-transparent border border-ntro-blue/40 hover:bg-ntro-blue/10 text-white font-medium px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-all">
                  <Play className="w-4 h-4" fill="currentColor" /> Watch Overview
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-4 gap-6 pt-8 border-t border-ntro-blue/20">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">10+</div>
                  <div className="text-[10px] md:text-xs text-gray-400 font-medium">Government Sectors</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">1.2K+</div>
                  <div className="text-[10px] md:text-xs text-gray-400 font-medium">Threats Analyzed Daily</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-md">99.7%</div>
                  <div className="text-[10px] md:text-xs text-gray-400 font-medium">Uptime & Monitoring</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-ntro-blue mb-1 drop-shadow-[0_0_10px_#00a3ff]">AI-Powered</div>
                  <div className="text-[10px] md:text-xs text-gray-400 font-medium">Predictive Intelligence</div>
                </div>
              </div>
            </div>
            
            {/* The rotating globe has been removed entirely as requested. */}
            <div className="hidden lg:block relative h-full">
               {/* Left empty to let the stunning cyber city background shine through */}
            </div>
          </div>
        </section>

        {/* CAPABILITIES SECTION */}
        <section className="py-20 relative mt-10">
          <div className="absolute inset-0 bg-[url('/images/media_1788617444397.jpg')] bg-cover bg-top opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020813] via-transparent to-[#020813]" />
          <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
            <div className="inline-block px-4 py-1 border border-ntro-blue/30 rounded-full text-ntro-blue text-[10px] font-mono uppercase tracking-[0.2em] mb-6 bg-ntro-blue/5 backdrop-blur">Our Capabilities</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Intelligence at Every Layer</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-16 text-sm">
              From real-time monitoring to predictive analytics, NTRO empowers decision-makers with actionable intelligence across the cyber ecosystem.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {[
                { icon: Activity, title: 'Real-time Monitoring', desc: 'Continuous surveillance across government networks.' },
                { icon: Target, title: 'AI-Powered Forecasting', desc: 'Predict emerging threats before they strike.' },
                { icon: Globe2, title: 'Sector Intelligence', desc: 'Deep insights across critical sectors.' },
                { icon: Shield, title: 'Incident Management', desc: 'Faster response. Stronger recovery.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0a1526]/70 backdrop-blur-md border border-[#1a2c4d] hover:border-ntro-blue/50 rounded-xl p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-ntro-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-10 h-10 rounded-lg bg-[#0f2142] flex items-center justify-center mb-5 border border-white/5">
                    <item.icon className="w-5 h-5 text-ntro-blue" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-100">{item.title}</h3>
                  <p className="text-xs text-gray-400 mb-8">{item.desc}</p>
                  <div className="absolute bottom-6 right-6 text-gray-600 group-hover:text-ntro-blue transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM VIEW SECTION */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-[url('/images/media_1788617813299.jpg')] bg-cover bg-center opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020813] via-[#020813]/60 to-[#020813]" />
          
          <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
            <div className="inline-block px-4 py-1 border border-ntro-blue/30 rounded-full text-ntro-blue text-[10px] font-mono uppercase tracking-[0.2em] mb-6 bg-navy/80 backdrop-blur">Experience the Platform</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">A Unified View of National Cyber Threats</h2>
            <p className="text-gray-400 mb-16 text-sm">Explore our powerful modules designed for real-world impact.</p>
            
            <div className="relative w-full max-w-5xl mx-auto h-[300px] md:h-[450px] flex items-center justify-center group">
               <button className="absolute left-0 z-20 w-10 h-10 rounded-full bg-navy/80 border border-white/10 flex items-center justify-center hover:bg-ntro-blue/20 hover:border-ntro-blue transition-all backdrop-blur-md">
                 <ChevronLeft className="w-5 h-5 text-white" />
               </button>
               
               <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
                 <img src="/images/media_1788616686395.png" alt="Dash Left" className="absolute left-[10%] w-[50%] opacity-50 blur-[2px] transform -rotate-y-12 scale-90 border border-ntro-blue/30 rounded-xl" />
                 <img src="/images/media_1788616737479.png" alt="Dash Right" className="absolute right-[10%] w-[50%] opacity-50 blur-[2px] transform rotate-y-12 scale-90 border border-ntro-blue/30 rounded-xl" />
                 <img src="/images/media_1788616713247.png" alt="Dash Center" className="absolute w-[60%] z-10 border border-ntro-blue shadow-[0_0_50px_rgba(0,163,255,0.3)] rounded-xl" />
                 <div className="absolute -bottom-12 w-[80%] h-[100px] bg-[url('/images/media_1788614108893.png')] bg-contain bg-center bg-no-repeat opacity-60" />
               </div>

               <button className="absolute right-0 z-20 w-10 h-10 rounded-full bg-navy/80 border border-white/10 flex items-center justify-center hover:bg-ntro-blue/20 hover:border-ntro-blue transition-all backdrop-blur-md">
                 <ChevronRight className="w-5 h-5 text-white" />
               </button>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('/images/media_1788617643683.jpg')] bg-cover bg-center opacity-30 mix-blend-screen" />
           <div className="max-w-[1440px] mx-auto px-6 text-center relative z-10">
             <div className="inline-block px-4 py-1 border border-ntro-blue/30 rounded-full text-ntro-blue text-[10px] font-mono uppercase tracking-[0.2em] mb-6 bg-navy/80 backdrop-blur">How It Works</div>
             <h2 className="text-3xl font-bold mb-4 drop-shadow-md">From Data to a Safer Nation</h2>
             <p className="text-gray-400 mb-20 text-sm">A seamless flow from detection to decision-making.</p>

             <div className="relative flex justify-between items-start max-w-4xl mx-auto">
                <div className="absolute top-8 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-ntro-blue/50 to-transparent"></div>
                
                {[
                  { num: '01', title: 'Collect', desc: 'Ingest data from networks, endpoints, and global sources.' },
                  { num: '02', title: 'Analyze', desc: 'AI models detect patterns and anomalies.' },
                  { num: '03', title: 'Predict', desc: 'Forecast potential threats and their impact.' },
                  { num: '04', title: 'Act', desc: 'Enable faster, smarter response and mitigation.' }
                ].map((step, i) => (
                  <div key={i} className="relative flex flex-col items-center w-48 z-10">
                    <div className="w-16 h-16 rounded-full bg-[#051124] border border-ntro-blue/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,163,255,0.2)] mb-6 text-ntro-blue relative">
                      <div className="absolute -top-3 -right-3 text-[10px] font-mono text-gray-500">{step.num}</div>
                      <Target className="w-6 h-6" />
                    </div>
                    <h4 className="text-white font-bold mb-2">{step.title}</h4>
                    <p className="text-xs text-gray-400 text-center">{step.desc}</p>
                  </div>
                ))}
             </div>
           </div>
        </section>

        {/* THREAT INTEL SECTION WITH GIANT SHIELD */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/media_1788618099775.jpg')] bg-cover bg-center opacity-40 mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020813] via-[#020813]/60 to-[#020813]" />
          
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
             
             {/* Left - Globe (kept smaller or replaced by the shield background conceptually, but we can put text here) */}
             <div className="relative h-[400px] flex items-center justify-center">
               <div className="absolute left-0 bottom-[20%] text-left z-20 bg-navy/50 p-6 rounded-2xl backdrop-blur border border-ntro-blue/20">
                 <div className="text-ntro-blue font-bold text-2xl leading-tight uppercase tracking-widest drop-shadow-[0_0_10px_#00a3ff]">
                   THREAT<br/>INTELLIGENCE<br/>FOR A BETTER<br/>TOMORROW
                 </div>
               </div>
             </div>

             {/* Right - Content */}
             <div className="bg-navy/50 p-8 rounded-2xl backdrop-blur border border-white/10">
               <div className="inline-block px-4 py-1 border border-ntro-blue/30 rounded-full text-ntro-blue text-[10px] font-mono uppercase tracking-[0.2em] mb-6 bg-navy/80">Why NTRO</div>
               <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md text-white">More Than a Platform,<br/>A Safer Tomorrow</h2>
               <p className="text-gray-400 mb-10 text-sm">Combining AI, human expertise, and real-time intelligence to protect critical infrastructure and empower a resilient India.</p>
               
               <ul className="space-y-6">
                 {[
                   'Trusted by Government Agencies',
                   'AI-driven, Predictive Intelligence',
                   'Unified View Across All Sectors',
                   'Designed for Real-World Impact'
                 ].map((text, i) => (
                   <li key={i} className="flex items-center gap-4">
                     <div className="w-6 h-6 rounded-full bg-ntro-blue flex items-center justify-center shrink-0 shadow-[0_0_10px_#00a3ff]">
                       <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                     </div>
                     <span className="text-gray-200 text-sm font-medium">{text}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
