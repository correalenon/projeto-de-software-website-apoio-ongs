"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: ProfileData) => Promise<void>
  initialData: ProfileData
}

export interface ProfileData {
  name: string
  headline: string
  location: string
  industry: string
  description: string
  profileImage: File | null
  profileImageUrl: string
  coverImage: File | null
  coverImageUrl: string
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("intro")

  const modalRef = useRef<HTMLDivElement>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  // Reset form data when modal opens with initial data
  useEffect(() => {
    if (isOpen) {
      setProfileData(initialData)
    }
  }, [isOpen, initialData])

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden" // Prevent body scrolling
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto" // Restore body scrolling
    }
  }, [isOpen, onClose])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file)

      setProfileData((prev) => ({
        ...prev,
        profileImage: file,
        profileImageUrl: imageUrl,
      }))
    }
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file)

      setProfileData((prev) => ({
        ...prev,
        coverImage: file,
        coverImageUrl: imageUrl,
      }))
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await onSave(profileData)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar dados do perfil:", error)
      // You could add error handling UI here
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-lg font-medium">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-grow">
          {/* Navigation */}
          <div className="px-4 py-3 border-b">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveSection("intro")}
                className={`px-3 py-2 rounded-md ${activeSection === "intro" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Introdução
              </button>
              <button
                onClick={() => setActiveSection("description")}
                className={`px-3 py-2 rounded-md ${activeSection === "description" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Sobre
              </button>
              <button
                onClick={() => setActiveSection("images")}
                className={`px-3 py-2 rounded-md ${activeSection === "images" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Imagens
              </button>
            </div>
          </div>

          {/* Intro Section */}
          {activeSection === "intro" && (
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                  Título*
                </label>
                <input
                  id="headline"
                  name="headline"
                  type="text"
                  value={profileData.headline}
                  onChange={handleInputChange}
                  placeholder="Ex: Gerente de Marketing na Tchê Turbo"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={profileData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: São Paulo, SP"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <input
                    id="industry"
                    name="industry"
                    type="text"
                    value={profileData.industry}
                    onChange={handleInputChange}
                    placeholder="Ex: Tecnologia da Informação"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* description Section */}
          {activeSection === "description" && (
            <div className="p-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Sobre
              </label>
              <textarea
                id="description"
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Nos conte sobre você"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Você pode escrever suas experiências, seus interesses e habilidades.
              </p>
            </div>
          )}

          {/* Images Section */}
          {activeSection === "images" && (
            <div className="p-4 space-y-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de perfil</label>
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-300">
                    <img
                      src={profileData.profileImageUrl || "/placeholder.svg?height=96&width=96"}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <input
                      ref={profileImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => profileImageInputRef.current?.click()}
                      className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Mudar foto
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem de fundo</label>
                <div className="space-y-3">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                    {profileData.coverImageUrl ? (
                      <img
                        src={profileData.coverImageUrl || "/placeholder.svg"}
                        alt="Cover"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">Sem imagem de fundo</div>
                    )}
                  </div>
                  <div>
                    <input
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="hidden"
                    />
                    <button
                      onClick={() => coverImageInputRef.current?.click()}
                      className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Mudar foto de fundo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t sticky bottom-0 bg-white z-10 rounded-b-lg">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Salvando...
                </div>
              ) : (
                "Salvar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

