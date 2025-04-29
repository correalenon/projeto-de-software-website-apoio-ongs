"use client"

import type React from "react"
import Link from "next/link"
import Cookies from 'js-cookie';
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Login } from "../../services/login";
import Footer from "../../components/footer"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }
    try {
      const data = await Login(email, password);
      Cookies.set("auth_token", data.token, { expires: 1, path: "/"});
      setTimeout(() => {
        router.push("/");
      }, 0);
    } catch (err) {
      setError("Erro no login");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="container mx-auto text-center">
            <Link href="/" className="inline-block">
              <img src="/static/logo.webp" alt="Logo" className="w-20 h-20 rounded mx-auto" />
            </Link>
          </div>
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Login Colabora</h2>
            <h4 className="mt-6 text-md font-bold text-gray-900">Website de apoio à ONGs e Projetos Sociais</h4>
            <p className="mt-2 text-sm text-gray-600">Conecte-se com ONG's e Projetos Sociais</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Senha"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Lembrar-me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Novo por aqui?{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
