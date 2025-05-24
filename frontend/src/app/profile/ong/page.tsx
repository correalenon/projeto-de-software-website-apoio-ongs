"use client";  // Garante que o código seja executado no cliente

import { useEffect, useState } from "react"
import Header from "@/components/header"
import ProfileHeaderOng from "@/components/profile/ong/profileHeaderOng"
import ProfileAboutOng from "@/components/profile/ong/profileAboutOng"
import ProfileOngProjects from "@/components/profile/ong/profileOngProjects"
import { useOng } from "@/context/ongContext"
import Footer from "@/components/footer"

export default function OngsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-center py-6">Carregando...</div>;
  }

  const { ong } = useOng();

  if (!ong) {
    return <div className="text-center py-6">Carregando dados da ONG...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header de ONG */}
        <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
          <ProfileHeaderOng />
        </div>

        {/* Sobre a ONG */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <ProfileAboutOng />
        </div>

        {/* Projetos da ONG */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ProfileOngProjects id={ong.id} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}