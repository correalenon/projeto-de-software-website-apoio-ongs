export async function GetUser() {
    try {
        const response = await fetch("http://localhost:3000/api/v1/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
            },
        });
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
