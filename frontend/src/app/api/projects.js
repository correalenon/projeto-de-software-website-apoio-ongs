import { API_URL, TOKEN } from "./config.js";

export async function GetProjects() {
    try {
        const response = await fetch(API_URL + "/projects", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar Projetos");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function GetProject(id) {
    try {
        const response = await fetch(API_URL + "/projects/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + TOKEN
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar Projeto");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}
