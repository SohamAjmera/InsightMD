import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileImage, 
  FileText, 
  Brain, 
  Activity, 
  Heart, 
  TrendingUp,
  Calendar,
  MessageSquare,
  Download,
  Eye,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import MedicalUploadArea from "@/components/upload/medical-upload-area";
import BloodTestUpload from "@/components/upload/blood-test-upload";
import MedicalChatbot from "@/components/ai-chatbot/medical-chatbot";
import InsightChart from "@/components/charts/insight-chart";

interface PatientDashboardProps {
  user: any;
}

export default function PatientDashboard({ user }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [recentUploads, setRecentUploads] = useState([
    {
      id: 1,
      type: 'X-Ray',
      filename: 'chest_xray_2024.jpg',
      uploadDate: '2024-01-15',
      status: 'analyzed',
      confidence: 94,
      findings: 'Normal chest X-ray with clear lung fields'
    },
    {
      id: 2,
      type: 'Blood Test',
      filename: 'blood_work_jan_2024.pdf',
      uploadDate: '2024-01-10',
      status: 'analyzed',
      confidence: 88,
      findings: 'All values within normal range, slight vitamin D deficiency'
    }
  ]);

  const [healthMetrics, setHealthMetrics] = useState({
    overallHealth: 85,
    riskLevel: 'Low',
    lastCheckup: '2024-01-15',
    nextAppointment: '2024-02-15'
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'upload', label: 'Upload Files', icon: Upload },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'reports', label: 'Reports', icon: FileText }
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
                  <p className="text-sm text-gray-400">Patient Portal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className="badge-primary">
                  <Activity className="h-3 w-3 mr-1" />
                  Health Score: {healthMetrics.overallHealth}%
                </Badge>
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
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
              Welcome back, {user.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-400 text-lg">
              Your AI-powered health insights dashboard
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
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
                {/* Health Overview */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
                  {/* Health Score Card */}
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Heart className="h-5 w-5 text-red-400" />
                        <span>Health Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{healthMetrics.overallHealth}%</div>
                          <div className="text-sm text-gray-400">Overall Health</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{healthMetrics.riskLevel}</div>
                          <div className="text-sm text-gray-400">Risk Level</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{recentUploads.length}</div>
                          <div className="text-sm text-gray-400">Reports</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">3</div>
                          <div className="text-sm text-gray-400">Insights</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Health Score Progress</span>
                          <span>{healthMetrics.overallHealth}%</span>
                        </div>
                        <Progress value={healthMetrics.overallHealth} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Uploads */}
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <FileImage className="h-5 w-5 text-blue-400" />
                        <span>Recent Uploads</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentUploads.map((upload) => (
                          <div key={upload.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                            <div className="flex items-center space-x-4">
                              <div className="medical-icon">
                                {upload.type === 'X-Ray' ? <FileImage className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                              </div>
                              <div>
                                <h4 className="font-medium text-white">{upload.filename}</h4>
                                <p className="text-sm text-gray-400">{upload.type} • {upload.uploadDate}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge className={upload.status === 'analyzed' ? 'status-success' : 'status-warning'}>
                                {upload.status === 'analyzed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                {upload.status}
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

                  {/* AI Insights Chart */}
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                        <span>Health Trends</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <InsightChart />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Sidebar */}
                <motion.div variants={itemVariants} className="space-y-6">
                  {/* Quick Actions */}
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => setActiveTab('upload')}
                        className="w-full btn-primary"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Medical Files
                      </Button>
                      <Button 
                        onClick={() => setActiveTab('insights')}
                        className="w-full btn-secondary"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        View AI Insights
                      </Button>
                      <Button className="w-full btn-ghost">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Next Appointment */}
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="text-white">Next Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-400">{healthMetrics.nextAppointment}</div>
                        <div className="text-sm text-gray-400">Dr. Sarah Johnson</div>
                        <div className="text-sm text-gray-400">Annual Checkup</div>
                        <Button size="sm" className="mt-3 btn-primary">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message Doctor
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Tips */}
                  <Card className="medical-card">
                    <CardHeader>
                      <CardTitle className="text-white">AI Health Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <p className="text-sm text-blue-300">💧 Stay hydrated - aim for 8 glasses of water daily</p>
                        </div>
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <p className="text-sm text-green-300">🏃‍♂️ Your activity levels are great! Keep it up</p>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                          <p className="text-sm text-purple-300">😴 Consider improving sleep schedule for better recovery</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <MedicalUploadArea onUpload={(file) => console.log('Medical file uploaded:', file)} />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <BloodTestUpload onUpload={(file) => console.log('Blood test uploaded:', file)} />
                </motion.div>
              </div>
            )}

            {activeTab === 'insights' && (
              <motion.div variants={itemVariants}>
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Brain className="h-5 w-5 text-purple-400" />
                      <span>AI Medical Insights</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      AI-powered analysis of your medical data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentUploads.map((upload) => (
                        <div key={upload.id} className="ai-insight">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-white">{upload.type} Analysis</h3>
                              <p className="text-sm text-gray-400">{upload.uploadDate}</p>
                            </div>
                            <div className="ai-confidence">
                              <span className="text-blue-400">{upload.confidence}% Confidence</span>
                            </div>
                          </div>
                          
                          <div className="ai-recommendation">
                            <p>{upload.findings}</p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <Badge className="status-success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Analysis Complete
                            </Badge>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="btn-secondary">
                                <Download className="h-3 w-3 mr-1" />
                                Download Report
                              </Button>
                              <Button size="sm" className="btn-primary">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Ask AI
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div variants={itemVariants}>
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <FileText className="h-5 w-5 text-green-400" />
                      <span>Medical Reports</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">No Reports Yet</h3>
                      <p className="text-gray-500 mb-6">Upload medical files to generate AI-powered reports</p>
                      <Button 
                        onClick={() => setActiveTab('upload')}
                        className="btn-primary"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload First File
                      </Button>
                    </div>
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