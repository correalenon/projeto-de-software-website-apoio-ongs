export async function GetPosts() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/posts", {
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
        const response = await fetch(`http://localhost:3000/api/v1/posts/${id}`, {
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
        const response = await fetch(`http://localhost:3000/api/v1/posts`, {
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
