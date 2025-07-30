import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  Upload,
  FileImage,
  Camera,
  Eye,
  Brain,
  AlertTriangle,
  CheckCircle,
  Microscope,
  Heart,
  Activity,
  Target,
  Download,
  Share,
  X,
  Plus,
  Sparkles,
  Zap,
  Lock,
  Shield,
  FileText,
  Image as ImageIcon,
  File,
  ArrowRight,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Medical3DViewer from "@/components/3d-visualization/medical-3d-viewer";

interface MedicalImageAnalysis {
  findings: string[];
  diagnosis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
}

interface BloodTestAnalysis {
  normalValues: Record<string, any>;
  abnormalValues: Record<string, any>;
  interpretation: string;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}

export default function MedicalUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState<'xray' | 'ct' | 'mri' | 'blood_test'>('xray');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<MedicalImageAnalysis | BloodTestAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bloodTestData, setBloodTestData] = useState({
    hemoglobin: '',
    whiteBloodCells: '',
    platelets: '',
    glucose: '',
    cholesterol: '',
    creatinine: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const imageAnalysisMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/ai-insights/analyze-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Medical image analysis has been completed successfully.",
      });
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the medical image.",
        variant: "destructive",
      });
    },
  });

  const bloodTestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/ai-insights/analyze-blood-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Blood test analysis failed');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data);
      setIsAnalyzing(false);
      toast({
        title: "Blood Test Analysis Complete",
        description: "AI analysis of blood test results completed.",
      });
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Error analyzing blood test results.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setAnalysisResult(null);
    }
  };

  const handleImageAnalysis = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('imageType', imageType);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    imageAnalysisMutation.mutate(formData);
  };

  const handleBloodTestAnalysis = () => {
    setIsAnalyzing(true);
    bloodTestMutation.mutate(bloodTestData);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAnalysisIcon = () => {
    switch (imageType) {
      case 'xray': return Eye;
      case 'ct': case 'mri': return Brain;
      case 'blood_test': return Microscope;
      default: return Activity;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-10 px-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Medical Analysis Center
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered analysis of medical images and test results with advanced insights
          </p>
          <Badge className="mt-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Powered by Gemini AI
          </Badge>
        </div>

        <Tabs defaultValue="image-analysis" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-1">
            <TabsTrigger value="image-analysis" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Camera className="h-4 w-4 mr-2" />
              Medical Imaging
            </TabsTrigger>
            <TabsTrigger value="blood-test" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <Microscope className="h-4 w-4 mr-2" />
              Blood Test Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image-analysis" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <span>Upload Medical Image</span>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Upload X-rays, CT scans, MRI images, or other medical images for AI analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="imageType" className="text-sm font-medium text-gray-700 mb-2 block">Image Type</Label>
                      <Select value={imageType} onValueChange={(value: any) => setImageType(value)}>
                        <SelectTrigger className="bg-white/50 border-gray-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xray">X-Ray</SelectItem>
                          <SelectItem value="ct">CT Scan</SelectItem>
                          <SelectItem value="mri">MRI</SelectItem>
                          <SelectItem value="blood_test">Blood Test Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200/50">
                        <Shield className="h-4 w-4 mr-1" />
                        Secure Upload
                      </Badge>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gradient-to-br from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-all duration-200">
                    {selectedFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto">
                          <FileImage className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                          className="rounded-xl border-gray-300 hover:border-gray-400"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900 mb-2">Drop your medical image here</p>
                          <p className="text-sm text-gray-500 mb-4">Supports JPEG, PNG up to 10MB</p>
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/70 backdrop-blur-sm border-gray-300 hover:border-gray-400 rounded-xl"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Select File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile && !isAnalyzing && (
                    <Button
                      onClick={handleImageAnalysis}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Brain className="h-5 w-5 mr-3" />
                      Analyze Image with AI
                    </Button>
                  )}

                  {isAnalyzing && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Analyzing image...</span>
                        <span className="font-semibold text-gray-900">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2 rounded-full" />
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></Loader2>
                        AI processing in progress...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              {analysisResult && (
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      {(() => {
                        const Icon = getAnalysisIcon();
                        return (
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        );
                      })()}
                      <span>Analysis Results</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {'findings' in analysisResult && (
                      <>
                        <div className="flex items-center justify-between">
                          <Badge className={`${getRiskLevelColor(analysisResult.riskLevel)} px-4 py-2 rounded-full border`}>
                            {analysisResult.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <Badge variant="outline" className="px-4 py-2 rounded-full">
                            {analysisResult.confidence}% Confidence
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Target className="h-5 w-5 mr-2 text-blue-600" />
                              Diagnosis
                            </h4>
                            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-200">
                              {analysisResult.diagnosis}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Eye className="h-5 w-5 mr-2 text-green-600" />
                              Key Findings
                            </h4>
                            <ul className="space-y-2">
                              {analysisResult.findings.map((finding, index) => (
                                <li key={index} className="text-gray-700 flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{finding}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Heart className="h-5 w-5 mr-2 text-purple-600" />
                              Recommendations
                            </h4>
                            <ul className="space-y-2">
                              {analysisResult.recommendations.map((rec, index) => (
                                <li key={index} className="text-gray-700 flex items-start space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                  <Target className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex space-x-3 pt-6 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                        <Share className="h-4 w-4 mr-2" />
                        Share Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blood-test" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Blood Test Input */}
              <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Microscope className="h-6 w-6 text-white" />
                    </div>
                    <span>Blood Test Values</span>
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Enter blood test results for AI-powered interpretation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hemoglobin" className="text-sm font-medium text-gray-700 mb-2 block">Hemoglobin (g/dL)</Label>
                      <Input
                        id="hemoglobin"
                        type="number"
                        step="0.1"
                        value={bloodTestData.hemoglobin}
                        onChange={(e) => setBloodTestData(prev => ({ ...prev, hemoglobin: e.target.value }))}
                        placeholder="12.0-16.0"
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wbc" className="text-sm font-medium text-gray-700 mb-2 block">White Blood Cells (×10³/μL)</Label>
                      <Input
                        id="wbc"
                        type="number"
                        step="0.1"
                        value={bloodTestData.whiteBloodCells}
                        onChange={(e) => setBloodTestData(prev => ({ ...prev, whiteBloodCells: e.target.value }))}
                        placeholder="4.5-11.0"
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="platelets" className="text-sm font-medium text-gray-700 mb-2 block">Platelets (×10³/μL)</Label>
                      <Input
                        id="platelets"
                        type="number"
                        value={bloodTestData.platelets}
                        onChange={(e) => setBloodTestData(prev => ({ ...prev, platelets: e.target.value }))}
                        placeholder="150-450"
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="glucose" className="text-sm font-medium text-gray-700 mb-2 block">Glucose (mg/dL)</Label>
                      <Input
                        id="glucose"
                        type="number"
                        value={bloodTestData.glucose}
                        onChange={(e) => setBloodTestData(prev => ({ ...prev, glucose: e.target.value }))}
                        placeholder="70-100"
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cholesterol" className="text-sm font-medium text-gray-700 mb-2 block">Total Cholesterol (mg/dL)</Label>
                      <Input
                        id="cholesterol"
                        type="number"
                        value={bloodTestData.cholesterol}
                        onChange={(e) => setBloodTestData(prev => ({ ...prev, cholesterol: e.target.value }))}
                        placeholder="<200"
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="creatinine" className="text-sm font-medium text-gray-700 mb-2 block">Creatinine (mg/dL)</Label>
                      <Input
                        id="creatinine"
                        type="number"
                        step="0.01"
                        value={bloodTestData.creatinine}
                        onChange={(e) => setBloodTestData(prev => ({ ...prev, creatinine: e.target.value }))}
                        placeholder="0.6-1.2"
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleBloodTestAnalysis}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Brain className="h-5 w-5 mr-3" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Blood Test"}
                  </Button>
                </CardContent>
              </Card>

              {/* Blood Test Results */}
              {analysisResult && 'interpretation' in analysisResult && (
                <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                      <span>Blood Test Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="px-4 py-2 rounded-full">
                        {analysisResult.confidence}% Confidence
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          Interpretation
                        </h4>
                        <p className="text-gray-700 bg-blue-50 p-4 rounded-xl border border-blue-200">
                          {analysisResult.interpretation}
                        </p>
                      </div>

                      {Object.keys(analysisResult.abnormalValues).length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                            Abnormal Values
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(analysisResult.abnormalValues).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                                <span className="text-sm font-medium text-red-800">{key}</span>
                                <span className="text-sm text-red-700">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                          Risk Factors
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.riskFactors.map((risk, index) => (
                            <li key={index} className="text-gray-700 flex items-start space-x-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Heart className="h-5 w-5 mr-2 text-green-600" />
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700 flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* 3D Visualization Section */}
        {analysisResult && imageType !== 'blood_test' && (
          <div className="mt-12">
            <Medical3DViewer 
              scanData={{
                type: imageType as 'xray' | 'ct' | 'mri',
                region: 'medical-scan',
                resolution: 'high-definition'
              }}
              onDownload={() => {
                toast({
                  title: "3D Model Download",
                  description: "3D visualization model download started.",
                });
              }}
            />
          </div>
        )}

        <Alert className="bg-white/70 backdrop-blur-sm border border-orange-200/50 shadow-xl rounded-2xl">
          <Brain className="h-5 w-5 text-orange-500" />
          <AlertDescription className="text-gray-700">
            <strong>Important:</strong> This AI analysis is for educational and research purposes only. 
            Always consult with qualified healthcare professionals for medical diagnosis and treatment decisions.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}