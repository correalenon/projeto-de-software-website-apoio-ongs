import { API_URL, TOKEN } from "../API/config.js";

export async function getFilterOngs(data) {
    try {
        const queryParams = new URLSearchParams(data).toString();

        const response = await fetch(`${API_URL}/filters/ongs?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN,
            },
            query: data,
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar Ongs");
        }

        const responseData = await response.json();
        return responseData;
    }
    catch (error) {
        console.error("Erro ao buscar ongs: ", error)
        return [];
    }
};
