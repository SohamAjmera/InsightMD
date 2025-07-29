import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mic, Video, PhoneOff, Monitor } from "lucide-react";

export default function TelehealthPreview() {
  return (
    <Card className="shadow">
      <CardHeader className="pb-4">
        <CardTitle>Telehealth Session</CardTitle>
        <CardDescription>Active video consultation interface</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-gray-900 rounded-lg aspect-video relative">
          {/* Patient video mockup */}
          <div className="absolute top-4 left-4 w-32 h-24 bg-gray-700 rounded-lg border-2 border-white overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150"
              alt="Patient during video consultation"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Main doctor view */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
              alt="Doctor during video consultation"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Control buttons */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <Button size="sm" className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600">
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="sm" className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600">
              <Video className="h-4 w-4" />
            </Button>
            <Button size="sm" className="p-3 bg-medical-error text-white rounded-full hover:bg-red-600">
              <PhoneOff className="h-4 w-4" />
            </Button>
            <Button size="sm" className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600">
              <Monitor className="h-4 w-4" />
            </Button>
          </div>

          {/* Session info */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
            <span>12:34</span>
          </div>
        </div>
        
        {/* Session details */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                alt="Margaret Thompson"
              />
              <AvatarFallback>MT</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Margaret Thompson</h4>
              <p className="text-sm text-gray-600">Follow-up consultation • Age 68</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-medical-blue hover:bg-blue-700">
              Take Notes
            </Button>
            <Button size="sm" variant="outline">
              Prescribe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
