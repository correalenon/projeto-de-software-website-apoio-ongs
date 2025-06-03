"use client";

import { useEffect, useState } from "react"
import EditProfileModal, { type ProfileData } from "@/components/profile/user/editProfileModalUser"
import EditPasswordModal from "@/components/profile/editPasswordModal"
import { useUser } from "@/context/userContext"
import { noProfileImageUser } from "app/images";


export default function ProfileHeaderUser() {
    const { user, setUser } = useUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditPasswordModalOpen, setIsEditPasswordModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
        async function loadUser() {
            setIsLoading(true);
            setProfileData({
                    name: user?.name || "",
                    headline: user?.headline || "",
                    location: user?.location || "",
                    industry: user?.industry || "",
                    profileImage: user?.profileImage || "",
                    coverImage: user?.coverImage || "",
                    createdAt: user?.createdAt || null,
                    updatedAt: user?.updatedAt || null,
                    skills: user?.skills || []
                });
            }
            setIsLoading(false);
        loadUser();
    }, [user]);

    const handleSaveProfile = async (updatedData: ProfileData) => {
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                body: JSON.stringify(updatedData)
            });

            const userData = await response.json();
            setProfileData(userData);
            setUser(userData);
        } catch (error) {
            alert("Falha ao atualizar dados do perfil. Tente novamente.")
        }
    }

    
    const handleSaveNewPassword = async(newPassword: string) => {
        try {
            const email = user?.email;
            const response = await fetch("/api/users/editpassword", {
                method: 'PUT',
                body: JSON.stringify({email, password: newPassword})
            });

            const data = await response.json();

            if (!data) throw new Error;
        }
        catch (error: any) {
            alert("Falha ao atualizar senha do usuário: " + error.message);
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
                        src={profileData.profileImage || noProfileImageUser}
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
                        <button 
                        onClick={() => setIsEditPasswordModal(true)}
                        className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">
                            Alterar Senha
                            </button>
                        {/* Edit Profile Modal */}
                        <EditProfileModal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            onSave={handleSaveProfile}
                            initialData={profileData}
                        />
                        <EditPasswordModal
                          isOpen={isEditPasswordModalOpen}
                          onClose={() => setIsEditPasswordModal(false)}
                          onSave={handleSaveNewPassword}
                          ></EditPasswordModal>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    )
}
