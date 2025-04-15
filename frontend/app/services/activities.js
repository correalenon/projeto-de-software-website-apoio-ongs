import { API_URL, TOKEN } from "../API/config.js";

export async function GetActivities() {
    try {
        const response = await fetch(API_URL + "/activities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar atividades");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function GetActivity() {
    try {
        const response = await fetch(API_URL + "/activities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar atividades");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}
