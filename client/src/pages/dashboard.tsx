import { useState } from "react";
import MetricsCards from "@/components/dashboard/metrics-cards";
import VisitTrendsChart from "@/components/dashboard/visit-trends-chart";
import AIInsightsPanel from "@/components/dashboard/ai-insights-panel";
import TelehealthPreview from "@/components/dashboard/telehealth-preview";
import SchedulePanel from "@/components/dashboard/schedule-panel";
import QuickActions from "@/components/dashboard/quick-actions";
import MessagesPreview from "@/components/dashboard/messages-preview";
import LoadingOverlay from "@/components/ui/loading-overlay";
import NotificationToast from "@/components/ui/notification-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { useEffect } from "react";

export default function Dashboard() {
  const [isAILoading, setIsAILoading] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();

  const handleShowAILoading = () => {
    setIsAILoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsAILoading(false);
      addNotification({
        type: "success",
        title: "AI Analysis Complete",
        message: "New medical insights have been generated and are ready for review.",
      });
    }, 3000);
  };

  // Show welcome notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        type: "info",
        title: "Welcome to InsightMD",
        message: "Your medical dashboard is ready. All data shown is for demonstration purposes only.",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  return (
    <>
      <LoadingOverlay isVisible={isAILoading} />
      
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, Dr. Johnson. Here's what's happening today.
            </p>
          </div>

          {/* Key Metrics Cards */}
          <MetricsCards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Patient Analytics Chart */}
              <VisitTrendsChart />

              {/* Recent AI Insights */}
              <AIInsightsPanel />

              {/* Telehealth Interface Preview */}
              <TelehealthPreview />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Today's Schedule */}
              <SchedulePanel />

              {/* Quick Actions */}
              <QuickActions onShowAILoading={handleShowAILoading} />

              {/* Messages Preview */}
              <MessagesPreview />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
