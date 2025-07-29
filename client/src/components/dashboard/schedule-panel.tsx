import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { AppointmentWithPatient } from "@/lib/types";
import { Video, Home, FlaskConical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const appointmentIcons = {
  "telehealth": Home,
  "in-person": Video,
  "lab": FlaskConical,
};

const appointmentColors = {
  "telehealth": "bg-medical-warning text-white",
  "in-person": "bg-medical-blue text-white", 
  "lab": "bg-medical-success text-white",
};

export default function SchedulePanel() {
  const { data: appointments, isLoading } = useQuery<AppointmentWithPatient[]>({
    queryKey: ["/api/appointments"],
    queryFn: () => fetch(`/api/appointments?date=${new Date().toISOString().split('T')[0]}`).then(res => res.json()),
  });

  return (
    <Card className="shadow">
      <CardHeader className="pb-4">
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Upcoming appointments and tasks</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map((appointment) => {
              const appointmentTime = new Date(appointment.appointmentDate);
              const timeString = appointmentTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: false 
              });
              
              const Icon = appointmentIcons[appointment.type as keyof typeof appointmentIcons] || Video;
              const colorClass = appointmentColors[appointment.type as keyof typeof appointmentColors] || appointmentColors["in-person"];
              
              return (
                <div key={appointment.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center text-sm font-medium`}>
                      {timeString}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.title}</p>
                    <p className="text-xs text-gray-500">
                      {appointment.type === "telehealth" ? "Telehealth" : appointment.room} • {appointment.duration} min
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Icon className={appointment.type === "telehealth" ? "text-medical-warning" : 
                                   appointment.type === "lab" ? "text-medical-success" : "text-medical-blue"} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full text-center text-sm text-medical-blue hover:text-blue-700 font-medium">
            View Full Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
