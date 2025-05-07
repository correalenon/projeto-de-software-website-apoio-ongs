import { API_URL, TOKEN } from "./config.js";

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

export async function postContributionUser(newContribution) {
    try {
        const response = await fetch(API_URL + "/contributions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN,
            },
            body: JSON.stringify(newContribution),
        });

        const data = await response.json();
        
        if (response.status !== 201) {
            throw new Error(data?.error);
        }

        return data;
    } catch (error) {
        throw new Error(error.message || "Erro ao cadastrar nova contribuição");
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

export async function DeleteContributionUserByID(updateDataID) {
    try {
        const response = await fetch(`${API_URL}/contributions/${updateDataID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(data?.error);
        }

        return await response.json();

    } catch (error) {
        throw new Error(error.message || "Erro ao deletar contribuição");
    }
}