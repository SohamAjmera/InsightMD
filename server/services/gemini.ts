import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MedicalAnalysis {
  riskLevel: "low" | "medium" | "high" | "urgent";
  confidence: number;
  title: string;
  description: string;
  recommendations: string[];
  priority: "low" | "medium" | "high" | "urgent";
}

export interface SymptomAnalysis {
  possibleConditions: string[];
  urgencyLevel: "low" | "medium" | "high" | "urgent";
  recommendedActions: string[];
  confidence: number;
}

export async function analyzeMedicalData(patientData: {
  symptoms: string[];
  vitalSigns?: any;
  medicalHistory?: any;
  medications?: string[];
  age?: number;
  gender?: string;
}): Promise<MedicalAnalysis> {
  try {
    const systemPrompt = `You are a medical AI assistant. Analyze the provided patient data and provide a structured medical assessment. 
    Consider symptoms, vital signs, medical history, current medications, age, and gender.
    Provide risk assessment, confidence level, and clear recommendations.
    This is for informational purposes only and should not replace professional medical advice.
    
    Respond with JSON in this exact format:
    {
      "riskLevel": "low|medium|high|urgent",
      "confidence": number (0-100),
      "title": "Brief title of the assessment",
      "description": "Detailed description of findings",
      "recommendations": ["recommendation1", "recommendation2"],
      "priority": "low|medium|high|urgent"
    }`;

    const patientDataText = `
    Patient Data:
    - Symptoms: ${patientData.symptoms.join(", ")}
    - Age: ${patientData.age || "Not provided"}
    - Gender: ${patientData.gender || "Not provided"}
    - Medical History: ${JSON.stringify(patientData.medicalHistory || {})}
    - Current Medications: ${patientData.medications?.join(", ") || "None"}
    - Vital Signs: ${JSON.stringify(patientData.vitalSigns || {})}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            riskLevel: { type: "string", enum: ["low", "medium", "high", "urgent"] },
            confidence: { type: "number" },
            title: { type: "string" },
            description: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } },
            priority: { type: "string", enum: ["low", "medium", "high", "urgent"] }
          },
          required: ["riskLevel", "confidence", "title", "description", "recommendations", "priority"]
        }
      },
      contents: patientDataText,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: MedicalAnalysis = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to analyze medical data:", error);
    throw new Error(`Failed to analyze medical data: ${error}`);
  }
}

export async function analyzeSymptoms(symptoms: string[], patientAge?: number, patientGender?: string): Promise<SymptomAnalysis> {
  try {
    const systemPrompt = `You are a medical AI assistant specialized in symptom analysis. 
    Analyze the provided symptoms and provide possible conditions, urgency level, and recommended actions.
    Consider the patient's age and gender if provided.
    This is for informational purposes only and should not replace professional medical advice.
    
    Respond with JSON in this exact format:
    {
      "possibleConditions": ["condition1", "condition2"],
      "urgencyLevel": "low|medium|high|urgent",
      "recommendedActions": ["action1", "action2"],
      "confidence": number (0-100)
    }`;

    const symptomsText = `
    Symptoms: ${symptoms.join(", ")}
    Patient Age: ${patientAge || "Not provided"}
    Patient Gender: ${patientGender || "Not provided"}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            possibleConditions: { type: "array", items: { type: "string" } },
            urgencyLevel: { type: "string", enum: ["low", "medium", "high", "urgent"] },
            recommendedActions: { type: "array", items: { type: "string" } },
            confidence: { type: "number" }
          },
          required: ["possibleConditions", "urgencyLevel", "recommendedActions", "confidence"]
        }
      },
      contents: symptomsText,
    });

    const rawJson = response.text;
    if (rawJson) {
      const data: SymptomAnalysis = JSON.parse(rawJson);
      return data;
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Failed to analyze symptoms:", error);
    throw new Error(`Failed to analyze symptoms: ${error}`);
  }
}

export async function generateMedicalSummary(medicalData: {
  patientName: string;
  symptoms: string[];
  diagnosis?: string;
  treatments?: string[];
  notes?: string;
}): Promise<string> {
  try {
    const prompt = `Generate a concise medical summary for the following patient data:
    
    Patient: ${medicalData.patientName}
    Symptoms: ${medicalData.symptoms.join(", ")}
    Diagnosis: ${medicalData.diagnosis || "Not provided"}
    Treatments: ${medicalData.treatments?.join(", ") || "Not provided"}
    Additional Notes: ${medicalData.notes || "None"}
    
    Provide a clear, professional medical summary suitable for medical records.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Unable to generate summary";
  } catch (error) {
    console.error("Failed to generate medical summary:", error);
    throw new Error(`Failed to generate medical summary: ${error}`);
  }
}
