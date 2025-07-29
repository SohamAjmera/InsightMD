export interface DashboardMetrics {
  totalPatients: number;
  todayAppointments: number;
  aiAnalyses: number;
  highPriority: number;
}

// Import types from shared schema first
import type {
  User,
  Patient,
  Appointment,
  AiInsight,
  Message,
  MedicalRecord,
} from "@shared/schema";

export interface PatientWithInsights extends Patient {
  recentInsights?: AiInsight[];
}

export interface AppointmentWithPatient extends Appointment {
  patient?: Patient;
}

export interface MessageWithPatient extends Message {
  patient?: Patient;
}

export interface AiInsightWithPatient extends AiInsight {
  patient?: Patient;
}

export interface VisitTrendData {
  week: string;
  visits: number;
}

export interface NotificationData {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  duration?: number;
}

export interface SymptomAnalysisRequest {
  symptoms: string[];
  patientAge?: number;
  patientGender?: string;
}

export interface MedicalAnalysisRequest {
  patientId: string;
  symptoms: string[];
  vitalSigns?: any;
}

// Re-export types from shared schema
export type {
  User,
  Patient,
  Appointment,
  AiInsight,
  Message,
  MedicalRecord,
} from "@shared/schema";
