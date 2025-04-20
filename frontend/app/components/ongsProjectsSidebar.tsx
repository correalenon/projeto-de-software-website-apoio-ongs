"use client";

import Link from "next/link"
import { useEffect, useState } from "react"
import { GetOngs } from "../services/ongs"
import { GetProjects } from "../services/projects";

export default function OngsProjectsSidebar() {
    const [ongs, setOngs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function loadOngs() {
            setIsLoading(true);
            const fetchedOngs = await GetOngs();
            setOngs(fetchedOngs || []);
            setIsLoading(false);
        }
        loadOngs();
        async function loadProjects() {
            setIsLoading(true);
            const fetchedProjects = await GetProjects();
            setProjects(fetchedProjects || []);
            setIsLoading(false);
        }
        loadProjects();
    }, []);

    return (
        <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 text-center">
                    <h3 className="text-base font-medium mb-2">Alguns números</h3>
                </div>
                <div className="p-0">
                    <nav className="space-y-1">
                        {[
                        { label: "ONG's", count: ongs.length },
                        { label: "Projetos", count: projects.length },
                        ].map((item, i) => (
                        <Link key={i} href="#" className="flex items-center justify-between px-4 py-2 hover:bg-gray-100">
                            <span className="text-sm">{item.label}</span>
                            <span className="text-sm text-gray-500">{item.count}</span>
                        </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
