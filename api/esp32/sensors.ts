import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Schema para validar dados do ESP32
const esp32SensorDataSchema = z.object({
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  light: z.number().optional(),
  moisture: z.number().optional(),
  pressure: z.number().optional(),
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validar dados recebidos
    const validatedData = esp32SensorDataSchema.parse(req.body);
    
    // Log dos dados recebidos para debugging
    console.log("Dados recebidos do ESP32:", validatedData);
    
    // Retornar sucesso
    res.json({ 
      success: true, 
      message: "Dados recebidos com sucesso",
      data: validatedData 
    });
  } catch (error) {
    console.error("Erro ao processar dados do ESP32:", error);
    res.status(400).json({ 
      success: false, 
      message: "Dados inválidos",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}