import Header from "../../../components/header";
import ProjectHeader from "../../../components/projects/projectHeader";
import AboutSection from "../../../components/ongs/aboutOngSection";
import OngProjects from "../../../components/ongs/ongProjects";
import Footer from "../../../components/footer"

export default async function RootLayout({children, params }: { children: React.ReactNode; params: Promise<{ slug: number }> }) {
    const { slug } = await params;
    return(
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header />
        
            <main className="container px-4 py-6 mx-auto">
                {/* Profile Header */}
                < ProjectHeader id={slug} />

                {/* About Section */}
                <AboutSection id={slug} />

                {/* Projects Section */}
                {/* <OngProjects id={slug} /> */}
            </main>
            {/* Footer */}
            <Footer />
        </div>
    )
}