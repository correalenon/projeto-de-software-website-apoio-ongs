export async function GetActivities() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/activities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar atividades");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function GetActivity() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/activities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar atividades");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
