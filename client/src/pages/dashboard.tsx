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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Activity, 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Sparkles,
  Eye,
  Heart,
  Shield,
  Zap,
  ArrowRight,
  Plus,
  Bell,
  Clock,
  Star
} from "lucide-react";

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

  const recentInsights = [
    {
      id: 1,
      title: "Chest X-Ray Analysis",
      description: "Normal cardiac silhouette with clear lung fields. No significant abnormalities detected.",
      confidence: 95,
      riskLevel: "low",
      timestamp: "2 hours ago",
      type: "xray"
    },
    {
      id: 2,
      title: "Blood Test Results",
      description: "All values within normal range. Slight elevation in cholesterol levels noted.",
      confidence: 88,
      riskLevel: "medium",
      timestamp: "1 day ago",
      type: "blood_test"
    },
    {
      id: 3,
      title: "MRI Brain Scan",
      description: "No acute abnormalities. Normal brain parenchyma and ventricular system.",
      confidence: 92,
      riskLevel: "low",
      timestamp: "3 days ago",
      type: "mri"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      time: "09:00 AM",
      type: "Follow-up",
      status: "confirmed"
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "11:30 AM",
      type: "Consultation",
      status: "pending"
    },
    {
      id: 3,
      patient: "Emily Rodriguez",
      time: "02:00 PM",
      type: "Review",
      status: "confirmed"
    }
  ];

  const quickActions = [
    {
      title: "Upload Medical Data",
      description: "Analyze new scans or reports",
      icon: Plus,
      color: "from-blue-500 to-purple-500",
      action: () => window.location.href = '/medical-upload'
    },
    {
      title: "View AI Insights",
      description: "Review recent analyses",
      icon: Brain,
      color: "from-green-500 to-blue-500",
      action: () => window.location.href = '/ai-insights'
    },
    {
      title: "3D Visualization",
      description: "Explore 3D models",
      icon: Eye,
      color: "from-purple-500 to-pink-500",
      action: () => window.location.href = '/advanced-ai'
    },
    {
      title: "Patient Records",
      description: "Access medical history",
      icon: Users,
      color: "from-orange-500 to-red-500",
      action: () => window.location.href = '/patients'
    }
  ];

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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="py-10 px-6">
          <div className="container mx-auto max-w-7xl">
            {/* Dashboard Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Dashboard Overview
                  </h1>
                  <p className="text-xl text-gray-600 mt-3">
                    Welcome back, Dr. Johnson. Here's what's happening today.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50 px-4 py-2 rounded-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Powered
                  </Badge>
                  <Button 
                    onClick={handleShowAILoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Insights
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="mb-12">
              <MetricsCards />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Patient Analytics Chart */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <span>Patient Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VisitTrendsChart />
                  </CardContent>
                </Card>

                {/* Recent AI Insights */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <span>Recent AI Insights</span>
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Latest medical analyses and findings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentInsights.map((insight) => (
                      <div key={insight.id} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <Activity className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <p className="text-sm text-gray-500">{insight.timestamp}</p>
                            </div>
                          </div>
                          <Badge className={`px-3 py-1 rounded-full ${
                            insight.riskLevel === 'low' ? 'bg-green-100 text-green-800 border-green-200' :
                            insight.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {insight.confidence}% Confidence
                          </Badge>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{insight.description}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full rounded-xl border-gray-300 hover:border-gray-400">
                      View All Insights
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Telehealth Interface Preview */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <span>Telehealth Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TelehealthPreview />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Today's Schedule */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <span>Today's Schedule</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{appointment.patient}</h4>
                          <Badge className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.time}
                          </span>
                          <span>{appointment.type}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full rounded-xl border-gray-300 hover:border-gray-400">
                      View Full Schedule
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start p-4 rounded-xl border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200"
                        onClick={action.action}
                      >
                        <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">{action.title}</div>
                          <div className="text-sm text-gray-500">{action.description}</div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Messages Preview */}
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <span>Recent Messages</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MessagesPreview />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI Insights Panel */}
            <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <span>Advanced AI Insights</span>
                </CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIInsightsPanel />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
