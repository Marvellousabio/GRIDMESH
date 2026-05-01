/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Map as MapIcon, 
  TrendingUp, 
  Sun, 
  Battery, 
  ArrowRight, 
  User, 
  LogOut, 
  LayoutDashboard,
  Search,
  ShoppingCart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { cn } from './lib/utils';

type Page = 'landing' | 'auth' | 'dashboard';
export type UserRole = 'seller' | 'buyer' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-primary/30">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' ? (
          <LandingPage onGetStarted={() => setCurrentPage('auth')} />
        ) : currentPage === 'auth' ? (
          <AuthPage onBack={() => setCurrentPage('landing')} onLogin={handleLogin} />
        ) : (
          <Dashboard role={userRole} onLogout={handleLogout} />
        )}
      </AnimatePresence>
    </div>
  );
}

