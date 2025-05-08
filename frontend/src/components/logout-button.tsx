"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/context/userContext";

export default function LogoutButton() {
  const router = useRouter()
  const { logout } = useUser();

  const handleLogout = async () => {
    logout();
    
    const response = await fetch('/api/logout', {
      method: 'POST',
    });
    if (!response.ok) {
      return
    }
    router.push("/login")
  }

  return (
    <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
      Logout
    </button>
  )
}
