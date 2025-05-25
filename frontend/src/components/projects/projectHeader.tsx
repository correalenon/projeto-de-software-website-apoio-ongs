"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";
// import { noProfileImageProject } from "app/images";

export default function ProjectHeader({ id }: { id: number }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();
        setProject(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (isLoading || !project) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações do Projeto...</h3>
      </div>
    );
  }

  return (
    <div className="relative h-64 rounded-lg overflow-hidden shadow">
      <img
        src={project.projectImage || "/projeto-capa.jpg"}
        alt="Foto de capa do projeto"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
        <h1 className="text-white text-2xl font-bold">{project.name}</h1>
        <p className="text-gray-200 text-sm">
          Vinculado à ONG: <span className="font-semibold">{project.ong.nameONG}</span>
        </p>
      </div>
    </div>
  );
}