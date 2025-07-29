import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AiInsightWithPatient, Patient, SymptomAnalysisRequest, MedicalAnalysisRequest } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus,
  Search,
  Stethoscope,
  TrendingUp,
  Filter
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { useToast } from "@/hooks/use-toast";

const insightIcons = {
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  info: Brain,
};

const insightColors = {
  warning: {
    border: "border-l-medical-warning",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    icon: "text-medical-warning",
    badge: "bg-yellow-100 text-yellow-800",
  },
  success: {
    border: "border-l-medical-success",
    bg: "bg-green-50",
    text: "text-green-800",
    icon: "text-medical-success",
    badge: "bg-green-100 text-green-800",
  },
  error: {
    border: "border-l-medical-error",
    bg: "bg-red-50",
    text: "text-red-800",
    icon: "text-medical-error",
    badge: "bg-red-100 text-red-800",
  },
  info: {
    border: "border-l-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-800",
    icon: "text-blue-500",
    badge: "bg-blue-100 text-blue-800",
  },
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export default function AIInsights() {
  const [selectedTab, setSelectedTab] = useState<"insights" | "analyzer">("insights");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Symptom analyzer form
  const [symptoms, setSymptoms] = useState<string[]>([""]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [vitalSigns, setVitalSigns] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: insights, isLoading: insightsLoading } = useQuery<AiInsightWithPatient[]>({
    queryKey: ["/api/ai-insights"],
    queryFn: () => fetch("/api/ai-insights").then(res => res.json()),
  });

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const analyzeSymptomsMutation = useMutation({
    mutationFn: async (data: SymptomAnalysisRequest) => {
      const response = await fetch("/api/ai-insights/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to analyze symptoms");
      return response.json();
    },
    onSuccess: (data) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Symptom analysis has been completed successfully.",
      });
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive",
      });
    },
  });

  const analyzeMedicalDataMutation = useMutation({
    mutationFn: async (data: MedicalAnalysisRequest) => {
      const response = await fetch("/api/ai-insights/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to analyze medical data");
      return response.json();
    },
    onSuccess: (data) => {
      setIsAnalyzing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-insights"] });
      toast({
        title: "Medical Analysis Complete",
        description: "New AI insight has been generated and added to the patient's record.",
      });
      // Reset form
      setSymptoms([""]);
      setSelectedPatient("");
      setVitalSigns("");
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze medical data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredInsights = insights?.filter(insight => {
    const matchesSearch = searchQuery === "" || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (insight.patient && `${insight.patient.firstName} ${insight.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = filterPriority === "all" || insight.priority === filterPriority;
    
    return matchesSearch && matchesPriority;
  }) || [];

  const handleAddSymptom = () => {
    setSymptoms([...symptoms, ""]);
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSymptomChange = (index: number, value: string) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const handleAnalyzeSymptoms = () => {
    const validSymptoms = symptoms.filter(s => s.trim() !== "");
    if (validSymptoms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter at least one symptom.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    analyzeSymptomsMutation.mutate({
      symptoms: validSymptoms,
    });
  };

  const handleAnalyzeMedicalData = () => {
    const validSymptoms = symptoms.filter(s => s.trim() !== "");
    if (validSymptoms.length === 0 || !selectedPatient) {
      toast({
        title: "Missing Information",
        description: "Please select a patient and enter at least one symptom.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const analysisData: MedicalAnalysisRequest = {
      patientId: selectedPatient,
      symptoms: validSymptoms,
    };

    if (vitalSigns.trim()) {
      try {
        analysisData.vitalSigns = JSON.parse(vitalSigns);
      } catch (e) {
        // If not valid JSON, treat as text
        analysisData.vitalSigns = { notes: vitalSigns };
      }
    }

    analyzeMedicalDataMutation.mutate(analysisData);
  };

  return (
    <>
      <LoadingOverlay isVisible={isAnalyzing} />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <p className="mt-1 text-sm text-gray-600">
              AI-powered medical analysis and symptom assessment
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setSelectedTab("insights")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "insights"
                      ? "border-medical-blue text-medical-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Brain className="h-4 w-4 inline mr-2" />
                  Generated Insights
                </button>
                <button
                  onClick={() => setSelectedTab("analyzer")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "analyzer"
                      ? "border-medical-blue text-medical-blue"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Stethoscope className="h-4 w-4 inline mr-2" />
                  Symptom Analyzer
                </button>
              </nav>
            </div>
          </div>

          {selectedTab === "insights" ? (
            /* Insights View */
            <div className="space-y-6">
              {/* Filters and Search */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search insights..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Brain className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Insights</p>
                        <p className="text-2xl font-bold text-gray-900">{insights?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-8 w-8 text-medical-warning" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">High Priority</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {insights?.filter(i => i.priority === "high" || i.priority === "urgent").length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-medical-success" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Avg Confidence</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {insights?.length ? Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length) : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-medical-success" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Reviewed</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {insights?.filter(i => i.status === "reviewed").length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights List */}
              {insightsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInsights.map((insight) => {
                    const Icon = insightIcons[insight.type as keyof typeof insightIcons];
                    const colors = insightColors[insight.type as keyof typeof insightColors];
                    const timeDiff = Math.floor((Date.now() - new Date(insight.createdAt).getTime()) / (60 * 60 * 1000));
                    
                    return (
                      <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className={`border-l-4 ${colors.border} ${colors.bg} p-4 rounded-r-lg`}>
                            <div className="flex items-start justify-between">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <Icon className={`h-6 w-6 ${colors.icon}`} />
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className={`text-lg font-medium ${colors.text}`}>
                                      {insight.title}
                                    </h3>
                                    <Badge className={priorityColors[insight.priority as keyof typeof priorityColors]}>
                                      {insight.priority.toUpperCase()}
                                    </Badge>
                                  </div>
                                  
                                  <p className={`text-sm ${colors.text.replace('800', '700')} mb-3`}>
                                    {insight.description}
                                  </p>

                                  {insight.patient && (
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage
                                          src={insight.patient.profileImageUrl}
                                          alt={`${insight.patient.firstName} ${insight.patient.lastName}`}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {insight.patient.firstName[0]}{insight.patient.lastName[0]}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-600">
                                        {insight.patient.firstName} {insight.patient.lastName}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                                    <span>Confidence: {insight.confidence}%</span>
                                    <span>•</span>
                                    <span>Generated {timeDiff}h ago</span>
                                    <span>•</span>
                                    <Badge variant="outline" className={colors.badge}>
                                      {insight.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  Review
                                </Button>
                                <Button size="sm" variant="outline">
                                  Share
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {!insightsLoading && filteredInsights.length === 0 && (
                <div className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium text-gray-900">No insights found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            /* Symptom Analyzer View */
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2 text-medical-blue" />
                    Symptom Analyzer
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Analyze symptoms using AI-powered medical insights. Results are for informational purposes only.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Patient (Optional for general analysis)
                    </label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">General Analysis (No specific patient)</SelectItem>
                        {patients?.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Symptoms Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms *
                    </label>
                    <div className="space-y-2">
                      {symptoms.map((symptom, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={symptom}
                            onChange={(e) => handleSymptomChange(index, e.target.value)}
                            placeholder={`Symptom ${index + 1}...`}
                            className="flex-1"
                          />
                          {symptoms.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveSymptom(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddSymptom}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Symptom
                      </Button>
                    </div>
                  </div>

                  {/* Vital Signs (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vital Signs & Additional Information (Optional)
                    </label>
                    <Textarea
                      value={vitalSigns}
                      onChange={(e) => setVitalSigns(e.target.value)}
                      placeholder="Enter vital signs, measurements, or additional clinical information..."
                      rows={4}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can enter JSON format or free text (e.g., "BP: 140/90, HR: 88, Temp: 99.2°F")
                    </p>
                  </div>

                  {/* Analysis Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={selectedPatient ? handleAnalyzeMedicalData : handleAnalyzeSymptoms}
                      disabled={isAnalyzing || symptoms.filter(s => s.trim()).length === 0}
                      className="bg-medical-blue hover:bg-blue-700"
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      {selectedPatient ? "Generate Patient Insight" : "Analyze Symptoms"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSymptoms([""]);
                        setSelectedPatient("");
                        setVitalSigns("");
                      }}
                    >
                      Clear Form
                    </Button>
                  </div>

                  {/* Analysis Results */}
                  {analyzeSymptomsMutation.data && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Analysis Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Possible Conditions</h4>
                            <div className="flex flex-wrap gap-2">
                              {analyzeSymptomsMutation.data.possibleConditions.map((condition: string, index: number) => (
                                <Badge key={index} variant="outline">{condition}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Urgency Level</h4>
                            <Badge className={
                              analyzeSymptomsMutation.data.urgencyLevel === "urgent" ? "bg-red-100 text-red-800" :
                              analyzeSymptomsMutation.data.urgencyLevel === "high" ? "bg-orange-100 text-orange-800" :
                              analyzeSymptomsMutation.data.urgencyLevel === "medium" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"
                            }>
                              {analyzeSymptomsMutation.data.urgencyLevel.toUpperCase()}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              {analyzeSymptomsMutation.data.recommendedActions.map((action: string, index: number) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Confidence</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-medical-blue h-2 rounded-full" 
                                  style={{ width: `${analyzeSymptomsMutation.data.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{analyzeSymptomsMutation.data.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Medical Disclaimer</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        This AI analysis is for informational purposes only and should not replace professional medical advice, 
                        diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
