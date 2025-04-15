import { API_URL } from "../API/config.js";

export async function GetPosts() {
    try {
        const response = await fetch(API_URL + "posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar Posts");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function GetPost(id) {
    try {
        const response = await fetch(`${API_URL}posts/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar Post");
        }
        return await response.json();
    } catch (error) {
        return null;
    }
}

export async function PublishPost(data) {
    try {
        const response = await fetch(API_URL + "posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Erro ao publicar Post");
        }
        return await response.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}
