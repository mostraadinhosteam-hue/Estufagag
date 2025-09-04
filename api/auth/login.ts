import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, "Username é obrigatório"),
  password: z.string().min(1, "Password é obrigatório"),
});

// Usuários - ADM/ADM conforme solicitado
const users = new Map([
  ['ADM', { id: '1', username: 'ADM', password: 'ADM' }]
]);

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const user = users.get(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: "Credenciais inválidas" 
      });
    }

    res.json({ 
      success: true, 
      message: "Login realizado com sucesso",
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(400).json({ 
      success: false, 
      message: "Dados inválidos",
      error: error instanceof Error ? error.message : "Erro desconhecido"
    });
  }
}