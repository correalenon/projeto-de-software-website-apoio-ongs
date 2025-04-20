"use client"

import { useEffect, useState } from "react"
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

    const handlePost = async (postData: PostData) => {
      try {
        postData.userId = user.id;
        postData.projectId = 1;
       const response = PublishPost(postData);
      } catch (error) {
        throw new Error("Erro ao publicar o post");
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
                  O que você está pensando?
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

