export async function Login(email, password) {
    try {
        const response = await fetch("http://localhost:3000/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao realizar login");
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}
