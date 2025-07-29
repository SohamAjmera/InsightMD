import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { AiInsightWithPatient } from "@/lib/types";
import { AlertTriangle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const insightIcons = {
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  info: AlertTriangle,
};

const insightColors = {
  warning: {
    border: "border-medical-warning",
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    icon: "text-medical-warning",
    confidence: "text-yellow-600",
  },
  success: {
    border: "border-medical-success",
    bg: "bg-green-50",
    text: "text-green-800",
    icon: "text-medical-success",
    confidence: "text-green-600",
  },
  error: {
    border: "border-medical-error",
    bg: "bg-red-50",
    text: "text-red-800",
    icon: "text-medical-error",
    confidence: "text-red-600",
  },
  info: {
    border: "border-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-800",
    icon: "text-blue-500",
    confidence: "text-blue-600",
  },
};

export default function AIInsightsPanel() {
  const { data: insights, isLoading } = useQuery<AiInsightWithPatient[]>({
    queryKey: ["/api/ai-insights"],
    queryFn: () => fetch("/api/ai-insights?limit=3").then(res => res.json()),
  });

  return (
    <Card className="shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent AI Insights</CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Powered by Gemini AI
          </Badge>
        </div>
        <CardDescription>AI-generated medical insights and risk assessments</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights?.map((insight) => {
              const Icon = insightIcons[insight.type as keyof typeof insightIcons];
              const colors = insightColors[insight.type as keyof typeof insightColors];
              const timeDiff = Math.floor((Date.now() - (insight.createdAt ? new Date(insight.createdAt).getTime() : Date.now())) / (60 * 60 * 1000));
              
              return (
                <div key={insight.id} className={`border-l-4 ${colors.border} ${colors.bg} p-4 rounded-r-lg`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Icon className={`h-5 w-5 ${colors.icon}`} />
                    </div>
                    <div className="ml-3">
                      <h4 className={`text-sm font-medium ${colors.text}`}>{insight.title}</h4>
                      <p className={`mt-1 text-sm ${colors.text.replace('800', '700')}`}>
                        {insight.description}
                      </p>
                      {insight.patient && (
                        <p className="mt-1 text-xs text-gray-600">
                          Patient: {insight.patient.firstName} {insight.patient.lastName}
                        </p>
                      )}
                      <p className={`mt-2 text-xs ${colors.confidence}`}>
                        Confidence: {insight.confidence}% • Generated {timeDiff} hours ago
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button variant="outline" className="inline-flex items-center">
            View All Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
