import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Patient, MedicalRecord } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Plus, 
  Calendar,
  User,
  Download,
  Share,
  Filter,
  FileImage,
  FlaskConical,
  Pill,
  Stethoscope
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const recordTypeIcons = {
  diagnosis: Stethoscope,
  lab_result: FlaskConical,
  prescription: Pill,
  note: FileText,
  imaging: FileImage,
};

const recordTypeColors = {
  diagnosis: "bg-blue-100 text-blue-800",
  lab_result: "bg-green-100 text-green-800",
  prescription: "bg-purple-100 text-purple-800",
  note: "bg-gray-100 text-gray-800",
  imaging: "bg-orange-100 text-orange-800",
};

export default function MedicalRecords() {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState("records");

  const { data: patients, isLoading: patientsLoading } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: records, isLoading: recordsLoading } = useQuery<MedicalRecord[]>({
    queryKey: ["/api/medical-records", selectedPatient],
    queryFn: () => selectedPatient ? fetch(`/api/medical-records?patientId=${selectedPatient}`).then(res => res.json()) : Promise.resolve([]),
    enabled: !!selectedPatient,
  });

  const filteredRecords = records?.filter(record => {
    const matchesSearch = searchQuery === "" || 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || record.recordType === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  const selectedPatientData = patients?.find(p => p.id === selectedPatient);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage patient medical records and documentation
            </p>
          </div>
          <Button className="bg-medical-blue hover:bg-blue-700" disabled={!selectedPatient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Patient Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10"
                    />
                  </div>

                  {patientsLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {patients?.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => setSelectedPatient(patient.id)}
                          className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                            selectedPatient === patient.id
                              ? "bg-medical-blue text-white border-medical-blue"
                              : "hover:bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={patient.profileImageUrl || undefined}
                                alt={`${patient.firstName} ${patient.lastName}`}
                              />
                              <AvatarFallback>
                                {patient.firstName[0]}{patient.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {patient.firstName} {patient.lastName}
                              </p>
                              <p className={`text-xs truncate ${
                                selectedPatient === patient.id ? "text-blue-100" : "text-gray-500"
                              }`}>
                                {patient.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info Header */}
                {selectedPatientData && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage
                              src={selectedPatientData.profileImageUrl || undefined}
                              alt={`${selectedPatientData.firstName} ${selectedPatientData.lastName}`}
                            />
                            <AvatarFallback className="text-lg">
                              {selectedPatientData.firstName[0]}{selectedPatientData.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                              {selectedPatientData.firstName} {selectedPatientData.lastName}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {selectedPatientData.dateOfBirth 
                                ? `Age ${Math.floor((Date.now() - new Date(selectedPatientData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))}` 
                                : "Age not specified"} • {selectedPatientData.gender || "Gender not specified"}
                            </p>
                            <p className="text-sm text-gray-600">{selectedPatientData.email}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Share Records
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{records?.length || 0}</p>
                          <p className="text-sm text-gray-600">Total Records</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {records?.filter(r => r.recordType === "diagnosis").length || 0}
                          </p>
                          <p className="text-sm text-gray-600">Diagnoses</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {records?.filter(r => r.recordType === "prescription").length || 0}
                          </p>
                          <p className="text-sm text-gray-600">Prescriptions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tabs */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="records">All Records</TabsTrigger>
                    <TabsTrigger value="summary">Medical Summary</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="records" className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select value={filterType} onValueChange={setFilterType}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Record Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="lab_result">Lab Results</SelectItem>
                            <SelectItem value="prescription">Prescriptions</SelectItem>
                            <SelectItem value="note">Notes</SelectItem>
                            <SelectItem value="imaging">Imaging</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Records List */}
                    {recordsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <Skeleton key={i} className="h-32 w-full" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredRecords.map((record) => {
                          const Icon = recordTypeIcons[record.recordType as keyof typeof recordTypeIcons] || FileText;
                          const colorClass = recordTypeColors[record.recordType as keyof typeof recordTypeColors];
                          
                          return (
                            <Card key={record.id} className="hover:shadow-lg transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                      <div className="p-2 bg-gray-100 rounded-lg">
                                        <Icon className="h-6 w-6 text-gray-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">
                                          {record.title}
                                        </h3>
                                        <Badge className={colorClass}>
                                          {record.recordType.replace('_', ' ').toUpperCase()}
                                        </Badge>
                                      </div>
                                      
                                      {record.description && (
                                        <p className="text-sm text-gray-600 mb-3">
                                          {record.description}
                                        </p>
                                      )}

                                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-3 w-3" />
                                          <span>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Date unknown'}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <User className="h-3 w-3" />
                                          <span>Dr. Sarah Johnson</span>
                                        </div>
                                        {record.attachments && record.attachments.length > 0 && (
                                          <div className="flex items-center space-x-1">
                                            <FileImage className="h-3 w-3" />
                                            <span>{record.attachments.length} attachment{record.attachments.length > 1 ? 's' : ''}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {!recordsLoading && filteredRecords.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">No medical records found</p>
                        <p className="text-sm text-gray-500">
                          {records?.length === 0 
                            ? "This patient has no medical records yet."
                            : "Try adjusting your search or filters"
                          }
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="summary" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Conditions */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Current Conditions</h4>
                            <div className="space-y-2">
                              {selectedPatientData?.medicalHistory && 
                              (selectedPatientData.medicalHistory as any).conditions?.length > 0 ? (
                                (selectedPatientData.medicalHistory as any).conditions.map((condition: string, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{condition}</span>
                                    <Badge variant="outline">Active</Badge>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No conditions recorded</p>
                              )}
                            </div>
                          </div>

                          {/* Medications */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Current Medications</h4>
                            <div className="space-y-2">
                              {selectedPatientData?.medications && selectedPatientData.medications.length > 0 ? (
                                selectedPatientData.medications.map((medication, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{medication}</span>
                                    <Badge variant="outline">Active</Badge>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No medications recorded</p>
                              )}
                            </div>
                          </div>

                          {/* Allergies */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Allergies</h4>
                            <div className="space-y-2">
                              {selectedPatientData?.allergies && selectedPatientData.allergies.length > 0 ? (
                                selectedPatientData.allergies.map((allergy, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                                    <span className="text-sm">{allergy}</span>
                                    <Badge variant="destructive">Allergy</Badge>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500">No allergies recorded</p>
                              )}
                            </div>
                          </div>

                          {/* Emergency Contact */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                            <div className="p-2 bg-gray-50 rounded">
                              <p className="text-sm">
                                {selectedPatientData?.emergencyContact || "No emergency contact recorded"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                          <div className="space-y-6">
                            {records?.sort((a, b) => {
                              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                              return dateB - dateA;
                            }).map((record, index) => {
                              const Icon = recordTypeIcons[record.recordType as keyof typeof recordTypeIcons] || FileText;
                              
                              return (
                                <div key={record.id} className="relative flex items-start space-x-4">
                                  <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full">
                                    <Icon className="h-4 w-4 text-gray-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="text-sm font-medium text-gray-900">{record.title}</h4>
                                      <Badge className={recordTypeColors[record.recordType as keyof typeof recordTypeColors]}>
                                        {record.recordType.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    {record.description && (
                                      <p className="mt-1 text-sm text-gray-600">{record.description}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Date unknown'} • Dr. Sarah Johnson
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="attachments" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medical Attachments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium text-gray-900">No attachments found</p>
                          <p className="text-sm text-gray-500">
                            Medical images and documents will appear here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              /* No Patient Selected */
              <div className="text-center py-12">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">Select a patient</p>
                <p className="text-sm text-gray-500">
                  Choose a patient from the sidebar to view their medical records
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
