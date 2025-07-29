import { type User, type InsertUser, type Patient, type InsertPatient, 
         type Appointment, type InsertAppointment, type AiInsight, type InsertAiInsight,
         type Message, type InsertMessage, type MedicalRecord, type InsertMedicalRecord } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient operations
  getPatient(id: string): Promise<Patient | undefined>;
  getAllPatients(): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | undefined>;
  
  // Appointment operations
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  
  // AI Insights operations
  getAiInsight(id: string): Promise<AiInsight | undefined>;
  getRecentAiInsights(limit?: number): Promise<AiInsight[]>;
  getAiInsightsByPatient(patientId: string): Promise<AiInsight[]>;
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  updateAiInsight(id: string, insight: Partial<AiInsight>): Promise<AiInsight | undefined>;
  
  // Message operations
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByUser(userId: string): Promise<Message[]>;
  getUnreadMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message | undefined>;
  
  // Medical Record operations
  getMedicalRecord(id: string): Promise<MedicalRecord | undefined>;
  getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]>;
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private patients: Map<string, Patient>;
  private appointments: Map<string, Appointment>;
  private aiInsights: Map<string, AiInsight>;
  private messages: Map<string, Message>;
  private medicalRecords: Map<string, MedicalRecord>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.appointments = new Map();
    this.aiInsights = new Map();
    this.messages = new Map();
    this.medicalRecords = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample doctor user
    const doctorId = randomUUID();
    const doctor: User = {
      id: doctorId,
      username: "dr.johnson",
      email: "sarah.johnson@insightmd.com",
      firstName: "Sarah",
      lastName: "Johnson",
      role: "doctor",
      specialization: "Internal Medicine",
      profileImageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(doctorId, doctor);

    // Create sample patients
    const patients: Patient[] = [
      {
        id: randomUUID(),
        firstName: "Emma",
        lastName: "Davis",
        email: "emma.davis@email.com",
        phone: "(555) 123-4567",
        dateOfBirth: new Date("1985-03-15"),
        gender: "Female",
        address: "123 Main St, Anytown, ST 12345",
        emergencyContact: "John Davis - (555) 123-4568",
        medicalHistory: { conditions: ["Hypertension"], surgeries: [] },
        allergies: ["Penicillin"],
        medications: ["Lisinopril 10mg"],
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@email.com",
        phone: "(555) 234-5678",
        dateOfBirth: new Date("1972-08-22"),
        gender: "Male",
        address: "456 Oak Ave, Somewhere, ST 23456",
        emergencyContact: "Lisa Chen - (555) 234-5679",
        medicalHistory: { conditions: ["Type 2 Diabetes"], surgeries: [] },
        allergies: [],
        medications: ["Metformin 500mg", "Insulin"],
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        firstName: "Margaret",
        lastName: "Thompson",
        email: "margaret.thompson@email.com",
        phone: "(555) 345-6789",
        dateOfBirth: new Date("1955-12-10"),
        gender: "Female",
        address: "789 Pine St, Elsewhere, ST 34567",
        emergencyContact: "Robert Thompson - (555) 345-6790",
        medicalHistory: { conditions: ["Arthritis", "Osteoporosis"], surgeries: ["Hip Replacement"] },
        allergies: ["Sulfa"],
        medications: ["Calcium", "Vitamin D"],
        profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    patients.forEach(patient => {
      this.patients.set(patient.id, patient);
    });

    // Create sample appointments for today
    const today = new Date();
    const appointments: Appointment[] = [
      {
        id: randomUUID(),
        patientId: patients[0].id,
        doctorId: doctorId,
        title: "Annual Checkup",
        description: "Routine annual physical examination",
        appointmentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30),
        duration: 30,
        type: "telehealth",
        status: "scheduled",
        room: "Room 203",
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        patientId: patients[1].id,
        doctorId: doctorId,
        title: "Diabetes Follow-up",
        description: "Check blood sugar levels and medication adjustment",
        appointmentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0),
        duration: 20,
        type: "telehealth",
        status: "scheduled",
        room: "",
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        patientId: patients[2].id,
        doctorId: doctorId,
        title: "Lab Results Review",
        description: "Review recent blood work and bone density scan",
        appointmentDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 15),
        duration: 15,
        type: "in-person",
        status: "scheduled",
        room: "Room 105",
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    appointments.forEach(appointment => {
      this.appointments.set(appointment.id, appointment);
    });

    // Create sample AI insights
    const insights: AiInsight[] = [
      {
        id: randomUUID(),
        patientId: patients[0].id,
        doctorId: doctorId,
        title: "High Blood Pressure Risk",
        description: "Patient Emma Davis shows elevated BP patterns. Consider medication adjustment.",
        type: "warning",
        confidence: 92,
        priority: "medium",
        status: "active",
        data: { systolic: [145, 150, 148], diastolic: [95, 98, 96] },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        patientId: patients[1].id,
        doctorId: doctorId,
        title: "Treatment Response Positive",
        description: "Michael Chen's diabetes management is showing excellent improvement.",
        type: "success",
        confidence: 87,
        priority: "low",
        status: "active",
        data: { hba1c: 6.8, glucoseLevels: [120, 115, 110] },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        patientId: patients[2].id,
        doctorId: doctorId,
        title: "Urgent Review Required",
        description: "Margaret Thompson's symptoms suggest possible cardiac event. Immediate evaluation recommended.",
        type: "error",
        confidence: 95,
        priority: "urgent",
        status: "active",
        data: { symptoms: ["chest pain", "shortness of breath"], duration: "2 days" },
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      }
    ];

    insights.forEach(insight => {
      this.aiInsights.set(insight.id, insight);
    });

    // Create sample messages
    const messages: Message[] = [
      {
        id: randomUUID(),
        senderId: patients[0].id,
        receiverId: doctorId,
        patientId: patients[0].id,
        subject: "Question about medication",
        content: "Question about medication dosage...",
        isRead: false,
        messageType: "medical",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        senderId: patients[1].id,
        receiverId: doctorId,
        patientId: patients[1].id,
        subject: "Thank you",
        content: "Thank you for the telehealth session",
        isRead: true,
        messageType: "general",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: randomUUID(),
        senderId: patients[2].id,
        receiverId: doctorId,
        patientId: patients[2].id,
        subject: "Appointment request",
        content: "Lab results appointment request",
        isRead: true,
        messageType: "appointment",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      }
    ];

    messages.forEach(message => {
      this.messages.set(message.id, message);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "doctor",
      profileImageUrl: insertUser.profileImageUrl || null,
      specialization: insertUser.specialization || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Patient operations
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { 
      ...insertPatient, 
      id,
      email: insertPatient.email || null,
      phone: insertPatient.phone || null,
      dateOfBirth: insertPatient.dateOfBirth || null,
      gender: insertPatient.gender || null,
      address: insertPatient.address || null,
      emergencyContact: insertPatient.emergencyContact || null,
      medicalHistory: insertPatient.medicalHistory || null,
      allergies: insertPatient.allergies || null,
      medications: insertPatient.medications || null,
      profileImageUrl: insertPatient.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, patientUpdate: Partial<Patient>): Promise<Patient | undefined> {
    const existing = this.patients.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...patientUpdate, updatedAt: new Date() };
    this.patients.set(id, updated);
    return updated;
  }

  // Appointment operations
  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    
    return Array.from(this.appointments.values()).filter(appointment => 
      appointment.appointmentDate >= startOfDay && appointment.appointmentDate <= endOfDay
    );
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => 
      appointment.patientId === patientId
    );
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(appointment => 
      appointment.doctorId === doctorId
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      type: insertAppointment.type || "in-person",
      status: insertAppointment.status || "scheduled",
      duration: insertAppointment.duration || 30,
      description: insertAppointment.description || null,
      room: insertAppointment.room || null,
      notes: insertAppointment.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, appointmentUpdate: Partial<Appointment>): Promise<Appointment | undefined> {
    const existing = this.appointments.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...appointmentUpdate, updatedAt: new Date() };
    this.appointments.set(id, updated);
    return updated;
  }

  // AI Insights operations
  async getAiInsight(id: string): Promise<AiInsight | undefined> {
    return this.aiInsights.get(id);
  }

  async getRecentAiInsights(limit: number = 10): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getAiInsightsByPatient(patientId: string): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values()).filter(insight => 
      insight.patientId === patientId
    );
  }

  async createAiInsight(insertInsight: InsertAiInsight): Promise<AiInsight> {
    const id = randomUUID();
    const insight: AiInsight = { 
      ...insertInsight, 
      id,
      priority: insertInsight.priority || "medium",
      status: insertInsight.status || "active",
      data: insertInsight.data || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.aiInsights.set(id, insight);
    return insight;
  }

  async updateAiInsight(id: string, insightUpdate: Partial<AiInsight>): Promise<AiInsight | undefined> {
    const existing = this.aiInsights.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...insightUpdate, updatedAt: new Date() };
    this.aiInsights.set(id, updated);
    return updated;
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => 
      message.senderId === userId || message.receiverId === userId
    ).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getUnreadMessages(userId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(message => 
      message.receiverId === userId && !message.isRead
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id,
      patientId: insertMessage.patientId || null,
      subject: insertMessage.subject || null,
      isRead: insertMessage.isRead || false,
      messageType: insertMessage.messageType || "general",
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<Message | undefined> {
    const existing = this.messages.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, isRead: true };
    this.messages.set(id, updated);
    return updated;
  }

  // Medical Record operations
  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    return this.medicalRecords.get(id);
  }

  async getMedicalRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
    return Array.from(this.medicalRecords.values()).filter(record => 
      record.patientId === patientId
    );
  }

  async createMedicalRecord(insertRecord: InsertMedicalRecord): Promise<MedicalRecord> {
    const id = randomUUID();
    const record: MedicalRecord = { 
      ...insertRecord, 
      id,
      description: insertRecord.description || null,
      appointmentId: insertRecord.appointmentId || null,
      data: insertRecord.data || null,
      attachments: insertRecord.attachments || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.medicalRecords.set(id, record);
    return record;
  }
}

export const storage = new MemStorage();
