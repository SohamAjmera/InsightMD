import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DashboardMetrics } from "@/lib/types";
import { Users, Calendar, Brain, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const metrics = [
  {
    name: "Total Patients",
    key: "totalPatients" as keyof DashboardMetrics,
    icon: Users,
    color: "text-medical-blue",
    change: "+12%",
    changeLabel: "from last month",
  },
  {
    name: "Today's Appointments",
    key: "todayAppointments" as keyof DashboardMetrics,
    icon: Calendar,
    color: "text-medical-success",
    change: "6 remaining",
    changeLabel: "",
  },
  {
    name: "AI Analyses",
    key: "aiAnalyses" as keyof DashboardMetrics,
    icon: Brain,
    color: "text-purple-600",
    change: "94% accuracy",
    changeLabel: "",
  },
  {
    name: "High Priority",
    key: "highPriority" as keyof DashboardMetrics,
    icon: AlertTriangle,
    color: "text-medical-warning",
    change: "Requires attention",
    changeLabel: "",
  },
];

export default function MetricsCards() {
  const { data: metricsData, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const value = metricsData?.[metric.key] ?? 0;
        
        return (
          <Card key={metric.name} className="overflow-hidden shadow">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`${metric.color} text-2xl h-8 w-8`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {metric.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${metric.color}`}>
                  {metric.change}
                </span>
                {metric.changeLabel && (
                  <span className="text-gray-600 ml-1">{metric.changeLabel}</span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
