import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { API_URL } from "../../../app/API/config"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const { email, password } = req.body;
  try {
    const response = await fetch(API_URL + "/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    console.log(await response.json());

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(401).json({ message: errorData.error || "Erro ao realizar login" });
    }
    const data = await response.json();
    // Criar cookie
    const serialized = serialize('auth_token', data.token, {
      // httpOnly: true, // Melhor segurança, o JS do browser não lê
      // sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 dia
      path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
    return res.status(200).json({ message: "Login realizado com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
