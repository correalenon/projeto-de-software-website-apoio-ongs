"use client";

import Link from "next/link"
import { useEffect, useState } from "react"

export default function OngProjects({ id }: { id: number }) {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function loadProjects() {
            setIsLoading(true);
            const response = await fetch('/api/projects', {
                method: 'GET'
            });
            const fetchedProjects = await response.json();
            setProjects(fetchedProjects || []);
            setIsLoading(false);
        }
        loadProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Carregando Projetos...</h3>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4">
                <h3 className="text-base font-medium mb-4 text-center">Principais projetos desta ONG</h3>
            </div>
            <div className="p-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, i) => (
                    <div key={i} className="border rounded-lg bg-white">
                        <div className="p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full overflow-hidden mb-3">
                            {project.images.length > 0 && (
                                <img
                                    src={project.images[0].url}
                                    alt={project.name}
                                    className="h-full w-full object-cover"
                                />
                            )}
                            </div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className="text-xs text-gray-500 mb-3"></p>
                            <Link href={`/projects/${project.id}`} className="w-full border border-gray-300 rounded py-1 px-3 hover:bg-gray-50">
                                <button>
                                    Visualizar Projeto
                                </button>
                            </Link>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
