import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Zap, Mail, Lock, User, Sun, Battery } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { UserRole } from '../App';

export function AuthPage({ onBack, onLogin }: { onBack: () => void, onLogin: (role: UserRole) => void }) {
  const [role, setRole] = useState<UserRole>('seller');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative p-6">
      <div className="absolute top-8 left-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold">Join GridMesh</h1>
          <p className="text-slate-500 mt-2">Nigeria's decentralized solar exchange</p>
        </div>

        <Card className="p-8">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-8">
            <button
              onClick={() => setRole('seller')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === 'seller' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" /> Seller
            </button>
            <button
              onClick={() => setRole('buyer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === 'buyer' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Battery className="w-4 h-4" /> Buyer
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                />
              </div>
            </div>

            <Button className="w-full py-4 mt-4 font-bold text-lg" onClick={() => onLogin(role)}>
              {role === 'seller' ? 'Register Station' : 'Create Account'}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                Already have an account? <a href="#" className="text-brand-primary font-bold">Log In</a>
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-8 font-medium">
          Secured with blockchain & Nigeria Energy Certifications
        </p>
      </motion.div>
    </div>
  );
}
