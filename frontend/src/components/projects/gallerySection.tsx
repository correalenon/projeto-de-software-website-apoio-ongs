"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";
// import { noProfileImageProject } from "app/images";

export default function GallerySection({ id }: { id: number }) {
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
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">Galeria</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {project.images.map((img, i) => (
          <div key={i} className="min-w-[200px] h-40 rounded overflow-hidden shadow">
            <img
              src={img}
              alt={`Foto ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}