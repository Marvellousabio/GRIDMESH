import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Map as MapIcon, 
  TrendingUp, 
  Sun, 
  Battery, 
  LogOut, 
  LayoutDashboard,
  Search,
  ShoppingCart,
  Plus,
  Coins,
  History,
  CloudSun,
  Activity,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../App';
import { Button, Card, Badge } from '../components/UI';
import { GridMap } from '../components/GridMap';
import { DemandForecast } from '../components/DemandForecast';
import { MOCK_LISTINGS, RECENT_TRADES } from '../mockData';
import { getEnergyInsights } from '../services/geminiService';
import { cn } from '../lib/utils';

export function Dashboard({ role, onLogout }: { role: UserRole, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'history'>('overview');
  const [aiInsight, setAiInsight] = useState<string>("Analyzing local grid nodes...");
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  useEffect(() => {
    async function loadInsights() {
      const insight = await getEnergyInsights(85, 30, 'Partly Cloudy');
      setAiInsight(insight);
    }
    loadInsights();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Grid Map', icon: MapIcon },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-display font-bold">GRIDMESH</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.id 
                  ? "bg-brand-primary/10 text-brand-primary" 
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 border-bottom border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex flex-col">
             <h2 className="text-xl font-display font-bold">Good morning, Energy Trader</h2>
             <p className="text-xs text-slate-500 font-medium">Lekki Node #249 • 24.5°C</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
               <Coins className="text-amber-500 w-4 h-4" />
               <span className="font-bold text-sm">₦42,500.00</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Stats & AI */}
              <div className="lg:col-span-8 space-y-8">
                 {/* AI Insights Card */}
                 <Card className="bg-grid-black text-white p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-widest mb-4">
                        <Activity className="w-4 h-4" />
                        Live AI Mesh Insight
                      </div>
                      <p className="text-lg font-medium leading-relaxed max-w-2xl">
                        "{aiInsight}"
                      </p>
                      <div className="mt-4 flex gap-4">
                        <Badge variant="info">High Demand Node</Badge>
                        <Badge variant="success">Peak Solar Yield</Badge>
                      </div>
                    </div>
                 </Card>

                 {/* Role-specific Action & Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {role === 'seller' ? (
                      <Card className="p-6 border-l-4 border-emerald-500">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <Sun className="w-6 h-6" />
                          </div>
                          <Badge variant="success">Active Station</Badge>
                        </div>
                        <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Solar Production</h4>
                        <div className="text-3xl font-display font-bold mb-2">12.4 <span className="text-sm font-sans text-slate-400">kW</span></div>
                        <Button className="w-full mt-4" onClick={() => setIsListingModalOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" /> List Surplus Energy
                        </Button>
                      </Card>
                    ) : (
                       <Card className="p-6 border-l-4 border-brand-primary">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-brand-primary">
                            <Battery className="w-6 h-6" />
                          </div>
                          <Badge variant="info">Energy Access</Badge>
                        </div>
                        <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Current Usage</h4>
                        <div className="text-3xl font-display font-bold mb-2">4.2 <span className="text-sm font-sans text-slate-400">kW</span></div>
                        <Button className="w-full mt-4" onClick={() => setActiveTab('map')}>
                          <Search className="w-4 h-4 mr-2" /> Find Nearby Energy
                        </Button>
                      </Card>
                    )}

                    <Card className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                          <TrendingUp className="w-6 h-6" />
                        </div>
                      </div>
                      <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Earnings</h4>
                      <div className="text-3xl font-display font-bold mb-2">₦128,450</div>
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +12.5% from last week
                      </p>
                    </Card>
                 </div>

                 {/* Forecasting Panel */}
                 <Card className="p-6">
                    <div className="flex justify-between items-center mb-8">
                       <div>
                         <h3 className="text-lg font-bold">AI Forecasting Panel</h3>
                         <p className="text-sm text-slate-500">24-hour demand vs production forecast</p>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <div className="w-3 h-3 bg-blue-500 rounded-sm" /> Neighborhood Demand
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <div className="w-3 h-3 bg-energy-yellow rounded-sm" /> Solar Yield
                          </div>
                       </div>
                    </div>
                    <DemandForecast />
                 </Card>
              </div>

              {/* Right Column: Recent Activity & Map Teaser */}
              <div className="lg:col-span-4 space-y-8">
                 <Card className="p-0 overflow-hidden h-[400px]">
                    <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                       <h3 className="font-bold flex items-center gap-2">
                         <MapIcon className="w-4 h-4 text-brand-primary" /> Mesh Map
                       </h3>
                       <button onClick={() => setActiveTab('map')} className="text-xs font-bold text-brand-primary">Expand</button>
                    </div>
                    <div className="h-full">
                       <GridMap />
                    </div>
                 </Card>

                 <Card className="p-6">
                    <h3 className="font-bold mb-6 flex items-center gap-2">
                       <History className="w-4 h-4 text-brand-primary" /> Recent Transactions
                    </h3>
                    <div className="space-y-6">
                       {RECENT_TRADES.map((trade) => (
                         <div key={trade.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-mono text-xs">
                                  {trade.buyer[0]}
                               </div>
                               <div>
                                  <div className="text-sm font-bold">{trade.buyer}</div>
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{trade.date}</div>
                               </div>
                            </div>
                            <div className="text-right">
                               <div className="text-sm font-bold text-emerald-600">₦{trade.total}</div>
                               <div className="text-[10px] text-slate-500">{trade.amount} kWh</div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <Button variant="ghost" className="w-full mt-6 text-brand-primary text-xs font-bold">
                       View All Statements
                    </Button>
                 </Card>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-[calc(100vh-12rem)]">
              <Card className="h-full p-0 overflow-hidden relative">
                 <div className="absolute top-4 left-4 z-[1000] space-y-2">
                    <div className="glass p-4 rounded-xl max-w-sm shadow-xl">
                       <h3 className="font-display font-bold mb-2">Live Neighborhood Mesh</h3>
                       <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                          Visualizing real-time energy flows between nodes in your local neighborhood. Nodes in yellow have surplus capacity.
                       </p>
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text" placeholder="Search nodes..." className="bg-slate-50 w-full rounded-lg pl-9 p-2 text-xs border border-slate-200 outline-none" />
                       </div>
                    </div>
                    
                    <div className="glass p-3 rounded-xl shadow-lg flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                              <ShieldCheck className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mesh Stability</div>
                              <div className="text-sm font-bold">98.4% Optimal</div>
                           </div>
                        </div>
                    </div>
                 </div>
                 
                 <GridMap />
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Structured "List Energy" Modal Teaser */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <Card className="w-full max-w-lg p-8 shadow-2xl relative">
              <button 
                onClick={() => setIsListingModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
              <div className="mb-8">
                 <h2 className="text-2xl font-display font-bold">List Energy Surplus</h2>
                 <p className="text-slate-500">Configure your trade parameters</p>
              </div>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Capacity (kWh)</label>
                       <input type="number" defaultValue={20} className="w-full border p-3 rounded-xl outline-none focus:border-brand-primary" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Price (₦/kWh)</label>
                       <input type="number" defaultValue={120} className="w-full border p-3 rounded-xl outline-none focus:border-brand-primary" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Time Slot</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['Morning', 'Afternoon', 'Evening'].map((slot) => (
                         <button key={slot} className={cn("p-2 rounded-lg border text-xs font-bold transition-colors", slot === 'Morning' ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-200 text-slate-500')}>
                            {slot}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <CloudSun className="text-emerald-600 w-5 h-5 flex-shrink-0 mt-1" />
                    <p className="text-xs text-emerald-800 leading-relaxed">
                       <strong>Smart Tip:</strong> Weather forecast indicates 100% sunlight today. Consider increasing your available capacity to maximize earnings.
                    </p>
                 </div>
                 
                 <div className="pt-4 flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setIsListingModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1" onClick={() => setIsListingModalOpen(false)}>Publish to Mesh</Button>
                 </div>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}
