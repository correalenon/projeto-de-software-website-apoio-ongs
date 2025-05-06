"use client";

import { useEffect, useState } from "react"
import { GetUser, PutUser } from "../../services/users"
import { useRouter } from "next/navigation"
import EditProfileModal, { type ProfileData } from "./editProfileModal"


export default function ProfileHeader() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        headline: "",
        location: "",
        industry: "",
        profileImage: "",
        coverImage: "",
        createdAt: new Date,
        updatedAt: new Date,
        skills: []
    });
    
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await GetUser();

            if (userData) {
                setProfileData({
                    name: userData.name || "",
                    headline: userData.headline || "",
                    location: userData.location || "",
                    industry: userData.industry || "",
                    profileImage: userData.profileImage || null,
                    coverImage: userData.coverImage || null,
                    createdAt: userData.createdAt || null,
                    updatedAt: userData.updatedAt || null,
                    skills: userData.skills || []
                });
            }
        } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
        }
    }
            
    
    const handleSaveProfile = async (updatedData: ProfileData) => {
        try {
          // Chamada da API
          const updatedUser = await PutUser(updatedData);

          setProfileData(updatedUser);
          
        } catch (error) {
          alert("Falha ao atualizar dados do perfil. Tente novamente.")
        }
    }
    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="h-80 relative rounded-t-lg overflow-hidden">
                <img
                    src={profileData.coverImage || "/placeholder.svg?height=400&width=1200&text=Cover"}
                    alt="Capa do perfil"
                    className="w-full h-full object-cover"              
                />
            </div>
            <div className="relative pb-6 px-6">
            <div className="absolute -top-16 left-8">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden">
                    <img
                        src={profileData.profileImage || "Carregando..."}
                        alt={profileData.name || "Carregando..."}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
            <div className="pt-20">
                <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{profileData?.name || "Carregando..."}</h1>
                    <p className="text-lg">{profileData?.location || "Carregando..."}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString("pt-BR", { year: "numeric", month: "long" }).replace(/^\w/, c => c.toUpperCase()) : "Carregando..."}
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
                        <EditProfileModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onSave={handleSaveProfile}
                            initialData={profileData}
                        />
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}
