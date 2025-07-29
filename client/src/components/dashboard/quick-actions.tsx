import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, CalendarPlus, FileText, MessageSquareText } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

const actions = [
  {
    name: "Add Patient",
    icon: UserPlus,
    color: "text-medical-blue",
    action: "addPatient",
  },
  {
    name: "Schedule",
    icon: CalendarPlus,
    color: "text-medical-success",
    action: "scheduleAppointment",
  },
  {
    name: "AI Report",
    icon: FileText,
    color: "text-purple-600",
    action: "generateReport",
  },
  {
    name: "Message",
    icon: MessageSquareText,
    color: "text-medical-warning",
    action: "sendMessage",
  },
];

interface QuickActionsProps {
  onShowAILoading: () => void;
}

export default function QuickActions({ onShowAILoading }: QuickActionsProps) {
  const { addNotification } = useNotifications();

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case "addPatient":
        addNotification({
          type: "info",
          title: "Add Patient",
          message: "Patient registration form would open here.",
        });
        break;
      case "scheduleAppointment":
        addNotification({
          type: "info",
          title: "Schedule Appointment",
          message: "Appointment scheduling interface would open here.",
        });
        break;
      case "generateReport":
        onShowAILoading();
        break;
      case "sendMessage":
        addNotification({
          type: "info",
          title: "Send Message",
          message: "Patient messaging interface would open here.",
        });
        break;
    }
  };

  return (
    <Card className="shadow">
      <CardHeader className="pb-4">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.name}
                variant="outline"
                className="flex flex-col items-center p-4 h-auto hover:bg-gray-50 transition-colors"
                onClick={() => handleAction(action.action)}
              >
                <Icon className={`${action.color} text-2xl h-8 w-8 mb-2`} />
                <span className="text-sm font-medium text-gray-900">{action.name}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
