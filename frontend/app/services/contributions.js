import { API_URL, TOKEN } from "../API/config.js";

export async function getContributionsUser() {
    try {
        const response = await fetch(API_URL + "/contributions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar contribuições do usuário");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function postContributionUser(name, email, password, location, role, description) {
    try {
        const response = await fetch(API_URL + "/contributions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password, location, role, description }),
        });

        const data = await response.json();

        return { status: response.status, data}
    } catch (error) {
        throw error;
    }
}

export async function PutContributionUserByID(updateData, id) {
    try {
        if (!id) {
            throw new Error("ID não fornecido");
        }
        
        const response = await fetch(`${API_URL}/contributions/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN,
            },

            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao atualizar contribuição");
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
}

export async function DeleteContributionUserByID(updateData) {
    try {
        const response = await fetch(API_URL + '/users', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN,
            },

            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao atualizar usuário");
        }

        return await response.json();

    } catch (error) {
        throw error;
    }
}