import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeMedicalData, analyzeSymptoms, generateMedicalSummary } from "./services/gemini";
import { insertPatientSchema, insertAppointmentSchema, insertMessageSchema, insertMedicalRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      const today = new Date();
      const todayAppointments = await storage.getAppointmentsByDate(today);
      const recentInsights = await storage.getRecentAiInsights();
      const highPriorityInsights = recentInsights.filter(insight => 
        insight.priority === "high" || insight.priority === "urgent"
      );

      const metrics = {
        totalPatients: patients.length,
        todayAppointments: todayAppointments.length,
        aiAnalyses: recentInsights.length,
        highPriority: highPriorityInsights.length,
      };

      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Patient routes
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Error fetching patient:", error);
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      console.error("Error creating patient:", error);
      res.status(500).json({ message: "Failed to create patient" });
    }
  });

  // Appointment routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const { date, doctorId } = req.query;
      let appointments;
      
      if (date) {
        const queryDate = new Date(date as string);
        appointments = await storage.getAppointmentsByDate(queryDate);
      } else if (doctorId) {
        appointments = await storage.getAppointmentsByDoctor(doctorId as string);
      } else {
        // Get today's appointments by default
        const today = new Date();
        appointments = await storage.getAppointmentsByDate(today);
      }

      // Enrich with patient data
      const enrichedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await storage.getPatient(appointment.patientId);
          return { ...appointment, patient };
        })
      );

      res.json(enrichedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  // AI Insights routes
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const { limit } = req.query;
      const insights = await storage.getRecentAiInsights(limit ? parseInt(limit as string) : undefined);
      
      // Enrich with patient data
      const enrichedInsights = await Promise.all(
        insights.map(async (insight) => {
          const patient = await storage.getPatient(insight.patientId);
          return { ...insight, patient };
        })
      );

      res.json(enrichedInsights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  app.post("/api/ai-insights/analyze", async (req, res) => {
    try {
      const { patientId, symptoms, vitalSigns } = req.body;
      
      if (!patientId || !symptoms || !Array.isArray(symptoms)) {
        return res.status(400).json({ message: "Patient ID and symptoms array are required" });
      }

      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // Prepare patient data for AI analysis
      const patientData = {
        symptoms,
        vitalSigns,
        medicalHistory: patient.medicalHistory,
        medications: patient.medications || undefined,
        age: patient.dateOfBirth ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : undefined,
        gender: patient.gender || undefined,
      };

      // Get AI analysis
      const analysis = await analyzeMedicalData(patientData);

      // Create AI insight record
      const insight = await storage.createAiInsight({
        patientId,
        doctorId: "dr.johnson", // In a real app, this would come from the authenticated user
        title: analysis.title,
        description: analysis.description,
        type: analysis.riskLevel === "low" ? "success" : 
              analysis.riskLevel === "medium" ? "warning" :
              analysis.riskLevel === "high" ? "warning" : "error",
        confidence: analysis.confidence,
        priority: analysis.priority,
        status: "active",
        data: { analysis, originalData: patientData },
      });

      res.json({ insight, analysis });
    } catch (error) {
      console.error("Error analyzing medical data:", error);
      res.status(500).json({ message: "Failed to analyze medical data" });
    }
  });

  app.post("/api/ai-insights/symptoms", async (req, res) => {
    try {
      const { symptoms, patientAge, patientGender } = req.body;
      
      if (!symptoms || !Array.isArray(symptoms)) {
        return res.status(400).json({ message: "Symptoms array is required" });
      }

      const analysis = await analyzeSymptoms(symptoms, patientAge, patientGender);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      res.status(500).json({ message: "Failed to analyze symptoms" });
    }
  });

  // Messages routes
  app.get("/api/messages", async (req, res) => {
    try {
      const { userId } = req.query;
      const doctorId = "dr.johnson"; // In a real app, this would come from the authenticated user
      
      const messages = await storage.getMessagesByUser(userId as string || doctorId);
      
      // Enrich with patient data
      const enrichedMessages = await Promise.all(
        messages.map(async (message) => {
          const patient = message.patientId ? await storage.getPatient(message.patientId) : null;
          return { ...message, patient };
        })
      );

      res.json(enrichedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/unread", async (req, res) => {
    try {
      const doctorId = "dr.johnson"; // In a real app, this would come from the authenticated user
      const unreadMessages = await storage.getUnreadMessages(doctorId);
      
      // Enrich with patient data
      const enrichedMessages = await Promise.all(
        unreadMessages.map(async (message) => {
          const patient = message.patientId ? await storage.getPatient(message.patientId) : null;
          return { ...message, patient };
        })
      );

      res.json(enrichedMessages);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      res.status(500).json({ message: "Failed to fetch unread messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Medical Records routes
  app.get("/api/medical-records", async (req, res) => {
    try {
      const { patientId } = req.query;
      
      if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
      }

      const records = await storage.getMedicalRecordsByPatient(patientId as string);
      res.json(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      res.status(500).json({ message: "Failed to fetch medical records" });
    }
  });

  app.post("/api/medical-records", async (req, res) => {
    try {
      const validatedData = insertMedicalRecordSchema.parse(req.body);
      const record = await storage.createMedicalRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid medical record data", errors: error.errors });
      }
      console.error("Error creating medical record:", error);
      res.status(500).json({ message: "Failed to create medical record" });
    }
  });

  // Medical Summary Generation
  app.post("/api/generate-summary", async (req, res) => {
    try {
      const { patientName, symptoms, diagnosis, treatments, notes } = req.body;
      
      if (!patientName || !symptoms) {
        return res.status(400).json({ message: "Patient name and symptoms are required" });
      }

      const summary = await generateMedicalSummary({
        patientName,
        symptoms,
        diagnosis,
        treatments,
        notes,
      });

      res.json({ summary });
    } catch (error) {
      console.error("Error generating medical summary:", error);
      res.status(500).json({ message: "Failed to generate medical summary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
