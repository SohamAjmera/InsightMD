import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { MessageWithPatient } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function MessagesPreview() {
  const { data: unreadMessages, isLoading } = useQuery<MessageWithPatient[]>({
    queryKey: ["/api/messages/unread"],
  });

  const { data: allMessages } = useQuery<MessageWithPatient[]>({
    queryKey: ["/api/messages"],
    queryFn: () => fetch("/api/messages").then(res => res.json()),
  });

  const recentMessages = allMessages?.slice(0, 3) || [];

  return (
    <Card className="shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Messages</CardTitle>
          <Badge className="bg-medical-error text-white">
            {unreadMessages?.length || 0} unread
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((message, index) => {
              const timeDiff = Math.floor((Date.now() - (message.createdAt ? new Date(message.createdAt).getTime() : Date.now())) / (24 * 60 * 60 * 1000));
              const timeLabel = timeDiff === 0 ? "Today" : 
                               timeDiff === 1 ? "1 day ago" : 
                               `${timeDiff} days ago`;
              
              return (
                <div 
                  key={message.id} 
                  className={`flex items-start space-x-3 p-3 rounded-lg ${
                    !message.isRead && index === 0 ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={message.patient?.profileImageUrl || `https://images.unsplash.com/photo-150740910${7 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100`}
                      alt={message.patient ? `${message.patient.firstName} ${message.patient.lastName}` : "Patient"}
                    />
                    <AvatarFallback>
                      {message.patient?.firstName?.[0]}{message.patient?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {message.patient ? `${message.patient.firstName} ${message.patient.lastName}` : "Unknown Patient"}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {message.content.length > 50 ? `${message.content.substring(0, 50)}...` : message.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{timeLabel}</p>
                  </div>
                  {!message.isRead && index === 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-medical-blue rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full text-center text-sm text-medical-blue hover:text-blue-700 font-medium">
            View All Messages
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
