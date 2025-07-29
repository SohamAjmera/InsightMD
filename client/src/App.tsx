import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import Appointments from "@/pages/appointments";
import Telehealth from "@/pages/telehealth";
import AIInsights from "@/pages/ai-insights";
import MedicalUpload from "@/pages/medical-upload";
import AdvancedAIAnalysis from "@/pages/advanced-ai-analysis";
import MedicalRecords from "@/pages/medical-records";
import Messages from "@/pages/messages";
import Analytics from "@/pages/analytics";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useState } from "react";

function Router() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-medical-bg">
      <Header onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
      <div className="flex h-screen pt-16">
        <Sidebar />
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/patients" component={Patients} />
            <Route path="/appointments" component={Appointments} />
            <Route path="/telehealth" component={Telehealth} />
            <Route path="/ai-insights" component={AIInsights} />
            <Route path="/medical-upload" component={MedicalUpload} />
            <Route path="/advanced-ai" component={AdvancedAIAnalysis} />
            <Route path="/medical-records" component={MedicalRecords} />
            <Route path="/messages" component={Messages} />
            <Route path="/analytics" component={Analytics} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
