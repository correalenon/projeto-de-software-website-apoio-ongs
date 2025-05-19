"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ProjectProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container px-4 py-6 mx-auto">
        {/* Header do Projeto */}
        <div className="relative h-64 rounded-lg overflow-hidden shadow">
          <img
            src="/projeto-capa.jpg"
            alt="Foto de capa do projeto"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
            <h1 className="text-white text-2xl font-bold">Nome do Projeto</h1>
            <p className="text-gray-200 text-sm">Vinculado à ONG: <span className="font-semibold">Nome da ONG</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            {/* Descrição */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold mb-2">Descrição do Projeto</h2>
              <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus suscipit, orci ac sollicitudin efficitur...</p>
            </div>

            {/* Formas de contribuir */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold mb-2">Como Contribuir</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>Voluntariado</li>
                <li>Doações financeiras</li>
                <li>Doações de alimentos</li>
              </ul>
            </div>

            {/* Informações adicionais */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold mb-2">Informações Adicionais</h2>
              <p className="text-gray-700">Local de atuação: Bairro X, Cidade Y. Funcionamento aos finais de semana e feriados.</p>
            </div>

            {/* Galeria de fotos */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-semibold mb-4">Galeria</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1,2,3,4].map((img, index) => (
                  <div key={index} className="min-w-[200px] h-40 rounded overflow-hidden shadow">
                    <img
                      src={`/projeto-foto${img}.jpg`}
                      alt={`Foto ${img}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contatos principais */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-4">Contatos da ONG</h3>
              <p className="text-sm text-gray-700">Email: contato@ong.org.br</p>
              <p className="text-sm text-gray-700">WhatsApp: (11) 91234-5678</p>
              <p className="text-sm text-gray-700">Instagram: @ongsocial</p>
              <p className="text-sm text-gray-700">Endereço: Rua das Flores, 123 - Centro</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
