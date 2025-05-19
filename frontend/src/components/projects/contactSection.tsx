"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/interfaces/index";

export default function ContactSection({ id }: { id: number }) {
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

  const ong = Array.isArray(project.ong) ? project.ong[0] : project.ong;
  const {
    street,
    number,
    complement,
    district,
    city,
    state,
    cep,
  } = ong;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-700">Email: {ong.emailONG}</p>
      <p className="text-sm text-gray-700">WhatsApp: {ong.whatsapp || ""}</p>
      <p className="text-sm text-gray-700">Instagram: {ong.instagram || ""}</p>
      <p className="text-sm text-gray-700">Endereço: {street}{number ? `, ${number}` : ""}{complement ? ` - ${complement}` : ""}{district ? `, ${district}` : ""}{city ? `, ${city}` : ""}{state ? `, ${state}` : ""}{cep ? `, ${cep}` : ""}
      </p>
    </div>
  );
}