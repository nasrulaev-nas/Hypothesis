
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpenCheck, 
  Terminal, 
  Code2, 
  LogOut,
  Zap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, label, icon: Icon, active }: { to: string; label: string; icon: any; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
              <Zap size={24} className="text-white fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none">Hypothesis</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Intelligence</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4 mt-4">Управление</div>
          <NavItem 
            to="/" 
            active={location.pathname === '/'} 
            label="Обзор" 
            icon={LayoutDashboard}
          />
          <NavItem 
            to="/experiments" 
            active={location.pathname.startsWith('/experiments')} 
            label="Эксперименты" 
            icon={FlaskConical}
          />
          
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4 mt-6">Конфигурация</div>
          <NavItem 
            to="/facts" 
            active={location.pathname === '/facts'} 
            label="База фактов" 
            icon={BookOpenCheck}
          />
          <NavItem 
            to="/install" 
            active={location.pathname === '/install'} 
            label="Интеграция" 
            icon={Terminal}
          />
          
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4 mt-6">Для разработчиков</div>
           <NavItem 
            to="/architecture" 
            active={location.pathname === '/architecture'} 
            label="Архитектура API" 
            icon={Code2}
          />
        </nav>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800">
            <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-slate-800/30">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-slate-700 shadow-lg"></div>
                 <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-white truncate">Acme Corp</span>
                    <span className="text-[10px] text-slate-500 font-medium">Enterprise Plan</span>
                 </div>
            </div>
            <Link to="/welcome" className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 transition-all duration-300 group">
                <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                <span>Выйти из кабинета</span>
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto p-10">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
