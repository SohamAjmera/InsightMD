import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardMetrics, Patient, AiInsightWithPatient, AppointmentWithPatient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Brain, 
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30");
  const [selectedMetric, setSelectedMetric] = useState("patients");
  
  const patientTrendsRef = useRef<HTMLCanvasElement>(null);
  const appointmentTypesRef = useRef<HTMLCanvasElement>(null);
  const insightDistributionRef = useRef<HTMLCanvasElement>(null);

  const { data: metrics } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: insights } = useQuery<AiInsightWithPatient[]>({
    queryKey: ["/api/ai-insights"],
  });

  const { data: appointments } = useQuery<AppointmentWithPatient[]>({
    queryKey: ["/api/appointments"],
  });

  // Calculate analytics data
  const totalPatients = patients?.length || 0;
  const totalInsights = insights?.length || 0;
  const totalAppointments = appointments?.length || 0;
  
  const urgentInsights = insights?.filter(i => i.priority === "urgent" || i.priority === "high").length || 0;
  const avgConfidence = insights?.length 
    ? Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)
    : 0;

  const telehealthCount = appointments?.filter(a => a.type === "telehealth").length || 0;
  const inPersonCount = appointments?.filter(a => a.type === "in-person").length || 0;

  const insightsByType = {
    warning: insights?.filter(i => i.type === "warning").length || 0,
    success: insights?.filter(i => i.type === "success").length || 0,
    error: insights?.filter(i => i.type === "error").length || 0,
    info: insights?.filter(i => i.type === "info").length || 0,
  };

  // Chart drawing functions
  const drawPatientTrendsChart = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mock data for patient trends
    const data = [28, 32, 29, 35, 31, 38, 42, 39, 45, 48, 52, 47];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line chart
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const valueRange = maxValue - minValue;

    // Draw area fill
    ctx.fillStyle = 'rgba(25, 118, 210, 0.1)';
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      if (index === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#1976D2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#1976D2';
    data.forEach((value, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index;
      const y = height - padding - ((value - minValue) / valueRange) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawAppointmentTypesChart = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    const total = telehealthCount + inPersonCount;
    if (total === 0) return;

    const telehealthAngle = (telehealthCount / total) * 2 * Math.PI;
    const inPersonAngle = (inPersonCount / total) * 2 * Math.PI;

    // Draw telehealth slice
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, telehealthAngle);
    ctx.closePath();
    ctx.fill();

    // Draw in-person slice
    ctx.fillStyle = '#1976D2';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, telehealthAngle, telehealthAngle + inPersonAngle);
    ctx.closePath();
    ctx.fill();

    // Draw center circle for donut effect
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawInsightDistributionChart = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    ctx.clearRect(0, 0, width, height);

    const data = [insightsByType.warning, insightsByType.success, insightsByType.error, insightsByType.info];
    const colors = ['#FF9800', '#4CAF50', '#F44336', '#2196F3'];
    const maxValue = Math.max(...data, 1);

    const barWidth = chartWidth / data.length;

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * barWidth + barWidth * 0.2;
      const y = height - padding - barHeight;
      const actualBarWidth = barWidth * 0.6;

      ctx.fillStyle = colors[index];
      ctx.fillRect(x, y, actualBarWidth, barHeight);
    });
  };

  useEffect(() => {
    if (patientTrendsRef.current) {
      drawPatientTrendsChart(patientTrendsRef.current);
    }
    if (appointmentTypesRef.current) {
      drawAppointmentTypesChart(appointmentTypesRef.current);
    }
    if (insightDistributionRef.current) {
      drawInsightDistributionChart(insightDistributionRef.current);
    }
  }, [patients, appointments, insights, telehealthCount, inPersonCount, insightsByType]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="mt-1 text-sm text-gray-600">
              Medical practice insights and performance metrics
            </p>
          </div>
          <div className="flex space-x-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-8 w-8 text-medical-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{totalAppointments}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-8 w-8 text-medical-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Insights</p>
                  <p className="text-3xl font-bold text-gray-900">{totalInsights}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg AI Confidence</p>
                  <p className="text-3xl font-bold text-gray-900">{avgConfidence}%</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+2% from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity className="h-8 w-8 text-medical-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Growth Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-medical-blue" />
                Patient Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas 
                ref={patientTrendsRef}
                className="w-full h-64"
                style={{ width: '100%', height: '256px' }}
              />
            </CardContent>
          </Card>

          {/* Appointment Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-medical-blue" />
                Appointment Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <canvas 
                  ref={appointmentTypesRef}
                  className="w-48 h-48"
                  style={{ width: '192px', height: '192px' }}
                />
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-medical-warning rounded"></div>
                    <div>
                      <p className="text-sm font-medium">Telehealth</p>
                      <p className="text-lg font-bold">{telehealthCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-medical-blue rounded"></div>
                    <div>
                      <p className="text-sm font-medium">In-Person</p>
                      <p className="text-lg font-bold">{inPersonCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Insights Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-medical-blue" />
                AI Insights by Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <canvas 
                ref={insightDistributionRef}
                className="w-full h-48 mb-4"
                style={{ width: '100%', height: '192px' }}
              />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-medical-warning rounded"></div>
                  <span>Warning ({insightsByType.warning})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-medical-success rounded"></div>
                  <span>Success ({insightsByType.success})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-medical-error rounded"></div>
                  <span>Error ({insightsByType.error})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Info ({insightsByType.info})</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-medical-warning" />
                Priority Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">Urgent Insights</span>
                  </div>
                  <Badge className="bg-red-100 text-red-800">{urgentInsights}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">Overdue Appointments</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">0</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Unread Messages</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-medical-blue" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Patient Satisfaction</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-medical-success h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Appointment Efficiency</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-medical-blue h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI Accuracy</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span>83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-medical-warning h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Today</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>{appointments?.filter(a => {
                    const today = new Date();
                    const appointmentDate = new Date(a.appointmentDate);
                    return appointmentDate.toDateString() === today.toDateString();
                  }).length || 0} appointments scheduled</p>
                  <p>3 new messages</p>
                  <p>2 AI insights generated</p>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">This Week</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>18 appointments completed</p>
                  <p>12 new patients registered</p>
                  <p>8 AI analyses performed</p>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">This Month</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>76 appointments completed</p>
                  <p>45 new patients registered</p>
                  <p>32 AI insights generated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
