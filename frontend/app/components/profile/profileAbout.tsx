"use client";

import { useEffect, useState } from "react"
import { GetUser } from "../../services/users";

export default function ProfileAbout() {
    const [user, setUser] = useState([]);
    useEffect(() => {
        async function loadUser() {
            const userData = await GetUser();
            setUser(userData || []);
        }
        loadUser()
    }, []);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="flex flex-row items-center justify-between p-4">
                <h3 className="text-lg font-medium">Sobre</h3>
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                </button>
            </div>
            <div className="px-4 pb-4">
                <p>
                    {user?.description || "Carregando..."}
                </p>
            </div>
        </div>
    )
}
