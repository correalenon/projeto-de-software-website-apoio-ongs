"use client";

import { useEffect, useState } from "react";
import EditProfileModalOng, { type ProfileDataOng } from "@/components/profile/ong/editProfileModalOng";
import { useOng } from "@/context/ongContext";
import { noProfileImageONG } from "../../../app/images";

export default function ProfileHeaderOng() {
  const { ong, setOng } = useOng();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileDataOng, setProfileDataOng] = useState<ProfileDataOng>({
    nameONG: "",
    socialName: "",
    profileImage: "",
    coverImage: "",
    foundationDate: new Date(),
  });

  useEffect(() => {
    async function loadOng() {
        setIsLoading(true); 
        setProfileDataOng({
            nameONG: ong?.nameONG || "",
            socialName: ong?.socialName || "",
            profileImage: ong?.profileImage || "",
            coverImage: ong?.coverImage || "",
            foundationDate: new Date(),
        });
        }
        setIsLoading(false);

    loadOng();
  }, [ong]);

  const handleSaveProfile = async (updatedData: ProfileDataOng) => {
    try {
      const response = await fetch("/api/ongs", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      const ongData = await response.json();
      setProfileDataOng(ongData);
      setOng(ongData);
    } catch (error) {
      alert("Falha ao atualizar dados do perfil. Tente novamente.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="h-80 relative rounded-t-lg overflow-hidden">
        <img
          src={profileDataOng.coverImage || "/placeholder.svg?height=400&width=1200&text=Cover"}
          alt="Capa do perfil"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative pb-6 px-6">
        <div className="absolute -top-16 left-8">
          <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden">
            <img
              src={profileDataOng.profileImage || noProfileImageONG}
              alt={profileDataOng.nameONG || "Carregando..."}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="pt-20">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">{profileDataOng?.nameONG || "Carregando..."}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {profileDataOng?.foundationDate
                  ? new Date(profileDataOng.foundationDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long" }).replace(/^\w/, (c) => c.toUpperCase())
                  : "Carregando..."}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50"
                >
                  Editar Perfil
                </button>
                <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">Mais Opções</button>
                {/* Edit Profile Modal */}
                <EditProfileModalOng
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={handleSaveProfile}
                  initialData={profileDataOng}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}