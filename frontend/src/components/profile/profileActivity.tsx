"use client";

import { useEffect, useState } from "react"
import { GetUser } from "../../app/api/users";

export default function ProfileActivity() {
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
            <h3 className="text-lg font-medium">Atividades recentes</h3>
            <div className="flex gap-2">
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
                    <path d="M12 5v14M5 12h14" />
                </svg>
                </button>
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
            </div>
            <div className="px-4 pb-4 space-y-6">
            <div className="flex gap-4">
                <img src="/placeholder.svg?height=56&width=56" alt="Tech Company" className="w-14 h-14" />
                <div>
                <h3 className="font-semibold">Senior Software Developer</h3>
                <p className="text-sm">Tech Company · Full-time</p>
                <p className="text-sm text-gray-500">Jan 2021 - Present · 2 yrs 3 mos</p>
                <p className="text-sm text-gray-500">San Francisco, California</p>
                <p className="mt-2">
                    Leading development of the company's flagship product. Managing a team of 5 developers and
                    implementing best practices for code quality and performance.
                </p>
                </div>
            </div>

            <div className="flex gap-4">
                <img src="/placeholder.svg?height=56&width=56" alt="Previous Company" className="w-14 h-14" />
                <div>
                <h3 className="font-semibold">Software Developer</h3>
                <p className="text-sm">Previous Company · Full-time</p>
                <p className="text-sm text-gray-500">Jun 2018 - Dec 2020 · 2 yrs 7 mos</p>
                <p className="text-sm text-gray-500">San Francisco, California</p>
                <p className="mt-2">
                    Developed and maintained web applications using React and Node.js. Collaborated with design and
                    product teams to implement new features.
                </p>
                </div>
            </div>
            </div>
        </div>
    )
}
