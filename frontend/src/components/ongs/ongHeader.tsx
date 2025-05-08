"use client";

import { useEffect, useState } from "react"

export default function OngHeader({ id }: { id: number }) {
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
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg relative">
                <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
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
            <div className="relative pb-6 px-6">
            <div className="absolute -top-16 left-8">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden">
                    <img
                        src={ong?.images[0].url || "/placeholder.svg?height=40&width=40"}
                        alt={ong?.name || "Carregando..."}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
            <div className="pt-20">
                <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{ong?.name || "Carregando..."}</h1>
                    <p className="text-lg">{ong?.cnpj || "Carregando..."}</p>
                    <p className="text-sm text-gray-500 mt-1">Responsável: {ong?.user.name || "Carregando..."}</p>
                    <div className="flex gap-2 mt-3">
                        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Open to</button> */}
                        {/* <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">Add profile section</button> */}
                        {/* <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">More</button> */}
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="w-64 bg-white rounded-lg shadow border">
                    <div className="p-3">
                        <div className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=40&width=40" alt="Tech Company" className="w-10 h-10" />
                        <div>
                            <h4 className="font-medium text-sm">Tech Company</h4>
                            <p className="text-xs text-gray-500">Software Company</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="w-64 bg-white rounded-lg shadow border">
                    <div className="p-3">
                        <div className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=40&width=40" alt="University" className="w-10 h-10" />
                        <div>
                            <h4 className="font-medium text-sm">University of Technology</h4>
                            <p className="text-xs text-gray-500">Educational Institution</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}
