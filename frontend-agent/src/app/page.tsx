"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, Activity, Zap, Shield, Cpu } from "lucide-react";

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#E2FF00] font-sans selection:bg-[#E2FF00] selection:text-black overflow-x-hidden">
      {/* Grid Background */}
      <div
        className="fixed inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(#E2FF00 1px, transparent 1px), linear-gradient(90deg, #E2FF00 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Navbar */}
      <nav className="relative z-50 w-full border-b-4 border-black bg-[#E2FF00] text-black">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black rotate-3 hover:-rotate-3 transition-transform">
              <Sparkles className="w-6 h-6 text-[#E2FF00]" />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic">SERVIX</span>
          </div>
          <div className="hidden md:flex gap-8 font-bold uppercase tracking-widest text-sm">
            <a href="https://github.com/drishgo/Servix" className="hover:underline underline-offset-8">Docs</a>
            <a href="#pricing" className="hover:underline underline-offset-8">Pricing</a>
            <a href="#contact" className="hover:underline underline-offset-8">Contact Us</a>
          </div>
          <Link href="/chat">
            <button className="bg-black text-[#E2FF00] px-6 py-3 font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none">
              Launch App
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full pt-20 pb-32 px-6 min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
          {/* Left / Typography */}
          <div className={`flex-1 space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="inline-block bg-[#E2FF00] text-black px-4 py-1 text-sm font-bold uppercase tracking-widest border-2 border-black -rotate-2 hover:rotate-2 transition-transform cursor-default">
              v1.0.0 Protocol Alpha
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black uppercase italic leading-[0.85] tracking-tighter">
              Engineered<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #E2FF00' }}>For</span><br />
              Excellence.
            </h1>

            <p className="text-xl md:text-2xl font-medium max-w-xl text-white/90 border-l-4 border-[#E2FF00] pl-6 py-2">
              The next-generation autonomous AI system built for relentless execution and uncompromising precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Link href="/chat" className="group">
                <button className="w-full sm:w-auto bg-[#E2FF00] text-black px-10 py-5 text-lg font-black uppercase tracking-widest border-4 border-black hover:bg-white transition-all shadow-[8px_8px_0px_#ffffff] hover:shadow-[12px_12px_0px_#ffffff] group-active:translate-y-2 group-active:translate-x-2 group-active:shadow-none flex items-center justify-center gap-4">
                  Initialize System
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right / Visual Element */}
          <div className={`flex-1 w-full relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-full aspect-square max-w-lg mx-auto relative group perspective-1000">
              <div className="absolute inset-0 bg-[#E2FF00] border-4 border-black rotate-6 group-hover:rotate-12 transition-transform duration-500 ease-out z-0"></div>
              <div className="absolute inset-0 bg-[#111] border-4 border-[#E2FF00] z-10 flex flex-col p-8 justify-between shadow-[16px_16px_0px_#E2FF00] group-hover:-translate-y-4 group-hover:-translate-x-4 transition-transform duration-500">
                <div className="flex justify-between items-start">
                  <Terminal className="w-12 h-12 text-[#E2FF00]" />
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E2FF00] animate-pulse"></span>
                    <span className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '150ms' }}></span>
                  </div>
                </div>

                <div className="space-y-4 font-mono">
                  <p className="text-[#E2FF00] opacity-80 text-sm">{'> SYSTEM BOOT SEQUENCE INITIATED'}</p>
                  <p className="text-white text-sm">{'> LOADING CORE MODULES... [OK]'}</p>
                  <p className="text-white text-sm">{'> NEURAL NETWORKS SYNC... [OK]'}</p>
                  <p className="text-white text-sm">{'> ESTABLISHING UPLINK... [OK]'}</p>
                  <p className="text-[#E2FF00] text-xl font-bold mt-4 animate-pulse">{'> READY FOR INPUT_'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Scrolling Marquee */}
      <div className="w-full bg-[#E2FF00] border-y-4 border-black py-6 overflow-hidden z-20 relative flex text-black">
        <div className="flex whitespace-nowrap animate-[marquee_15s_linear_infinite] font-black uppercase tracking-tighter text-4xl italic">
          <span className="mx-8">SERVIX AUTONOMOUS AGENT</span>
          <Activity className="w-10 h-10 inline mx-4 border-2 border-black rounded-full p-1" />
          <span className="mx-8">MAXIMUM EFFICIENCY</span>
          <Activity className="w-10 h-10 inline mx-4 border-2 border-black rounded-full p-1" />
          <span className="mx-8">ZERO COMPROMISE</span>
          <Activity className="w-10 h-10 inline mx-4 border-2 border-black rounded-full p-1" />
          <span className="mx-8">SERVIX AUTONOMOUS AGENT</span>
          <Activity className="w-10 h-10 inline mx-4 border-2 border-black rounded-full p-1" />
          <span className="mx-8">MAXIMUM EFFICIENCY</span>
          <Activity className="w-10 h-10 inline mx-4 border-2 border-black rounded-full p-1" />
          <span className="mx-8">ZERO COMPROMISE</span>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="w-full py-32 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter bg-[#E2FF00] text-black inline-block px-8 py-4 border-4 border-black rotate-1 hover:-rotate-1 transition-transform">
              Core Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#111] p-10 border-4 border-black hover:border-[#E2FF00] hover:bg-[#E2FF00] hover:text-black group transition-all duration-300 shadow-[8px_8px_0px_#E2FF00] hover:shadow-[16px_16px_0px_#ffffff] hover:-translate-y-2">
              <Zap className="w-16 h-16 text-[#E2FF00] group-hover:text-black mb-8" />
              <h3 className="text-3xl font-black uppercase italic mb-4">Hyper Speed</h3>
              <p className="font-medium text-lg leading-relaxed opacity-80 group-hover:opacity-100">
                Optimized execution pipelines delivering responses with unparalleled velocity.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#111] p-10 border-4 border-black hover:border-[#E2FF00] hover:bg-[#E2FF00] hover:text-black group transition-all duration-300 shadow-[8px_8px_0px_#E2FF00] hover:shadow-[16px_16px_0px_#ffffff] translate-y-0 md:translate-y-12 hover:md:translate-y-8">
              <Cpu className="w-16 h-16 text-[#E2FF00] group-hover:text-black mb-8" />
              <h3 className="text-3xl font-black uppercase italic mb-4">Advanced AI</h3>
              <p className="font-medium text-lg leading-relaxed opacity-80 group-hover:opacity-100">
                Powered by state-of-the-art language models with complex sequential reasoning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#111] p-10 border-4 border-black hover:border-[#E2FF00] hover:bg-[#E2FF00] hover:text-black group transition-all duration-300 shadow-[8px_8px_0px_#E2FF00] hover:shadow-[16px_16px_0px_#ffffff] hover:-translate-y-2">
              <Shield className="w-16 h-16 text-[#E2FF00] group-hover:text-black mb-8" />
              <h3 className="text-3xl font-black uppercase italic mb-4">Secure Core</h3>
              <p className="font-medium text-lg leading-relaxed opacity-80 group-hover:opacity-100">
                Enterprise-grade security paradigms protecting your data and instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black border-t-8 border-[#E2FF00] py-16 px-6 relative z-10 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Sparkles className="w-10 h-10 text-[#E2FF00]" />
            <span className="text-5xl font-black tracking-tighter uppercase italic text-[#E2FF00]">SERVIX</span>
          </div>
          <div className="text-center font-bold tracking-widest text-sm uppercase opacity-50">
            © {new Date().getFullYear()} SERVIX AI SYSTEMS. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <span className="w-3 h-3 bg-[#E2FF00] border border-black shadow-[2px_2px_0px_#fff]"></span>
            <span className="w-3 h-3 bg-white border border-black shadow-[2px_2px_0px_#E2FF00]"></span>
            <span className="w-3 h-3 bg-[#E2FF00] border border-black shadow-[2px_2px_0px_#fff]"></span>
          </div>
        </div>
      </footer>

      {/* Keyframes injection for marquee since we are not directly modifying tailwind.config */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
