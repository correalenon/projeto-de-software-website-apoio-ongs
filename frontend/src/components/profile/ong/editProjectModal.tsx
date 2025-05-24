"use client";

import { useState } from "react";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Project;
  onSave: (updatedProject: Project) => void;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  ongId: number;
  coverImage: string;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: EditProjectModalProps) {
  const [projectData, setProjectData] = useState<Project>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    // Logic to save project
    onSave(projectData); // Update project data
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-medium mb-4">Editar Projeto</h3>

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={projectData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={projectData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}