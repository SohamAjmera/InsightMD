import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Microscope,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BloodTestChart from "@/components/charts/blood-test-chart";

interface BloodTestUploadProps {
  onUpload: (file: File) => void;
}

export default function BloodTestUpload({ onUpload }: BloodTestUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF files only for blood test reports.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit for PDFs)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload PDF files smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setUploadProgress(0);
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          startProcessing(file);
          return 100;
        }
        return prev + 15;
      });
    }, 300);

    onUpload(file);
  };

  const startProcessing = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Simulate OCR and data extraction
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Mock extracted blood test data
      const mockExtractedData = {
        patientName: "John Doe",
        testDate: "2024-01-15",
        labName: "Central Medical Lab",
        values: {
          hemoglobin: { value: 14.2, unit: "g/dL", normal: "12.0-16.0", status: "normal" },
          whiteBloodCells: { value: 7.8, unit: "×10³/μL", normal: "4.5-11.0", status: "normal" },
          platelets: { value: 285, unit: "×10³/μL", normal: "150-450", status: "normal" },
          glucose: { value: 95, unit: "mg/dL", normal: "70-100", status: "normal" },
          cholesterol: { value: 220, unit: "mg/dL", normal: "<200", status: "high" },
          hdl: { value: 45, unit: "mg/dL", normal: ">40", status: "normal" },
          ldl: { value: 145, unit: "mg/dL", normal: "<100", status: "high" },
          triglycerides: { value: 180, unit: "mg/dL", normal: "<150", status: "high" },
          creatinine: { value: 1.0, unit: "mg/dL", normal: "0.6-1.2", status: "normal" },
          bun: { value: 18, unit: "mg/dL", normal: "7-20", status: "normal" }
        }
      };
      
      setExtractedData(mockExtractedData);
      
      // Generate AI analysis
      const mockAnalysis = {
        overallAssessment: "Generally healthy with some areas for improvement",
        abnormalValues: ["cholesterol", "ldl", "triglycerides"],
        riskFactors: [
          "Elevated cholesterol levels may increase cardiovascular risk",
          "LDL cholesterol above optimal range",
          "Triglycerides slightly elevated"
        ],
        recommendations: [
          "Consider dietary modifications to reduce cholesterol",
          "Increase physical activity",
          "Follow up with healthcare provider",
          "Consider lipid-lowering medication if lifestyle changes insufficient"
        ],
        confidence: 92
      };
      
      setAnalysisResult(mockAnalysis);
      
      toast({
        title: "Processing Complete",
        description: "Blood test data extracted and analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "There was an error processing your blood test report.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setExtractedData(null);
    setAnalysisResult(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-yellow-400" />;
      default:
        return <Minus className="h-4 w-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'low':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Microscope className="h-5 w-5 text-purple-400" />
          <span>Blood Test Analysis</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Upload blood test PDF reports for AI-powered analysis and insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <motion.div
            className={`upload-area ${dragActive ? 'border-purple-500/50 bg-purple-500/5' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <FileText className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload Blood Test Report
              </h3>
              <p className="text-gray-400 mb-4">
                Drop your PDF blood test report here
              </p>
              <Badge variant="outline" className="text-gray-400 border-gray-600 mb-4">
                PDF Only
              </Badge>
              <p className="text-xs text-gray-500">
                Maximum file size: 5MB
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="medical-icon bg-gradient-to-br from-purple-500 to-pink-500">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{uploadedFile.name}</h4>
                  <p className="text-sm text-gray-400">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                onClick={removeFile}
                size="sm"
                variant="outline"
                className="text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Upload Progress */}
            {uploadProgress < 100 && (
              <div className="upload-progress">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Processing Progress */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="upload-progress"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="loading-spinner w-5 h-5"></div>
                  <span className="text-white font-medium">Processing Blood Test Report...</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>PDF uploaded successfully</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>Extracting text with OCR...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>Parsing blood test values...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-gray-600 rounded-full"></div>
                    <span>Generating AI insights...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Extracted Data */}
            {extractedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Report Info */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <h3 className="font-semibold text-white mb-2">Report Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Patient:</span>
                      <span className="text-white ml-2">{extractedData.patientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Test Date:</span>
                      <span className="text-white ml-2">{extractedData.testDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Lab:</span>
                      <span className="text-white ml-2">{extractedData.labName}</span>
                    </div>
                  </div>
                </div>

                {/* Blood Test Values */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <h3 className="font-semibold text-white mb-4">Blood Test Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(extractedData.values).map(([key, data]: [string, any]) => (
                      <div key={key} className={`p-3 rounded-lg border ${getStatusColor(data.status)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                            <div className="text-sm opacity-80">
                              Normal: {data.normal}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(data.status)}
                              <span className="font-bold">
                                {data.value} {data.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Visualization */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <h3 className="font-semibold text-white mb-4">Visual Analysis</h3>
                  <BloodTestChart data={extractedData.values} />
                </div>

                {/* AI Analysis */}
                {analysisResult && (
                  <div className="ai-insight">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
                      <div className="ai-confidence">
                        <span className="text-purple-400">{analysisResult.confidence}% Confidence</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-300 mb-2">Overall Assessment</h4>
                        <p className="text-gray-300 bg-gray-800/50 rounded-lg p-3">
                          {analysisResult.overallAssessment}
                        </p>
                      </div>

                      {analysisResult.abnormalValues.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-2">Values Requiring Attention</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.abnormalValues.map((value: string) => (
                              <Badge key={value} className="status-warning">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {value.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-gray-300 mb-2">Risk Factors</h4>
                        <ul className="space-y-2">
                          {analysisResult.riskFactors.map((risk: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2 text-gray-300">
                              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-300 mb-2">Recommendations</h4>
                        <ul className="space-y-2">
                          {analysisResult.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="ai-recommendation">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-3 pt-4 border-t border-gray-700/30">
                        <Button className="btn-primary">
                          <Brain className="h-4 w-4 mr-2" />
                          Ask AI Questions
                        </Button>
                        <Button variant="outline" className="btn-secondary">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button variant="outline" className="btn-secondary">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Trends
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}