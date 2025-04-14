import { API_URL } from "../API/config.js";

export async function GetOngs() {
    try {
        const response = await fetch(API_URL + "ongs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar ONG's");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetOng(id) {
    try {
        const response = await fetch(`${API_URL}ongs/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar ONG");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
