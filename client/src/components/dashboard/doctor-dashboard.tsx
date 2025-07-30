import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  Brain, 
  FileText, 
  MessageSquare,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  BarChart3,
  Stethoscope
} from "lucide-react";
import MedicalChatbot from "@/components/ai-chatbot/medical-chatbot";

interface DoctorDashboardProps {
  user: any;
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const recentPatients = [
    {
      id: 1,
      name: "Emma Davis",
      age: 34,
      lastVisit: "2024-01-15",
      condition: "Hypertension",
      status: "stable",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 45,
      lastVisit: "2024-01-14",
      condition: "Diabetes Type 2",
      status: "improving",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      age: 28,
      lastVisit: "2024-01-13",
      condition: "Routine Checkup",
      status: "healthy",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  const aiInsights = [
    {
      id: 1,
      patient: "Emma Davis",
      type: "Blood Test Analysis",
      confidence: 94,
      priority: "medium",
      finding: "Cholesterol levels slightly elevated, recommend dietary changes",
      date: "2024-01-15"
    },
    {
      id: 2,
      patient: "Michael Chen",
      type: "X-Ray Analysis",
      confidence: 88,
      priority: "low",
      finding: "Normal chest X-ray, no abnormalities detected",
      date: "2024-01-14"
    },
    {
      id: 3,
      patient: "Sarah Johnson",
      type: "MRI Analysis",
      confidence: 96,
      priority: "high",
      finding: "Possible early signs of inflammation, recommend follow-up",
      date: "2024-01-13"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'status-error';
      case 'medium':
        return 'status-warning';
      default:
        return 'status-success';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'status-info';
      case 'improving':
        return 'status-success';
      case 'healthy':
        return 'status-success';
      default:
        return 'status-warning';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element top-20 left-20">
          <div className="floating-circle animate-float" style={{ animationDelay: '0s' }} />
        </div>
        <div className="floating-element top-40 right-32">
          <div className="floating-circle animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="floating-element bottom-32 left-1/3">
          <div className="floating-circle animate-float" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="nav-dark sticky top-0 z-40"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">InsightMD</h1>
                  <p className="text-sm text-gray-400">Doctor Portal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className="badge-primary">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  {user.specialization || 'Internal Medicine'}
                </Badge>
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-purple-500"
                  />
                  <span className="text-white font-medium">{user.name}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Good morning, Dr. {user.name.split(' ')[1]}! 👨‍⚕️
            </h2>
            <p className="text-gray-400 text-lg">
              Your AI-powered medical practice dashboard
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Patients</p>
                    <p className="text-2xl font-bold text-white">247</p>
                  </div>
                  <div className="medical-icon bg-gradient-to-br from-blue-500 to-purple-500">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Today's Appointments</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <div className="medical-icon bg-gradient-to-br from-green-500 to-blue-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">AI Insights</p>
                    <p className="text-2xl font-bold text-white">34</p>
                  </div>
                  <div className="medical-icon bg-gradient-to-br from-purple-500 to-pink-500">
                    <Brain className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending Reviews</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                  <div className="medical-icon bg-gradient-to-br from-orange-500 to-red-500">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-1 border border-gray-700/50">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Patients */}
                  <motion.div variants={itemVariants}>
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-white">
                          <Users className="h-5 w-5 text-blue-400" />
                          <span>Recent Patients</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentPatients.map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={patient.avatar} alt={patient.name} />
                                  <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium text-white">{patient.name}</h4>
                                  <p className="text-sm text-gray-400">Age {patient.age} • {patient.condition}</p>
                                  <p className="text-xs text-gray-500">Last visit: {patient.lastVisit}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Badge className={getStatusColor(patient.status)}>
                                  {patient.status}
                                </Badge>
                                <Button size="sm" variant="outline" className="btn-secondary">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* AI Insights */}
                  <motion.div variants={itemVariants}>
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-white">
                          <Brain className="h-5 w-5 text-purple-400" />
                          <span>Recent AI Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {aiInsights.map((insight) => (
                            <div key={insight.id} className="ai-insight">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-medium text-white">{insight.type}</h4>
                                  <p className="text-sm text-gray-400">Patient: {insight.patient}</p>
                                  <p className="text-xs text-gray-500">{insight.date}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getPriorityColor(insight.priority)}>
                                    {insight.priority}
                                  </Badge>
                                  <div className="ai-confidence">
                                    <span className="text-purple-400">{insight.confidence}%</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-300 mb-3">{insight.finding}</p>
                              <div className="flex space-x-2">
                                <Button size="sm" className="btn-primary">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Review
                                </Button>
                                <Button size="sm" variant="outline" className="btn-secondary">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Discuss
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Today's Schedule */}
                  <motion.div variants={itemVariants}>
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="text-white">Today's Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { time: "09:00", patient: "Emma Davis", type: "Follow-up" },
                            { time: "10:30", patient: "Michael Chen", type: "Consultation" },
                            { time: "14:00", patient: "Sarah Johnson", type: "Check-up" }
                          ].map((appointment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                              <div>
                                <div className="font-medium text-white">{appointment.time}</div>
                                <div className="text-sm text-gray-400">{appointment.patient}</div>
                                <div className="text-xs text-gray-500">{appointment.type}</div>
                              </div>
                              <Button size="sm" variant="outline" className="btn-secondary">
                                <Calendar className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div variants={itemVariants}>
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full btn-primary">
                          <Users className="h-4 w-4 mr-2" />
                          Add New Patient
                        </Button>
                        <Button className="w-full btn-secondary">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                        <Button className="w-full btn-ghost">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Notifications */}
                  <motion.div variants={itemVariants}>
                    <Card className="medical-card">
                      <CardHeader>
                        <CardTitle className="text-white">Notifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-sm text-red-300">🚨 High priority AI insight requires review</p>
                          </div>
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-300">📅 3 appointments scheduled for tomorrow</p>
                          </div>
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-sm text-green-300">✅ 5 reports ready for download</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Other tab contents would go here */}
            {activeTab !== 'overview' && (
              <motion.div variants={itemVariants}>
                <Card className="medical-card">
                  <CardContent className="p-12 text-center">
                    <Brain className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      {tabs.find(t => t.id === activeTab)?.label} Coming Soon
                    </h3>
                    <p className="text-gray-500">
                      This feature is under development and will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* AI Chatbot */}
      <MedicalChatbot />
    </div>
  );
}