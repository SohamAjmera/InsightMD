import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Auth and Dashboard Components
import AuthPage from "@/pages/auth";
import PatientDashboard from "@/components/dashboard/patient-dashboard";
import DoctorDashboard from "@/components/dashboard/doctor-dashboard";
import LandingPage from "@/pages/landing";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useLocation();

  // Check for stored user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('insightmd_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('insightmd_user');
      }
    }
  }, []);

  const handleAuth = (userData: any) => {
    setUser(userData);
    localStorage.setItem('insightmd_user', JSON.stringify(userData));
    
    // Redirect to appropriate dashboard
    if (userData.type === 'doctor') {
      setLocation('/doctor-dashboard');
    } else {
      setLocation('/patient-dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('insightmd_user');
    setLocation('/');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <AnimatePresence mode="wait">
            <Switch>
              <Route path="/">
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LandingPage onGetStarted={() => setLocation('/auth')} />
                </motion.div>
              </Route>
              
              <Route path="/auth">
                <motion.div
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthPage onAuth={handleAuth} />
                </motion.div>
              </Route>
              
              <Route path="/patient-dashboard">
                {user && user.type === 'patient' ? (
                  <motion.div
                    key="patient-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PatientDashboard user={user} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="redirect-auth"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AuthPage onAuth={handleAuth} />
                  </motion.div>
                )}
              </Route>
              
              <Route path="/doctor-dashboard">
                {user && user.type === 'doctor' ? (
                  <motion.div
                    key="doctor-dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DoctorDashboard user={user} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="redirect-auth"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AuthPage onAuth={handleAuth} />
                  </motion.div>
                )}
              </Route>
            </Switch>
          </AnimatePresence>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
