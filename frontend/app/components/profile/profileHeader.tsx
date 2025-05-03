"use client";

import { useEffect, useState } from "react"
import { GetUser, PutUser } from "../../services/users"
import { useRouter } from "next/navigation"
import EditProfileModal, { type ProfileData } from "./editProfileModal"


export default function ProfileHeader() {
    const [user, setUser] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "",
        headline: "",
        location: "",
        industry: "",
        description: "",
        profileImage: null,
        profileImageUrl: "/placeholder.svg?height=128&width=128",
        coverImage: null,
        coverImageUrl: "/placeholder.svg?height=400&width=1200&text=Cover",
        createdAt: new Date,
        updatedAt: new Date,
        views: 0,
        connections: 0
    });
    useEffect(() => {
        async function loadUser() {
            try {
                const userData = await GetUser();

                if (userData) {
                    setProfileData({
                        name: userData.name || "",
                        headline: userData.headline || "",
                        location: userData.location || "",
                        industry: userData.industry || "",
                        description: userData.description || "",
                        profileImage: userData.progileImage || null,
                        profileImageUrl: userData.profileImageUrl || null,
                        coverImage: userData.coverImage || null,
                        coverImageUrl: userData.coverImageUrl || null,
                        createdAt: userData.createdAt || null,
                        updatedAt: userData.updatedAt || null,
                        views: userData.views || 0,
                        connections: userData.connections || 0,
                        skills: userData.skills || []
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
            }
            
        }
        loadUser();
    }, []);
            
    
    const handleSaveProfile = async (updatedData: ProfileData) => {
        try {
          // Chamada da API
          const updatedUser = await PutUser(updatedData);

          setProfileData(updatedUser)
          
        } catch (error) {
          alert("Falha ao atualizar dados do perfil. Tente novamente.")
        }
    }
    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 rounded-t-lg relative">
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
            </button>
            </div>
            <div className="relative pb-6 px-6">
            <div className="absolute -top-16 left-8">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden">
                    <img
                        src={profileData.profileImageUrl || "Carregando..."}
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
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Open to</button>
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
                <div className="space-y-3">
                    <div className="w-64 bg-white rounded-lg shadow border">
                    <div className="p-3">
                        <div className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=40&width=40" alt="Tech Company" className="w-10 h-10" />
                        <div>
                            <h4 className="font-medium text-sm">Visualizações no Perfil</h4>
                            <p className="text-xs text-gray-500 text-center">{profileData?.views !== undefined ? profileData.views : "Carregando..."}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="w-64 bg-white rounded-lg shadow border">
                    <div className="p-3">
                        <div className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=40&width=40" alt="University" className="w-10 h-10" />
                        <div>
                            <h4 className="font-medium text-sm">Conexões</h4>
                            <p className="text-xs text-gray-500 text-center">{profileData?.connections !== undefined ? profileData.connections : "Carregando..."}</p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}
