import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_URL } from "@/api/config";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const response = await fetch(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
          return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
        }
      
        const { token } = await response.json();
      
        cookies().set('token', token, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60, // 1h
        });
        return NextResponse.json({ message: 'Autenticado com sucesso' });
    } catch (error) {
        throw error;
    }
}
