import { API_URL } from "../API/config.js";

export async function GetUser() {
    try {
        const response = await fetch(`${API_URL}users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
