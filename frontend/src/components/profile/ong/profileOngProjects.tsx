"use client"; 

import Link from "next/link";
import { useEffect, useState } from "react";
import { Project } from "@/interfaces/index";
import EditProjectModal from "@/components/profile/ong/editProjectModal";  // Importando o modal de edição de projeto

export default function ProfileOngProjects({ id }: { id: number }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
      } else {
        alert("Erro ao excluir o projeto.");
      }
    } catch (error) {
      alert("Erro ao excluir o projeto.");
    }
  };

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
            {projects.map((project) => (
              <div key={project.id} className="border rounded-lg hover:shadow-md transition">
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Edição de Projeto */}
      {isModalOpen && selectedProject && (
        <EditProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedProject}
          onSave={(updatedProject) => {
            setProjects((prev) =>
              prev.map((project) =>
                project.id === updatedProject.id ? updatedProject : project
              )
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}