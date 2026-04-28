import React from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { ThemeProvider } from './components/ThemeContext';

// Pages
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import ViolationsPage from './pages/ViolationsPage';
import ResultsPage from './pages/ResultsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LegalNoticesPage from './pages/LegalNoticesPage';
import LoginPage from './pages/LoginPage';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function Main() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/violations" element={<ViolationsPage />} />
          <Route path="/violations/:id" element={<ResultsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/legal" element={<LegalNoticesPage />} />
          <Route path="/settings" element={<div className="p-8"><h2 className="text-xl font-bold">Settings</h2><p className="text-slate-500 mt-2">Enterprise security configuration and API key management.</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </ThemeProvider>
  );
}
