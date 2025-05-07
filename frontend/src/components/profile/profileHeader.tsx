"use client";

import { useEffect, useState } from "react"
import { GetUser } from "../../app/api/users"
import { useRouter } from "next/navigation"
import EditProfileModal, { type ProfileData } from "./editProfileModal"

export default function ProfileHeader() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        async function loadUser() {
          const userData = await GetUser()
          setUser(userData)
        }
        loadUser()
      }, [])
    
    const router = useRouter()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [profileData, setProfileData] = useState<ProfileData>({
        name: "John Doe",
        headline: "Software Developer at Tech Company",
        location: "San Francisco Bay Area",
        industry: "Information Technology",
        about:
          "Passionate software developer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Committed to creating efficient, scalable, and user-friendly applications that solve real-world problems.",
        profileImage: null,
        profileImageUrl: "/placeholder.svg?height=128&width=128",
        coverImage: null,
        coverImageUrl: "/placeholder.svg?height=400&width=1200&text=Cover",
    })
    
    const handleSaveProfile = async (updatedData: ProfileData) => {
        try {
          // Here you would typically send the data to your API
          console.log("Saving profile data:", updatedData)
    
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000))
    
          // Update local state with new data
          setProfileData(updatedData)
    
          // Show success message
          alert("Profile updated successfully!")
        } catch (error) {
          console.error("Error updating profile:", error)
          alert("Failed to update profile. Please try again.")
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
                    {user?.images?.length > 0 ? (
                        <img
                            src={user.images[0].url || "Carregando..."}
                            alt={user.name || "Carregando..."}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        "Carregando..."
                    )}
                </div>
            </div>
            <div className="pt-20">
                <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{user?.name || "Carregando..."}</h1>
                    <p className="text-lg">{user?.location || "Carregando..."}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("pt-BR", { year: "numeric", month: "long" }).replace(/^\w/, c => c.toUpperCase()) : "Carregando..."}
                    </p>
                    <div className="flex gap-2 mt-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Open to</button>
                        <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50"
                        >
                        Edit profile
                        </button>
                        <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-50">More</button>
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
                            <p className="text-xs text-gray-500 text-center">{user?.views !== undefined ? user.views : "Carregando..."}</p>
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
                            <p className="text-xs text-gray-500 text-center">{user?.connections !== undefined ? user.connections : "Carregando..."}</p>
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
