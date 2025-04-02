export async function GetProjects() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/projects", {
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
        const response = await fetch(`http://localhost:3000/api/v1/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar ONG");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
