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

// Additional AI-powered medical analysis functions
export async function analyzeMedicalImage(imagePath: string, imageType: 'xray' | 'ct' | 'mri' | 'blood_test'): Promise<{
  findings: string[];
  diagnosis: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  confidence: number;
}> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const imageBytes = fs.readFileSync(imagePath);
    const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

    const prompt = `Analyze this ${imageType.replace('_', ' ')} medical image and provide detailed findings:

Please analyze the image for:
1. Key anatomical findings
2. Any abnormalities or areas of concern
3. Potential diagnosis based on visible features
4. Risk assessment
5. Recommended follow-up actions

Format your response as JSON with these keys: findings (array), diagnosis, riskLevel (low/medium/high), recommendations (array), confidence (0-100).

IMPORTANT: This analysis is for educational purposes and should not replace professional radiological interpretation.`;

    const contents = [
      {
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType: mimeType,
        },
      },
      prompt,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      findings: result.findings || ["Unable to analyze image"],
      diagnosis: result.diagnosis || "Analysis inconclusive",
      riskLevel: result.riskLevel || "medium",
      recommendations: result.recommendations || ["Consult with a radiologist"],
      confidence: result.confidence || 50,
    };
  } catch (error) {
    console.error("Error analyzing medical image:", error);
    return {
      findings: ["Image analysis failed"],
      diagnosis: "Technical error occurred",
      riskLevel: "medium",
      recommendations: ["Please consult with a medical professional"],
      confidence: 0,
    };
  }
}

export async function generateMedicalReport(patientData: any, diagnosticResults: any): Promise<{
  summary: string;
  detailedFindings: string;
  recommendations: string[];
  followUpActions: string[];
}> {
  try {
    const prompt = `Generate a comprehensive medical report based on the following data:

Patient Information:
- Name: ${patientData.firstName} ${patientData.lastName}
- Age: ${patientData.age || 'Not specified'}
- Gender: ${patientData.gender || 'Not specified'}
- Medical History: ${JSON.stringify(patientData.medicalHistory)}
- Allergies: ${patientData.allergies?.join(', ') || 'None reported'}
- Current Medications: ${patientData.medications?.join(', ') || 'None reported'}

Diagnostic Results:
${JSON.stringify(diagnosticResults)}

Please generate a professional medical report with:
1. Executive summary
2. Detailed findings and analysis
3. Clinical recommendations
4. Follow-up actions needed

Format as JSON with keys: summary, detailedFindings, recommendations (array), followUpActions (array).

IMPORTANT: This is for educational purposes and should not replace professional medical documentation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      summary: result.summary || "Report generation incomplete",
      detailedFindings: result.detailedFindings || "Unable to generate detailed findings",
      recommendations: result.recommendations || ["Consult healthcare provider"],
      followUpActions: result.followUpActions || ["Schedule follow-up appointment"],
    };
  } catch (error) {
    console.error("Error generating medical report:", error);
    return {
      summary: "Report generation failed",
      detailedFindings: "Technical error occurred during report generation",
      recommendations: ["Consult with healthcare provider"],
      followUpActions: ["Manual report generation required"],
    };
  }
}

export async function analyzeBloodTest(bloodTestData: any): Promise<{
  normalValues: any;
  abnormalValues: any;
  interpretation: string;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
}> {
  try {
    const prompt = `Analyze these blood test results and provide medical interpretation:

Blood Test Results:
${JSON.stringify(bloodTestData)}

Please provide:
1. Values within normal range
2. Values outside normal range with significance
3. Clinical interpretation of results
4. Potential risk factors identified
5. Medical recommendations
6. Confidence in analysis (0-100%)

Format as JSON with keys: normalValues, abnormalValues, interpretation, riskFactors (array), recommendations (array), confidence.

IMPORTANT: This analysis is for educational purposes and should not replace professional laboratory interpretation.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      normalValues: result.normalValues || {},
      abnormalValues: result.abnormalValues || {},
      interpretation: result.interpretation || "Unable to interpret results",
      riskFactors: result.riskFactors || ["Consult healthcare provider"],
      recommendations: result.recommendations || ["Professional review recommended"],
      confidence: result.confidence || 50,
    };
  } catch (error) {
    console.error("Error analyzing blood test:", error);
    return {
      normalValues: {},
      abnormalValues: {},
      interpretation: "Analysis failed due to technical error",
      riskFactors: ["Technical analysis unavailable"],
      recommendations: ["Consult with healthcare provider for manual interpretation"],
      confidence: 0,
    };
  }
}

export async function provideMedicalRecommendations(symptoms: string[], patientHistory: any): Promise<{
  immediateActions: string[];
  lifestyleRecommendations: string[];
  preventiveMeasures: string[];
  whenToSeekHelp: string[];
  confidence: number;
}> {
  try {
    const prompt = `Based on the presented symptoms and patient history, provide comprehensive medical recommendations:

Current Symptoms: ${symptoms.join(', ')}
Patient Medical History: ${JSON.stringify(patientHistory)}

Please provide:
1. Immediate actions the patient should take
2. Lifestyle modifications that could help
3. Preventive measures for the future
4. Clear indicators of when to seek immediate medical help
5. Confidence level in recommendations (0-100%)

Format as JSON with keys: immediateActions (array), lifestyleRecommendations (array), preventiveMeasures (array), whenToSeekHelp (array), confidence.

IMPORTANT: These are general recommendations and should not replace professional medical advice.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      immediateActions: result.immediateActions || ["Consult healthcare provider"],
      lifestyleRecommendations: result.lifestyleRecommendations || ["Maintain healthy lifestyle"],
      preventiveMeasures: result.preventiveMeasures || ["Regular health checkups"],
      whenToSeekHelp: result.whenToSeekHelp || ["If symptoms worsen or persist"],
      confidence: result.confidence || 50,
    };
  } catch (error) {
    console.error("Error providing medical recommendations:", error);
    return {
      immediateActions: ["Seek professional medical advice"],
      lifestyleRecommendations: ["Consult with healthcare provider"],
      preventiveMeasures: ["Regular medical checkups"],
      whenToSeekHelp: ["Any concerning symptoms"],
      confidence: 0,
    };
  }
}
