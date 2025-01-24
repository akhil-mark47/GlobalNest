import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { Toast } from './components/ui/Toast';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthLayout } from './components/layout/AuthLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { HousingPage } from './pages/HousingPage';
import { JobsPage } from './pages/JobsPage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { UniversityStudentsPage } from './pages/UniversityStudentsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { CommunityPage } from './pages/CommunityPage';
import { ContactPage } from './pages/ContactPage';
import { ConnectPage} from './pages/Connectpage';

export default function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Toast />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/housing" element={<HousingPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/universities" element={<UniversitiesPage />} />
              <Route path="/universities/:id/students" element={<UniversityStudentsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/news-events" element={<NewsEventsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/connect" element={<ConnectPage />} />

            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}