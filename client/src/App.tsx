import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route } from "wouter";
import { useState } from "react";

// Layout Components
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";

// Pages
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import Appointments from "@/pages/appointments";
import Messages from "@/pages/messages";
import Telehealth from "@/pages/telehealth";
import MedicalUpload from "@/pages/medical-upload";
import AIInsights from "@/pages/ai-insights";
import AdvancedAIAnalysis from "@/pages/advanced-ai-analysis";
import MedicalRecords from "@/pages/medical-records";
import NotFound from "@/pages/not-found";

// AI Chatbot
import MedicalChatbot from "@/components/ai-chatbot/medical-chatbot";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/dashboard">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <Dashboard />
                </main>
              </div>
            </Route>
            <Route path="/patients">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <Patients />
                </main>
              </div>
            </Route>
            <Route path="/appointments">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <Appointments />
                </main>
              </div>
            </Route>
            <Route path="/messages">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <Messages />
                </main>
              </div>
            </Route>
            <Route path="/telehealth">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <Telehealth />
                </main>
              </div>
            </Route>
            <Route path="/medical-upload">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <MedicalUpload />
                </main>
              </div>
            </Route>
            <Route path="/ai-insights">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <AIInsights />
                </main>
              </div>
            </Route>
            <Route path="/advanced-ai">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <AdvancedAIAnalysis />
                </main>
              </div>
            </Route>
            <Route path="/medical-records">
              <div className="flex h-screen pt-16">
                <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
                <Sidebar />
                <MobileSidebar 
                  isOpen={isMobileSidebarOpen} 
                  onClose={() => setIsMobileSidebarOpen(false)} 
                />
                <main className="flex-1 overflow-y-auto">
                  <MedicalRecords />
                </main>
              </div>
            </Route>
            <Route component={NotFound} />
          </Switch>
          
          {/* AI Chatbot - Available on all pages except home */}
          <Route path="/">
            {() => null}
          </Route>
          <Route>
            <MedicalChatbot />
          </Route>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
