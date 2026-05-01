import React from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowRight, Sun, Battery, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '../components/UI';

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden bg-grid-black text-white"
    >
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      
      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
            <Zap className="text-white fill-current" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">GRIDMESH</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</a>
          <a href="#demo" className="hover:text-brand-primary transition-colors">Live Demo</a>
        </div>
        <Button variant="outline" className="text-white border-white/20 hover:border-brand-primary" onClick={onGetStarted}>
          Launch App
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          Powering Nigeria's Next Grid
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] mb-8 max-w-5xl"
        >
          Turn Solar Power <br/>
          <span className="text-brand-primary">Into Income.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12"
        >
          Stop relying on expensive generators. Buy clean energy from your neighbors or sell your solar surplus to help end local blackouts.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="h-14 px-10" onClick={onGetStarted}>
            Sell Energy <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-white border-white/20" onClick={onGetStarted}>
            Buy Energy
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.7 }}
           className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16 border-t border-white/10 pt-12 w-full max-w-5xl"
        >
          <div className="flex flex-col">
            <span className="text-3xl font-display font-bold text-brand-primary">₦2.4M+</span>
            <span className="text-xs text-slate-500 font-mono uppercase mt-1">Saved in Fuel</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-display font-bold text-energy-yellow">450+</span>
            <span className="text-xs text-slate-500 font-mono uppercase mt-1">Outage Hours Averted</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-display font-bold text-blue-400">12.5T</span>
            <span className="text-xs text-slate-500 font-mono uppercase mt-1">CO2 Reduced</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-display font-bold text-white">1.2k+</span>
            <span className="text-xs text-slate-500 font-mono uppercase mt-1">Grid Nodes</span>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="bg-white text-slate-900 py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-brand-primary">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold">List Surplus</h3>
              <p className="text-slate-500">Your solar panels produce more than you use. Connect your inverter and auto-list kWh for your neighborhood.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-energy-yellow">
                <Battery className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold">Real-time Trading</h3>
              <p className="text-slate-500">A decentralized marketplace where supply meets demand instantly. Pay only for what you consume.</p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-display font-bold">AI Node Map</h3>
              <p className="text-slate-500">Advanced AI analyzes local demand to optimize pricing and visualizes energy flows on a neighborhood mesh map.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-slate-50 py-32 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Experience the Mesh.</h2>
          <p className="text-slate-500 max-w-xl mx-auto">See how we're transforming energy distribution in Lagos, Abuja, and Port Harcourt nodes.</p>
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="aspect-video bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative group">
             {/* Mock Map Image / UI teaser */}
             <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <div className="text-slate-400 font-mono text-sm">Demo Map Loading...</div>
             </div>
             <div className="absolute inset-x-8 bottom-8 flex items-end justify-between z-10">
                <div className="glass p-6 rounded-2xl text-left max-w-xs shadow-lg">
                  <div className="flex items-center gap-2 text-brand-primary font-bold text-xs mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" /> AI PREDICTION
                  </div>
                  <h4 className="font-display font-bold text-lg mb-1">Peak Demand Imminent</h4>
                  <p className="text-sm text-slate-500">Ikeja North expect 45% demand increase at 19:30 due to grid failure.</p>
                </div>
                <Button variant="secondary" className="h-14 px-8 shadow-xl" onClick={onGetStarted}>
                  Explore Node Map
                </Button>
             </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-grid-black border-t border-white/10 py-12 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
            <Zap className="text-brand-primary w-6 h-6" />
            <span className="text-xl font-display font-bold">GRIDMESH</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 GridMesh Systems. Decentralizing the future of energy in Africa.</p>
          <div className="flex gap-6">
             <Globe className="text-slate-500 hover:text-white cursor-pointer transition-colors w-5 h-5" />
             <ShieldCheck className="text-slate-500 hover:text-white cursor-pointer transition-colors w-5 h-5" />
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
