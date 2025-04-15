import { API_URL } from "../API/config.js";

export async function Login(email, password) {
    try {
        const response = await fetch(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao realizar login");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
