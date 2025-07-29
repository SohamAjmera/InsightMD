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
  Plus
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MedicalImageAnalysis {
  findings: string[];
  diagnosis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
}

interface BloodTestAnalysis {
  normalValues: any;
  abnormalValues: any;
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
      return await apiRequest('/api/ai-insights/analyze-blood-test', {
        method: 'POST',
        body: JSON.stringify(data),
      });
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
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Analysis Center</h1>
          <p className="text-gray-600 mt-2">AI-powered analysis of medical images and test results</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          Powered by Gemini AI
        </Badge>
      </div>

      <Tabs defaultValue="image-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-analysis">Medical Imaging</TabsTrigger>
          <TabsTrigger value="blood-test">Blood Test Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="image-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Upload Medical Image</span>
                </CardTitle>
                <CardDescription>
                  Upload X-rays, CT scans, MRI images, or other medical images for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="imageType">Image Type</Label>
                  <Select value={imageType} onValueChange={(value: any) => setImageType(value)}>
                    <SelectTrigger>
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

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileImage className="h-12 w-12 text-green-600 mx-auto" />
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">Drop your medical image here</p>
                      <p className="text-xs text-gray-500">Supports JPEG, PNG up to 10MB</p>
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Select File
                      </Button>
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
                    className="w-full bg-medical-blue hover:bg-blue-700"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Image with AI
                  </Button>
                )}

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Analyzing image...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {(() => {
                      const Icon = getAnalysisIcon();
                      return <Icon className="h-5 w-5" />;
                    })()}
                    <span>Analysis Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {'findings' in analysisResult && (
                    <>
                      <div className="flex items-center justify-between">
                        <Badge className={getRiskLevelColor(analysisResult.riskLevel)}>
                          {analysisResult.riskLevel.toUpperCase()} RISK
                        </Badge>
                        <Badge variant="outline">
                          {analysisResult.confidence}% Confidence
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {analysisResult.diagnosis}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Findings</h4>
                        <ul className="space-y-1">
                          {analysisResult.findings.map((finding, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {analysisResult.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                              <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="blood-test" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blood Test Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Microscope className="h-5 w-5" />
                  <span>Blood Test Values</span>
                </CardTitle>
                <CardDescription>
                  Enter blood test results for AI-powered interpretation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                    <Input
                      id="hemoglobin"
                      type="number"
                      step="0.1"
                      value={bloodTestData.hemoglobin}
                      onChange={(e) => setBloodTestData(prev => ({ ...prev, hemoglobin: e.target.value }))}
                      placeholder="12.0-16.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wbc">White Blood Cells (×10³/μL)</Label>
                    <Input
                      id="wbc"
                      type="number"
                      step="0.1"
                      value={bloodTestData.whiteBloodCells}
                      onChange={(e) => setBloodTestData(prev => ({ ...prev, whiteBloodCells: e.target.value }))}
                      placeholder="4.5-11.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platelets">Platelets (×10³/μL)</Label>
                    <Input
                      id="platelets"
                      type="number"
                      value={bloodTestData.platelets}
                      onChange={(e) => setBloodTestData(prev => ({ ...prev, platelets: e.target.value }))}
                      placeholder="150-450"
                    />
                  </div>
                  <div>
                    <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                    <Input
                      id="glucose"
                      type="number"
                      value={bloodTestData.glucose}
                      onChange={(e) => setBloodTestData(prev => ({ ...prev, glucose: e.target.value }))}
                      placeholder="70-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cholesterol">Total Cholesterol (mg/dL)</Label>
                    <Input
                      id="cholesterol"
                      type="number"
                      value={bloodTestData.cholesterol}
                      onChange={(e) => setBloodTestData(prev => ({ ...prev, cholesterol: e.target.value }))}
                      placeholder="<200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                    <Input
                      id="creatinine"
                      type="number"
                      step="0.01"
                      value={bloodTestData.creatinine}
                      onChange={(e) => setBloodTestData(prev => ({ ...prev, creatinine: e.target.value }))}
                      placeholder="0.6-1.2"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleBloodTestAnalysis}
                  disabled={isAnalyzing}
                  className="w-full bg-medical-blue hover:bg-blue-700"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analyzing..." : "Analyze Blood Test"}
                </Button>
              </CardContent>
            </Card>

            {/* Blood Test Results */}
            {analysisResult && 'interpretation' in analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Blood Test Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {analysisResult.confidence}% Confidence
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Interpretation</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {analysisResult.interpretation}
                    </p>
                  </div>

                  {Object.keys(analysisResult.abnormalValues).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Abnormal Values</h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.abnormalValues).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span className="text-sm font-medium text-red-800">{key}</span>
                            <span className="text-sm text-red-700">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                    <ul className="space-y-1">
                      {analysisResult.riskFactors.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This AI analysis is for educational and research purposes only. 
          Always consult with qualified healthcare professionals for medical diagnosis and treatment decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}