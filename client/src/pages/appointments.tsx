import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppointmentWithPatient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarPlus, Video, Home, Clock, MapPin, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const typeIcons = {
  telehealth: Home,
  "in-person": MapPin,
};

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { data: appointments, isLoading } = useQuery<AppointmentWithPatient[]>({
    queryKey: ["/api/appointments", selectedDate],
    queryFn: () => fetch(`/api/appointments?date=${selectedDate}`).then(res => res.json()),
  });

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your appointment schedule
            </p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-medical-blue"
          />
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {appointments?.map((appointment) => {
              const appointmentTime = new Date(appointment.appointmentDate);
              const timeString = appointmentTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              });
              
              const Icon = typeIcons[appointment.type as keyof typeof typeIcons] || MapPin;
              
              return (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Time */}
                        <div className="flex flex-col items-center">
                          <div className="text-lg font-semibold text-medical-blue">
                            {timeString}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appointment.duration}min
                          </div>
                        </div>

                        {/* Patient Info */}
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={appointment.patient?.profileImageUrl || undefined}
                              alt={appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : "Patient"}
                            />
                            <AvatarFallback>
                              {appointment.patient?.firstName?.[0]}{appointment.patient?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {appointment.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : "Unknown Patient"}
                            </h3>
                            <p className="text-sm text-gray-600">{appointment.title}</p>
                            {appointment.description && (
                              <p className="text-sm text-gray-500">{appointment.description}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Type and Location */}
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 capitalize">
                              {appointment.type}
                            </span>
                          </div>
                          {appointment.room && (
                            <p className="text-sm text-gray-500">{appointment.room}</p>
                          )}
                        </div>

                        {/* Status */}
                        <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                          {appointment.status}
                        </Badge>

                        {/* Actions */}
                        <div className="flex space-x-2">
                          {appointment.type === "telehealth" && appointment.status === "scheduled" && (
                            <Button size="sm" className="bg-medical-success hover:bg-green-700">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <User className="h-4 w-4 mr-1" />
                            View Patient
                          </Button>
                        </div>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isLoading && appointments?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">No appointments scheduled</p>
              <p className="text-sm">for {new Date(selectedDate).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
