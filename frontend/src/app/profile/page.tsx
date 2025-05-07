import Header from "../../components/header";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileAbout from "../../components/profile/profileAbout";
import ProfileContribution from "../../components/profile/profileContribution";
import Footer from "../../components/footer"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />
      <main className="container px-4 py-6 mx-auto">
        {/* Profile Header */}
        < ProfileHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            < ProfileAbout />

            {/* Contribution Section */}
            < ProfileContribution />
          </div>

          <div className="space-y-6">
            {/* Sugestões de ONGs */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <h3 className="text-base font-medium mb-4">Sugestões de ONGs</h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "Jane Smith",
                      title: "UX Designer at Design Co",
                      img: "/placeholder.svg?height=48&width=48",
                    },
                    {
                      name: "Mike Johnson",
                      title: "Full Stack Developer at Tech Startup",
                      img: "/placeholder.svg?height=48&width=48",
                    },
                    {
                      name: "Sarah Williams",
                      title: "Product Manager at Innovation Inc",
                      img: "/placeholder.svg?height=48&width=48",
                    },
                  ].map((person, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={person.img || "/placeholder.svg"}
                          alt={person.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{person.name}</h4>
                        <p className="text-xs text-gray-500">{person.title}</p>
                        <button className="mt-2 h-8 border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-50">
                          Seguir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}

