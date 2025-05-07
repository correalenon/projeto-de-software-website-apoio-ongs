import { API_URL, TOKEN } from "./config.js";

export async function GetOngs() {
    try {
        const response = await fetch(API_URL + "/ongs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar ONG's");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function GetOng(id) {
    try {
        const response = await fetch(API_URL + "/ongs/ " + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar ONG");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}
