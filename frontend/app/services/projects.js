import { API_URL } from "../API/config.js";

export async function GetProjects() {
    try {
        const response = await fetch(API_URL + "/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar Projetos");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetProject(id) {
    try {
        const response = await fetch(API_URL + "/projects/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar Projeto");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
