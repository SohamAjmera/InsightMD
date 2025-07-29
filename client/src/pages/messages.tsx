import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageWithPatient, Patient } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Plus,
  Filter,
  Archive,
  Star,
  Reply,
  Forward,
  Trash2,
  Clock,
  CheckCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const messageTypeColors = {
  general: "bg-gray-100 text-gray-800",
  appointment: "bg-blue-100 text-blue-800",
  medical: "bg-red-100 text-red-800",
  urgent: "bg-orange-100 text-orange-800",
};

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRead, setFilterRead] = useState<string>("all");
  const [isComposing, setIsComposing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Compose form
  const [composeForm, setComposeForm] = useState({
    patientId: "",
    subject: "",
    content: "",
    messageType: "general",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading: messagesLoading } = useQuery<MessageWithPatient[]>({
    queryKey: ["/api/messages"],
  });

  const { data: unreadMessages } = useQuery<MessageWithPatient[]>({
    queryKey: ["/api/messages/unread"],
  });

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to mark message as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/unread"] });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: any) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setIsComposing(false);
      setReplyingTo(null);
      setComposeForm({ patientId: "", subject: "", content: "", messageType: "general" });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Send",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredMessages = messages?.filter(message => {
    const matchesSearch = searchQuery === "" || 
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (message.patient && `${message.patient.firstName} ${message.patient.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === "all" || message.messageType === filterType;
    const matchesRead = filterRead === "all" || 
      (filterRead === "unread" && !message.isRead) ||
      (filterRead === "read" && message.isRead);
    
    return matchesSearch && matchesType && matchesRead;
  }) || [];

  const selectedMessageData = selectedMessage 
    ? messages?.find(m => m.id === selectedMessage)
    : null;

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessage(messageId);
    const message = messages?.find(m => m.id === messageId);
    if (message && !message.isRead) {
      markAsReadMutation.mutate(messageId);
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedMessage(null);
    setReplyingTo(null);
  };

  const handleReply = (message: MessageWithPatient) => {
    setReplyingTo(message.id);
    setComposeForm({
      patientId: message.patientId || "",
      subject: `Re: ${message.subject || ""}`,
      content: "",
      messageType: message.messageType,
    });
    setIsComposing(true);
    setSelectedMessage(null);
  };

  const handleSendMessage = () => {
    if (!composeForm.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please enter a message content.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      senderId: "dr.johnson", // In real app, this would come from auth
      receiverId: composeForm.patientId || "patient-id", // In real app, proper patient user ID
      patientId: composeForm.patientId || null,
      subject: composeForm.subject,
      content: composeForm.content,
      messageType: composeForm.messageType,
    });
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-600">
              Communicate with patients and manage correspondence
            </p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700" onClick={handleCompose}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <Badge className="bg-medical-error text-white">
                    {unreadMessages?.length || 0} unread
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filters */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterRead} onValueChange={setFilterRead}>
                      <SelectTrigger className="text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Messages List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {messagesLoading ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))
                  ) : (
                    filteredMessages.map((message) => {
                      const timeDiff = Math.floor((Date.now() - (message.createdAt ? new Date(message.createdAt).getTime() : Date.now())) / (24 * 60 * 60 * 1000));
                      const timeLabel = timeDiff === 0 ? "Today" : 
                                       timeDiff === 1 ? "1d ago" : 
                                       `${timeDiff}d ago`;
                      
                      return (
                        <div
                          key={message.id}
                          onClick={() => handleSelectMessage(message.id)}
                          className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                            selectedMessage === message.id
                              ? "bg-medical-blue text-white border-medical-blue"
                              : `hover:bg-gray-50 border-gray-200 ${!message.isRead ? "bg-blue-50 border-blue-200" : ""}`
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={message.patient?.profileImageUrl || undefined}
                                alt={message.patient ? `${message.patient.firstName} ${message.patient.lastName}` : "Patient"}
                              />
                              <AvatarFallback className="text-xs">
                                {message.patient?.firstName?.[0]}{message.patient?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium truncate ${
                                  selectedMessage === message.id ? "text-white" : "text-gray-900"
                                }`}>
                                  {message.patient ? `${message.patient.firstName} ${message.patient.lastName}` : "Unknown"}
                                </p>
                                <div className="flex items-center space-x-1">
                                  {!message.isRead && selectedMessage !== message.id && (
                                    <div className="w-2 h-2 bg-medical-blue rounded-full"></div>
                                  )}
                                  <span className={`text-xs ${
                                    selectedMessage === message.id ? "text-blue-100" : "text-gray-500"
                                  }`}>
                                    {timeLabel}
                                  </span>
                                </div>
                              </div>
                              <p className={`text-sm font-medium truncate ${
                                selectedMessage === message.id ? "text-blue-100" : "text-gray-700"
                              }`}>
                                {message.subject || "No subject"}
                              </p>
                              <p className={`text-xs truncate ${
                                selectedMessage === message.id ? "text-blue-200" : "text-gray-500"
                              }`}>
                                {message.content}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge 
                                  className={`text-xs ${
                                    selectedMessage === message.id 
                                      ? "bg-white bg-opacity-20 text-white" 
                                      : messageTypeColors[message.messageType as keyof typeof messageTypeColors]
                                  }`}
                                >
                                  {message.messageType}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {!messagesLoading && filteredMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">No messages found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Message Detail/Compose */}
          <div className="lg:col-span-2">
            {isComposing ? (
              /* Compose Message */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2 text-medical-blue" />
                    {replyingTo ? "Reply to Message" : "Compose Message"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Patient
                      </label>
                      <Select value={composeForm.patientId} onValueChange={(value) => 
                        setComposeForm({...composeForm, patientId: value})
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient..." />
                        </SelectTrigger>
                        <SelectContent>
                          {patients?.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.firstName} {patient.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message Type
                      </label>
                      <Select value={composeForm.messageType} onValueChange={(value) => 
                        setComposeForm({...composeForm, messageType: value})
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="appointment">Appointment</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                      placeholder="Enter subject..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      value={composeForm.content}
                      onChange={(e) => setComposeForm({...composeForm, content: e.target.value})}
                      placeholder="Type your message..."
                      rows={8}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleSendMessage}
                      disabled={sendMessageMutation.isPending}
                      className="bg-medical-blue hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsComposing(false);
                      setReplyingTo(null);
                      setComposeForm({ patientId: "", subject: "", content: "", messageType: "general" });
                    }}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedMessageData ? (
              /* Message Detail */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedMessageData.patient?.profileImageUrl || undefined}
                          alt={selectedMessageData.patient ? `${selectedMessageData.patient.firstName} ${selectedMessageData.patient.lastName}` : "Patient"}
                        />
                        <AvatarFallback>
                          {selectedMessageData.patient?.firstName?.[0]}{selectedMessageData.patient?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedMessageData.patient ? `${selectedMessageData.patient.firstName} ${selectedMessageData.patient.lastName}` : "Unknown Patient"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedMessageData.createdAt ? new Date(selectedMessageData.createdAt).toLocaleDateString() : 'Date unknown'} at{" "}
                          {selectedMessageData.createdAt ? new Date(selectedMessageData.createdAt).toLocaleTimeString() : 'Time unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={messageTypeColors[selectedMessageData.messageType as keyof typeof messageTypeColors]}>
                        {selectedMessageData.messageType}
                      </Badge>
                      {selectedMessageData.isRead ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {selectedMessageData.subject || "No subject"}
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedMessageData.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <Button 
                      onClick={() => handleReply(selectedMessageData)}
                      className="bg-medical-blue hover:bg-blue-700"
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button variant="outline">
                      <Star className="h-4 w-4 mr-2" />
                      Star
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* No Message Selected */
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">Select a message</p>
                <p className="text-sm text-gray-500">
                  Choose a message from the list to view its contents
                </p>
                <Button 
                  className="mt-4 bg-medical-blue hover:bg-blue-700"
                  onClick={handleCompose}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Compose New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
