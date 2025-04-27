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

export async function PostUser(name, email, password, location, role, description) {
    try {
        const response = await fetch(API_URL + "/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, location, role, description }),
        });
        if (!response.status === 201) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao cadastrar usuário");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export async function GetLocation(cep) {
    try {
        const response = await fetch("https://viacep.com.br/ws/" + cep + "/json/")
        if (!response.ok) {
            throw new Error("Erro ao buscar localização pelo CEP")
        }

        const data = await response.json();

        if (data) {
            return data.localidade + ", " + data.uf
        }
    }
    catch (error) {
        throw error;
    }
}