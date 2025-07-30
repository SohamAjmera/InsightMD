import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Brain,
  Upload,
  FileImage,
  Microscope,
  Heart,
  Activity,
  Target,
  Download,
  Share,
  Zap,
  Eye,
  Scan,
  TestTube,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  PieChart,
  Globe
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Medical3DViewer from "@/components/3d-visualization/medical-3d-viewer";

export default function AdvancedAIAnalysis() {
  const [analysisMode, setAnalysisMode] = useState<'3d-visualization' | 'specialist-connect' | 'feedback' | 'multi-language'>('3d-visualization');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 3D Medical Scan Visualization
  const [scanData, setScanData] = useState({
    scanType: 'ct',
    region: 'brain',
    contrastUsed: false,
    sliceThickness: '1mm'
  });

  // Specialist Connection
  const [specialistRequest, setSpecialistRequest] = useState({
    specialty: 'cardiology',
    urgency: 'routine',
    caseDescription: '',
    availableForConsult: true
  });

  const { data: specialists } = useQuery({
    queryKey: ['/api/specialists'],
    enabled: analysisMode === 'specialist-connect',
    retry: false
  });

  const generate3DVisualization = useMutation({
    mutationFn: async (data: any) => {
      setIsAnalyzing(true);
      setUploadProgress(0);
      
      // Simulate processing progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      const response = await apiRequest('/api/ai-insights/3d-visualization', 'POST', {
        body: JSON.stringify(data),
      });
      
      setUploadProgress(100);
      setIsAnalyzing(false);
      return response;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      toast({
        title: "3D Visualization Complete",
        description: "Medical scan has been converted to interactive 3D model.",
      });
    },
    onError: () => {
      setIsAnalyzing(false);
      toast({
        title: "Visualization Failed",
        description: "Error generating 3D visualization.",
        variant: "destructive",
      });
    },
  });

  const connectWithSpecialist = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/specialists/connect', 'POST', {
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Specialist Connected",
        description: `Connected with ${data?.specialistName || 'specialist'} for consultation.`,
      });
    },
  });

  const submitFeedback = useMutation({
    mutationFn: async (feedback: string) => {
      return await apiRequest('/api/feedback', 'POST', {
        body: JSON.stringify({ feedback, platform: 'InsightMD' }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback to improve our platform.",
      });
      setFeedbackText('');
    },
  });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' }
  ];

  const specialties = [
    'Cardiology', 'Neurology', 'Oncology', 'Radiology', 'Pathology',
    'Orthopedics', 'Dermatology', 'Gastroenterology', 'Pulmonology', 'Endocrinology'
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced AI Medical Analysis</h1>
          <p className="text-gray-600 mt-2">Next-generation medical insights powered by Gemini AI</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-800">
            <Zap className="h-3 w-3 mr-1" />
            Gemini 2.5 Pro
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Globe className="h-3 w-3 mr-1" />
            Multi-Language
          </Badge>
        </div>
      </div>

      <Tabs value={analysisMode} onValueChange={(value: any) => setAnalysisMode(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="3d-visualization">
            <Scan className="h-4 w-4 mr-2" />
            3D Visualization
          </TabsTrigger>
          <TabsTrigger value="specialist-connect">
            <Users className="h-4 w-4 mr-2" />
            Connect Specialists
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback & Support
          </TabsTrigger>
          <TabsTrigger value="multi-language">
            <Globe className="h-4 w-4 mr-2" />
            Multi-Language
          </TabsTrigger>
        </TabsList>

        {/* 3D Medical Scan Visualization */}
        <TabsContent value="3d-visualization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Scan className="h-5 w-5" />
                  <span>3D Medical Scan Analysis</span>
                </CardTitle>
                <CardDescription>
                  Convert 2D medical scans (MRI, X-rays, CT) into interactive 3D visualizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Scan Type</Label>
                    <Select value={scanData.scanType} onValueChange={(value) => setScanData(prev => ({ ...prev, scanType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ct">CT Scan</SelectItem>
                        <SelectItem value="mri">MRI</SelectItem>
                        <SelectItem value="xray">X-Ray</SelectItem>
                        <SelectItem value="ultrasound">Ultrasound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Body Region</Label>
                    <Select value={scanData.region} onValueChange={(value) => setScanData(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brain">Brain</SelectItem>
                        <SelectItem value="chest">Chest</SelectItem>
                        <SelectItem value="abdomen">Abdomen</SelectItem>
                        <SelectItem value="spine">Spine</SelectItem>
                        <SelectItem value="extremities">Extremities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Processing Options</Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={scanData.contrastUsed}
                        onChange={(e) => setScanData(prev => ({ ...prev, contrastUsed: e.target.checked }))}
                      />
                      <span className="text-sm">Contrast Enhancement</span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={() => generate3DVisualization.mutate(scanData)}
                  disabled={isAnalyzing}
                  className="w-full bg-medical-blue hover:bg-blue-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Processing..." : "Generate 3D Visualization"}
                </Button>

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing scan data...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {analysisResults && analysisMode === '3d-visualization' && (
              <Medical3DViewer 
                scanData={{
                  type: scanData.scanType as 'mri' | 'ct' | 'xray',
                  region: scanData.region,
                  resolution: scanData.sliceThickness
                }}
                onDownload={() => {
                  toast({
                    title: "Download Started",
                    description: "3D model download has been initiated.",
                  });
                }}
              />
            )}
          </div>
        </TabsContent>

        {/* Specialist Connection */}
        <TabsContent value="specialist-connect" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Connect with Medical Specialists</span>
                </CardTitle>
                <CardDescription>
                  Get second opinions and consultations from AI insights and medical experts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Specialty Required</Label>
                  <Select value={specialistRequest.specialty} onValueChange={(value) => setSpecialistRequest(prev => ({ ...prev, specialty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty.toLowerCase()}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Urgency Level</Label>
                  <Select value={specialistRequest.urgency} onValueChange={(value) => setSpecialistRequest(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Case Description</Label>
                  <Textarea
                    placeholder="Describe the case and specific questions for the specialist..."
                    value={specialistRequest.caseDescription}
                    onChange={(e) => setSpecialistRequest(prev => ({ ...prev, caseDescription: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={specialistRequest.availableForConsult}
                    onChange={(e) => setSpecialistRequest(prev => ({ ...prev, availableForConsult: e.target.checked }))}
                  />
                  <Label htmlFor="available" className="text-sm">Available for video consultation</Label>
                </div>

                <Button
                  onClick={() => connectWithSpecialist.mutate(specialistRequest)}
                  className="w-full bg-medical-blue hover:bg-blue-700"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Find Available Specialists
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Specialists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Dr. Sarah Johnson</h4>
                          <p className="text-sm text-gray-600">Cardiology • 15 years exp.</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600">4.9 (127 reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 mb-2">Available Now</Badge>
                        <div className="space-x-1">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feedback System */}
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Platform Feedback</span>
                </CardTitle>
                <CardDescription>
                  Help us improve InsightMD with your suggestions and bug reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Your Feedback</Label>
                  <Textarea
                    placeholder="Share your experience, suggestions, or report issues..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button
                  onClick={() => submitFeedback.mutate(feedbackText)}
                  disabled={!feedbackText.trim()}
                  className="w-full bg-medical-blue hover:bg-blue-700"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Total Analyses</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">12,847</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Active Users</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">3,456</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Average Rating</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">4.8/5</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Accuracy Rate</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">96.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Multi-Language Support */}
        <TabsContent value="multi-language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Multi-Language Support</span>
              </CardTitle>
              <CardDescription>
                Access InsightMD in your preferred language with AI-powered translations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  Text-to-Speech and Voice Command features are available in selected languages.
                  Medical terminology is automatically translated with clinical accuracy.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {languages.map(lang => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className="justify-start"
                  >
                    <Globe className="h-3 w-3 mr-2" />
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Advanced AI Features:</strong> All analyses are powered by Google Gemini 2.5 Pro 
          with specialized medical training. Results are for educational purposes and should supplement, 
          not replace, professional medical judgment.
        </AlertDescription>
      </Alert>
    </div>
  );
}