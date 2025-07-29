import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppointmentWithPatient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MessageSquare,
  FileText,
  Settings,
  Users,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Telehealth() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState("00:00");

  const { data: appointments, isLoading } = useQuery<AppointmentWithPatient[]>({
    queryKey: ["/api/appointments"],
    queryFn: () => fetch(`/api/appointments?date=${new Date().toISOString().split('T')[0]}`).then(res => res.json()),
  });

  const telehealthAppointments = appointments?.filter(apt => apt.type === "telehealth") || [];
  const upcomingAppointments = telehealthAppointments.filter(apt => apt.status === "scheduled");

  const handleStartSession = (appointmentId: string) => {
    setActiveSession(appointmentId);
    // Start session timer
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setSessionDuration("00:00");
  };

  const currentAppointment = activeSession 
    ? telehealthAppointments.find(apt => apt.id === activeSession)
    : null;

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Telehealth</h1>
          <p className="mt-1 text-sm text-gray-600">
            Video consultations and remote patient care
          </p>
        </div>

        {activeSession ? (
          /* Active Session View */
          <div className="space-y-6">
            {/* Video Conference Interface */}
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <div className="bg-gray-900 rounded-lg aspect-video relative">
                  {/* Patient video (small window) */}
                  <div className="absolute top-4 left-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-white overflow-hidden z-10">
                    {currentAppointment?.patient?.profileImageUrl ? (
                      <img
                        src={currentAppointment.patient.profileImageUrl}
                        alt={`${currentAppointment.patient.firstName} ${currentAppointment.patient.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-gray-500 text-white text-xl">
                            {currentAppointment?.patient?.firstName?.[0]}{currentAppointment?.patient?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                      Patient
                    </div>
                  </div>
                  
                  {/* Main doctor view */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
                    {isVideoOn ? (
                      <div className="text-center text-white">
                        <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-white">
                          <AvatarImage
                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                            alt="Dr. Sarah Johnson"
                          />
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <p className="text-lg font-medium">Dr. Sarah Johnson</p>
                        <p className="text-sm text-gray-300">Internal Medicine</p>
                      </div>
                    ) : (
                      <div className="text-center text-white">
                        <VideoOff className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg">Video is off</p>
                      </div>
                    )}
                  </div>

                  {/* Control buttons */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <Button
                      size="lg"
                      className={`p-4 rounded-full ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-medical-error hover:bg-red-600'}`}
                      onClick={() => setIsAudioOn(!isAudioOn)}
                    >
                      {isAudioOn ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-white" />}
                    </Button>
                    <Button
                      size="lg"
                      className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-medical-error hover:bg-red-600'}`}
                      onClick={() => setIsVideoOn(!isVideoOn)}
                    >
                      {isVideoOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-white" />}
                    </Button>
                    <Button
                      size="lg"
                      className="p-4 bg-medical-error hover:bg-red-600 rounded-full"
                      onClick={handleEndSession}
                    >
                      <PhoneOff className="h-5 w-5 text-white" />
                    </Button>
                    <Button
                      size="lg"
                      className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full"
                    >
                      <Monitor className="h-5 w-5 text-white" />
                    </Button>
                    <Button
                      size="lg"
                      className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full"
                    >
                      <MessageSquare className="h-5 w-5 text-white" />
                    </Button>
                  </div>

                  {/* Session info */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">{sessionDuration}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Controls and Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentAppointment && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={currentAppointment.patient?.profileImageUrl}
                            alt={`${currentAppointment.patient?.firstName} ${currentAppointment.patient?.lastName}`}
                          />
                          <AvatarFallback>
                            {currentAppointment.patient?.firstName?.[0]}{currentAppointment.patient?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {currentAppointment.patient?.firstName} {currentAppointment.patient?.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">{currentAppointment.title}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-600">Appointment Type</p>
                          <p className="text-sm font-medium">{currentAppointment.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="text-sm font-medium">{currentAppointment.duration} minutes</p>
                        </div>
                        {currentAppointment.description && (
                          <div>
                            <p className="text-sm text-gray-600">Description</p>
                            <p className="text-sm font-medium">{currentAppointment.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Session Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full bg-medical-blue hover:bg-blue-700">
                      <FileText className="h-4 w-4 mr-2" />
                      Take Notes
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Monitor className="h-4 w-4 mr-2" />
                      Share Screen
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Prescribe Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Video Quality</span>
                      <Badge className="bg-green-100 text-green-800">HD</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Audio Quality</span>
                      <Badge className="bg-green-100 text-green-800">Clear</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Connection</span>
                      <Badge className="bg-green-100 text-green-800">Stable</Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Appointment List View */
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Video className="h-8 w-8 text-medical-blue" />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">Today's Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">{telehealthAppointments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-medical-success" />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {telehealthAppointments.filter(apt => apt.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-8 w-8 text-medical-warning" />
                    </div>
                    <div className="ml-5">
                      <p className="text-sm font-medium text-gray-500">Upcoming</p>
                      <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Telehealth Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => {
                      const appointmentTime = new Date(appointment.appointmentDate);
                      const timeString = appointmentTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      });

                      return (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-medical-blue">{timeString}</div>
                              <div className="text-xs text-gray-500">{appointment.duration}min</div>
                            </div>
                            
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={appointment.patient?.profileImageUrl}
                                alt={`${appointment.patient?.firstName} ${appointment.patient?.lastName}`}
                              />
                              <AvatarFallback>
                                {appointment.patient?.firstName?.[0]}{appointment.patient?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <h3 className="font-medium">
                                {appointment.patient?.firstName} {appointment.patient?.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{appointment.title}</p>
                              {appointment.description && (
                                <p className="text-sm text-gray-500">{appointment.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleStartSession(appointment.id)}
                              className="bg-medical-success hover:bg-green-700"
                            >
                              <Video className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                            <Button variant="outline">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">No telehealth appointments today</p>
                    <p className="text-sm text-gray-500">Schedule telehealth consultations with your patients</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
