import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from "@/api/config";

export async function PUT(request: NextRequest) {
    try {
        const { id } = await request.json();
        const TOKEN = request.cookies.get('token')?.value;
        const response = await fetch(API_URL + "/associate/ong/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
            body: JSON.stringify({ongId: id})
        });

        if (!response.ok) {
          return NextResponse.json({ error: await response.json() }, { status: response.status });
        }

        return NextResponse.json(await response.json(), { status: response.status });
    } catch (error) {
        throw error;
    }
}