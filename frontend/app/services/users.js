import { API_URL, TOKEN } from "../API/config.js";

export async function GetUser() {
    try {
        const response = await fetch(API_URL + "/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}
