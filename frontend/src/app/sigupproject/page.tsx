"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "../../components/footer"

export default function RegisterProjectPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [contributions, setContributions] = useState("")
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [extraImages, setExtraImages] = useState<FileList | null>(null)
  const [helpInfo, setHelpInfo] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !description || !contributions || !helpInfo) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("contributions", contributions)
    formData.append("helpInfo", helpInfo)
    if (coverImage) formData.append("coverImage", coverImage)
    if (extraImages) {
      Array.from(extraImages).forEach((file, i) => {
        formData.append(`extraImages`, file)
      })
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        alert("Projeto cadastrado com sucesso!")
        router.push("/")
      } else {
        setError("Erro ao cadastrar projeto.")
      }
    } catch (error) {
      setError("Erro ao enviar dados.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="container mx-auto text-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-20 h-20 rounded mx-auto"
            />
          </div>

          <div className="text-center">
            <h2 className="mt-6 text-4xl font-bold text-gray-900">Cadastrar Projeto Social</h2>
            <p className="mt-2 text-lg text-gray-600">
              Compartilhe sua causa e encontre apoio!
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-lg">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Nome do Projeto</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-lg font-medium text-gray-700">Descrição do Projeto</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>

              <div>
                <label htmlFor="contributions" className="block text-lg font-medium text-gray-700">
                  Como Contribuir com o projeto?
                </label>
                <input
                  id="contributions"
                  name="contributions"
                  type="text"
                  required
                  value={contributions}
                  onChange={(e) => setContributions(e.target.value)}
                  placeholder="Ex: voluntários, doações de comida, financeiras..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div>
                <label htmlFor="coverImage" className="block text-lg font-medium text-gray-700">Foto de Capa</label>
                  <input
                    type="file"
                    id="fotoCapa"
                    name="fotoCapa"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md text-lg text-gray-700 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-lg file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-blue-700"
                  />
              </div>

              <div>
                <label htmlFor="extraImages" className="block text-lg font-medium text-gray-700">Fotos Complementares</label>
                  <input
                    type="file"
                    id="fotosComplementares"
                    name="fotosComplementares"
                    multiple
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md text-lg text-gray-700 bg-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-lg file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-blue-700"
                  />
              </div>

              <div>
                <label htmlFor="helpInfo" className="block text-lg font-medium text-gray-700">Informações Adicionais</label>
                <textarea
                  id="helpInfo"
                  name="helpInfo"
                  rows={3}
                  required
                  value={helpInfo}
                  onChange={(e) => setHelpInfo(e.target.value)}
                  placeholder="Informações de contato, orientações para voluntários interessados..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Cadastrar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
