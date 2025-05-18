"use client";

import { useEffect, useState } from "react";
import type { Ong } from "@/interfaces/index";
import { noProfileImageONG } from "app/images";

export default function OngHeader({ id }: { id: number }) {
  const [ong, setOng] = useState<Ong | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOng() {
      try {
        const response = await fetch(`/api/ongs/${id}`);
        const data = await response.json();
        setOng(data);
      } finally {
        setIsLoading(false);
      }
    }
    loadOng();
  }, [id]);

  if (isLoading || !ong) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h3 className="text-base font-medium">Carregando informações da ONG...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      {/* Capa da ONG */}
      <div className="h-48 bg-gray-200 relative">
        <img
          src={ong.coverImage || "/default-cover.jpg"}
          alt="Imagem de capa"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Perfil e informações */}
      <div className="relative px-6 pb-6">
        {/* Foto de perfil */}
        <div className="absolute -top-16 left-6">
          <div className="h-32 w-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
            <img
              src={ong.profileImage || noProfileImageONG}
              alt={ong.nameONG}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="pt-20 pl-6 md:flex md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ong.nameONG}</h1>
            <p className="text-sm text-gray-700 mt-1">Razão Social: {ong.socialName}</p>
            <p className="text-sm text-gray-600">CNPJ: {ong.cnpj}</p>
            <p className="text-sm text-gray-500 mt-2">
              Responsável: {ong.nameLegalGuardian}
            </p>
          </div>

          {/* Informações complementares (pode customizar depois) */}
          <div className="mt-6 md:mt-0 text-right">
            <p className="text-sm text-gray-500">Fundada em: {new Date(ong.foundationDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">{ong.city} - {ong.state}</p>
          </div>
        </div>
      </div>
    </div>
  );
}