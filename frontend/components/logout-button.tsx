"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Remover o cookie de autenticação
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

    // Redirecionar para a página de login
    router.push("/login")
  }

  return (
    <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
      Logout
    </button>
  )
}

