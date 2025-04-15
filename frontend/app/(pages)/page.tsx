"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/header"
import CreatePostModal, { type PostData } from "../components/createPostModal"
import Feed from "../components/feed"
import RecentActivity from "../components/recentActivity"
import Footer from "../components/footer"
import { GetUser } from "../services/users"
import { PublishPost } from "../services/posts"

export default function HomePage() {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      const userData = await GetUser();
      setUser(userData || []);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  // Função para lidar com a publicação de posts
    const handlePost = async (postData: PostData) => {
      try {
        console.log("Enviando post para o servidor:", postData)
  
        // Aqui você implementaria a chamada real à API
        // Exemplo de como seria com fetch:
        /*
        const formData = new FormData()
        formData.append('text', postData.text)
        formData.append('hashtags', JSON.stringify(postData.hashtags))
        
        // Adicionar imagens ao FormData
        postData.images.forEach((img, index) => {
          if (img.file) {
            formData.append(`image_${index}`, img.file)
            formData.append(`caption_${index}`, img.caption)
          }
        })
        
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          throw new Error('Falha ao publicar o post')
        }
        
        const result = await response.json()
        */
       const response = PublishPost(postData);
  
        // Simulação de uma chamada de API
        await new Promise((resolve) => setTimeout(resolve, 1500))
  
        // Mostrar mensagem de sucesso
        alert("Post publicado com sucesso!")
      } catch (error) {
        console.error("Erro ao publicar post:", error)
        alert("Erro ao publicar o post. Por favor, tente novamente.")
      }
    }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />


      {/* Resto do conteúdo da página inicial permanece o mesmo */}
      {/* Conteúdo principal */}
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Profile Card */}
          <div className="md:col-span-1 h-fit bg-white rounded-lg shadow">
            <div className="p-0">
              <div className="h-16 bg-blue-600 rounded-t-lg"></div>
              <div className="flex justify-center -mt-8">
                <div className="h-16 w-16 rounded-full border-4 border-white overflow-hidden">
                  {user?.images?.length > 0 ? (
                      <img
                          src={user.images[0].url || "Carregando..."}
                          alt={user.name || "Carregando..."}
                          className="h-full w-full object-cover"
                      />
                    ) : (
                      "Carregando..."
                  )}
                  {user?.images?.length > 0 ? (
                    <CreatePostModal
                      isOpen={isPostModalOpen}
                      onClose={() => setIsPostModalOpen(false)}
                      userImage={user.images[0].url || "Carregando..."}
                      userName={user.name || "Carregando..."}
                      userTitle={user.role || "Carregando..."}
                      onPost={handlePost}
                    />
                    ) : (
                      "Carregando..."
                  )}
                </div>
              </div>
            </div>
            <div className="text-center pt-2 p-4">
              <h3 className="font-semibold text-lg">{user?.name || "Carregando..."}</h3>
              <p className="text-sm text-gray-500">{user?.role || "Carregando..."}</p>
              <div className="border-t border-b my-3 py-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Visualizações do Perfil</span>
                  <span className="font-semibold text-blue-600">{user?.views !== undefined ? user.views : "Carregando..."}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Conexões</span>
                    <span className="font-semibold text-blue-600">{user?.connections !== undefined ? user.connections : "Carregando..."}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Atividades</span>
                    <span className="font-semibold text-blue-600">{user?.activity ? user.activity.length : "Carregando..."}</span>
                </div>
              </div>
            </div>
          </div>
            {/* Modal de criação de post */}
            

          {/* Main Content */}
          <div className="md:col-span-2 space-y-4">
            {/* Post Creator */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img src="/placeholder.svg?height=40&width=40" alt="User" className="h-full w-full object-cover" />
                </div>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="w-full justify-start text-gray-500 rounded-full border border-gray-300 px-4 py-2 text-left hover:bg-gray-50"
                >
                  Start a post
                </button>
              </div>
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex items-center text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
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
                    className="h-5 w-5 mr-2 text-blue-500"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  Photo
                </button>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex items-center text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
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
                    className="h-5 w-5 mr-2 text-green-500"
                  >
                    <path d="M22 8a6 6 0 0 1-5.3 5.96l-.4.04H9.6a6.97 6.97 0 0 0-5.2 2.27l-.4.4.53-.53A7 7 0 0 1 9.6 14h6.7a8 8 0 0 0 0-16h-6.3a6 6 0 0 0 0 12h3" />
                  </svg>
                  Video
                </button>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex items-center text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
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
                    className="h-5 w-5 mr-2 text-orange-500"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                  </svg>
                  Event
                </button>
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex items-center text-gray-500 px-3 py-1 rounded hover:bg-gray-100"
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
                    className="h-5 w-5 mr-2 text-red-500"
                  >
                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                  </svg>
                  Article
                </button>
              </div>
            </div>

            {/* Feed */}
            <Feed />

          </div>

          {/* Recent Activity */}
          <RecentActivity />
          
        </div>
      </main>
      {/* Footer */}
      <Footer />  
    </div>
  )
}

