"use client";

import { useEffect, useState } from "react"

export default function AboutSection({ id }: { id: number }) {
    const [ong, setOng] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadOng() {
            setIsLoading(true);
            const response = await fetch('/api/ongs/' + id, {
                method: 'GET'
            });
            const ongData = await response.json();
            setOng(ongData);
            setIsLoading(false);
        }
        loadOng()
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Carregando Ong...</h3>
            </div>
        );
    }

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
                    {ong?.description || "Carregando..."}
                </p>
            </div>
        </div>
    )
}
