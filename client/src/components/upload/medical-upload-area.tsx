import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Zap,
  Eye,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MedicalUploadAreaProps {
  onUpload: (file: File) => void;
}

export default function MedicalUploadArea({ onUpload }: MedicalUploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload JPEG, PNG, GIF, or PDF files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload files smaller than 10MB.",
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
          startAnalysis(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    onUpload(file);
  };

  const startAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis result
      const mockResult = {
        type: file.type.includes('image') ? 'Medical Image' : 'Medical Document',
        findings: [
          'Normal anatomical structures observed',
          'No acute abnormalities detected',
          'Recommend follow-up in 6 months'
        ],
        confidence: 94,
        riskLevel: 'Low',
        recommendations: [
          'Continue current treatment plan',
          'Maintain healthy lifestyle',
          'Schedule routine follow-up'
        ]
      };
      
      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete",
        description: "AI analysis has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your file.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <FileImage className="h-5 w-5 text-blue-400" />
          <span>Medical Image Upload</span>
        </CardTitle>
        <CardDescription className="text-gray-400">
          Upload X-rays, MRI, CT scans, or medical documents for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploadedFile ? (
          <motion.div
            className={`upload-area ${dragActive ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
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
                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Upload className="h-8 w-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Drop your medical files here
              </h3>
              <p className="text-gray-400 mb-4">
                or click to browse files
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  JPEG
                </Badge>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  PNG
                </Badge>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  PDF
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                Maximum file size: 10MB
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="medical-icon">
                  <FileImage className="h-6 w-6" />
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

            {/* Analysis Progress */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="upload-progress"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="loading-spinner w-5 h-5"></div>
                  <span className="text-white font-medium">AI Analysis in Progress...</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>File uploaded successfully</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="loading-spinner w-4 h-4"></div>
                    <span>Processing with Gemini AI...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-gray-600 rounded-full"></div>
                    <span>Generating insights...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analysis Results */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="ai-insight"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">AI Analysis Results</h3>
                  <div className="ai-confidence">
                    <span className="text-purple-400">{analysisResult.confidence}% Confidence</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Key Findings</h4>
                    <ul className="space-y-2">
                      {analysisResult.findings.map((finding: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Risk Assessment</h4>
                    <Badge className={`status-${analysisResult.riskLevel.toLowerCase()}`}>
                      {analysisResult.riskLevel} Risk
                    </Badge>
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
                      <Eye className="h-4 w-4 mr-2" />
                      View 3D Model
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}