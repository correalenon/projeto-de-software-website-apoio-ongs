"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "../../components/footer"
import { GetLocation, PostUser } from "../api/users"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!name || !email || !password || !passwordConfirm || !location || !role || !description) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (password !== passwordConfirm) {
      setError("As senhas não coincidem")
      return
    }

    try {
      const {status, data} = await PostUser(name, email, password, location, role, description);

      if (status === 400) {
        setError("Email já cadastrado")
        return
      }
      else 
      if (status === 500) {
        setError("Erro ao cadastrar usuário")
        return
      }
      else {
        alert("Cadastro realizado com sucesso!")
        //Redireciona para a página de login após o cadastro para gerar o token por lá
        router.push("/login");
      }
    }
    catch (error) {
      setError("Erro ao cadastrar usuário")
      return
    }

    // Cookies.set("auth_token", data.token, { expires: 1 }, { path: "/"});

    // Definir o cookie de autenticação (em uma aplicação real, isso seria feito pelo servidor)
    // document.cookie = `auth_token=dummy_token; path=/; max-age=${60 * 60 * 24 * 7}` // 7 dias

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
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Cadastro Colabora</h2>
            <h4 className="mt-6 text-md font-bold text-gray-900">Website de apoio à ONGs e Projetos Sociais</h4>
            <p className="mt-2 text-sm text-gray-600">Conecte-se com ONG's e Projetos Sociais</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow">
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nome Completo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informe o email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Localização
                </label>
                <div className="mt-1">
                  <input
                    id="location"
                    name="location"
                    type="location"
                    autoComplete="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: São Paulo, SP"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={async () => {
                      let cep = prompt("Digite o CEP da Cidade: ");

                      if (cep) {
                        // Remove caracteres não numéricos do CEP
                        cep = cep.replace(/\D/g, "");
                        //Verifica se o CEP tekm 8 dígitos
                        if (cep.length !== 8) {
                          alert("CEP inválido. O CEP deve conter 8 dígitos.");
                          return;
                        }
                        try {
                          const location = await GetLocation(cep);
                          if (!location) {
                            alert("Localização não encontrada. Verifique o CEP e tenten novamente.");
                            return;
                          }
                          else {
                            setLocation(location);
                          }
                        }
                        catch (error) {
                          alert("Erro ao buscar localização. Verifique o CEP e tente novamente.");
                        }
                      }
                    }}
                    >
                      Buscar Localização pelo CEP
                    </button>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Tipo de Usuário
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    autoComplete="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Selecione o tipo de usuário
                    </option>
                    <option value="ADVERTISER">Empresa/ONG</option>
                    <option value="VOLUNTARY">Voluntário</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    autoComplete="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Breve descrição do usuário/ONG"
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha (6 ou mais caracteres)
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informe a senha"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                  Confirmação de Senha
                </label>
                <div className="mt-1">
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirme a senha"
                  />
                </div>
              </div>

              <div className="text-sm text-center text-gray-600">
                <p>
                  Ao clicar em cadastrar-se você aceita os {" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Termos de Uso
                  </a>
                  , e {" "}
                  <a href="#" className="text-blue-600 hover:text-blue-500">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cadastrar-se
                </button>
              </div>
            </form>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Já é membro?{" "}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login
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

