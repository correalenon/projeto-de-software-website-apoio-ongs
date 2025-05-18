"use client"; 

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";

export default function OngProjects({ id }: { id: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const ongIdNum = Number(id);
        const response = await fetch('/api/projects');
        const allProjects = await response.json();
        const filtered = allProjects.filter((p: Project) => p.ongId === ongIdNum);
        setProjects(filtered || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando projetos...</h3>
      </div>
    );
  }

  return (
<div className="bg-white rounded-lg shadow mb-6">
  <div className="px-6 py-4 border-b">
    <h2 className="text-xl font-semibold text-gray-800 text-center">Projetos da ONG</h2>
  </div>

  <div className="px-6 py-4">
    {projects.length === 0 ? (
      <p className="text-center text-gray-500">Nenhum projeto cadastrado ainda.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="border rounded-lg hover:shadow-md transition">
            {project.images.length > 0 && (
              <Link legacyBehavior href={`/projects/${project.id}`} passHref>
                <a className="block h-48 w-full overflow-hidden rounded-t-lg cursor-pointer">
                  <img
                    src={project.images[0].content}
                    alt={project.name}
                    className="h-full w-full object-cover"
                  />
                </a>
              </Link>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
}