"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  userImage: string
  userName: string
  userTitle: string
  onPost: (postData: PostData) => Promise<void>
}

export interface PostData {
  text: string
  hashtags: string[]
  images: {
    file: File | null
    caption: string
  }[]
}

interface ImageWithCaption {
  file: File | null
  preview: string
  caption: string
}

export default function CreatePostModal({
  isOpen,
  onClose,
  userImage,
  userName,
  userTitle,
  onPost,
}: CreatePostModalProps) {
  const [postText, setPostText] = useState("")
  const [images, setImages] = useState<ImageWithCaption[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState("")
  const [isHashtagInputVisible, setIsHashtagInputVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const hashtagInputRef = useRef<HTMLInputElement>(null)
  const captionInputRef = useRef<HTMLInputElement>(null)

  // Fechar o modal ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden" // Impedir rolagem do body
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto" // Restaurar rolagem do body
    }
  }, [isOpen, onClose])

  // Focar no textarea quando o modal abrir
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  // Focar no input de hashtag quando ele se tornar visível
  useEffect(() => {
    if (isHashtagInputVisible && hashtagInputRef.current) {
      hashtagInputRef.current.focus()
    }
  }, [isHashtagInputVisible])

  // Focar no input de legenda quando começar a editar
  useEffect(() => {
    if (editingImageIndex !== null && captionInputRef.current) {
      captionInputRef.current.focus()
    }
  }, [editingImageIndex])

  // Limpar recursos quando o componente for desmontado
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }
  }, [images])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)

      // Filtrar apenas imagens
      const imageFiles = filesArray.filter((file) => file.type.startsWith("image/"))

      const newImages = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        caption: "",
      }))

      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      // Revogar URL do objeto para evitar vazamento de memória
      if (newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview)
      }
      newImages.splice(index, 1)
      return newImages
    })

    if (editingImageIndex === index) {
      setEditingImageIndex(null)
    }
  }

  const addHashtag = () => {
    if (newHashtag.trim()) {
      // Remover o # se o usuário já o incluiu
      const tag = newHashtag.trim().startsWith("#") ? newHashtag.trim() : `#${newHashtag.trim()}`

      // Adicionar apenas se não existir já
      if (!hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag])
      }

      setNewHashtag("")
    }
    setIsHashtagInputVisible(false)
  }

  const removeHashtag = (index: number) => {
    setHashtags((prev) => prev.filter((_, i) => i !== index))
  }

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addHashtag()
    } else if (e.key === "Escape") {
      setIsHashtagInputVisible(false)
      setNewHashtag("")
    }
  }

  const updateImageCaption = (index: number, caption: string) => {
    setImages((prev) => {
      const newImages = [...prev]
      newImages[index].caption = caption
      return newImages
    })
  }

  const fixImageCaption = (index: number) => {
    // Confirmar a legenda e sair do modo de edição
    setEditingImageIndex(null)
  }

  const handleSubmit = async () => {
    if (!postText.trim() && images.length === 0) return

    setIsSubmitting(true)

    try {
      // Preparar dados para envio
      const postData: PostData = {
        text: postText,
        hashtags,
        images: images.map((img) => ({
          file: img.file,
          caption: img.caption,
        })),
      }

      // Chamar a função externa para postar
      await onPost(postData)

      // Limpar e fechar o modal após sucesso
      setPostText("")
      setHashtags([])
      setImages([])
      onClose()
    } catch (error) {
      console.error("Erro ao enviar post:", error)
      // Aqui você poderia mostrar uma mensagem de erro
    } finally {
      setIsSubmitting(false)
    }
  }

  // Inserir hashtags no texto
  const insertHashtagsInText = () => {
    if (hashtags.length > 0) {
      const hashtagsText = hashtags.join(" ") + " "
      setPostText((prev) => {
        if (prev.trim().endsWith(hashtagsText.trim())) {
          return prev
        }
        return prev + (prev && !prev.endsWith(" ") ? " " : "") + hashtagsText
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg w-full max-w-xl shadow-xl">
        {/* Cabeçalho do modal */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Create a post</h2>
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

        {/* Informações do usuário */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img src={userImage || "/placeholder.svg"} alt={userName} className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-medium">{userName}</h3>
              <button className="flex items-center gap-1 text-sm border border-gray-300 rounded-full px-3 py-1 mt-1 hover:bg-gray-100">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
                Anyone{" "}
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
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Área de texto do post */}
        <div className="px-4 pb-3">
          <textarea
            ref={textareaRef}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full min-h-[120px] text-base resize-none border-none focus:ring-0 focus:outline-none"
          />

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {hashtags.map((tag, index) => (
                <div key={index} className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button
                    onClick={() => removeHashtag(index)}
                    className="ml-1 text-blue-400 hover:text-blue-700"
                    aria-label="Remove hashtag"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
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
              ))}
            </div>
          )}

          {/* Input para adicionar hashtag */}
          {isHashtagInputVisible && (
            <div className="mb-3 flex">
              <input
                ref={hashtagInputRef}
                type="text"
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                onBlur={addHashtag}
                placeholder="Add a hashtag"
                className="flex-grow border border-gray-300 rounded-l-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={addHashtag} className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700">
                Add
              </button>
            </div>
          )}

          {/* Previews de imagens */}
          {images.length > 0 && (
            <div className="space-y-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={`Preview ${index}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => setEditingImageIndex(editingImageIndex === index ? null : index)}
                        className="bg-gray-800 bg-opacity-70 text-white rounded-full p-1.5 hover:bg-opacity-100"
                        aria-label="Edit image caption"
                      >
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
                      <button
                        onClick={() => removeImage(index)}
                        className="bg-gray-800 bg-opacity-70 text-white rounded-full p-1.5 hover:bg-opacity-100"
                        aria-label="Remove image"
                      >
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
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Campo para adicionar legenda à imagem */}
                  {editingImageIndex === index && (
                    <div className="p-3 bg-gray-50">
                      <label
                        htmlFor={`image-caption-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Add a caption to this image
                      </label>
                      <div className="flex">
                        <input
                          ref={captionInputRef}
                          id={`image-caption-${index}`}
                          type="text"
                          value={image.caption}
                          onChange={(e) => updateImageCaption(index, e.target.value)}
                          placeholder="What's this image about?"
                          className="flex-grow border border-gray-300 rounded-l-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => fixImageCaption(index)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-r-md hover:bg-blue-700 flex items-center"
                        >
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
                            className="mr-1"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Fix
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mostrar a legenda se existir e não estiver editando */}
                  {image.caption && editingImageIndex !== index && (
                    <div className="p-3 bg-gray-50">
                      <p className="text-sm text-gray-700">{image.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hashtags e menções */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsHashtagInputVisible(!isHashtagInputVisible)
                if (isHashtagInputVisible) {
                  setNewHashtag("")
                }
              }}
              className="text-blue-600 font-medium hover:bg-blue-50 rounded-md px-3 py-1.5 flex items-center"
            >
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
                className="mr-1"
              >
                <path d="M4 9h16" />
                <path d="M4 15h16" />
                <path d="M10 3 8 21" />
                <path d="M16 3l-2 18" />
              </svg>
              Add hashtag
            </button>

            {hashtags.length > 0 && (
              <button
                onClick={insertHashtagsInText}
                className="text-blue-600 font-medium hover:bg-blue-50 rounded-md px-3 py-1.5 flex items-center"
              >
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
                  className="mr-1"
                >
                  <path d="m3 15 5-5c1-1 2.1-1 3 0l5 5" />
                  <path d="m11 15 5-5c1-1 2.1-1 3 0l5 5" />
                  <path d="M3 9h18" />
                </svg>
                Insert hashtags in text
              </button>
            )}
          </div>
        </div>

        {/* Barra de ferramentas */}
        <div className="px-4 py-3 border-t flex justify-between items-center">
          <div className="flex space-x-4">
            {/* Botão de imagem - apenas imagens são permitidas */}
            <label className="cursor-pointer text-gray-500 hover:bg-gray-100 p-2 rounded-full">
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
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
                className="text-blue-500"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </label>
          </div>

          {/* Botão de publicar */}
          <button
            onClick={handleSubmit}
            disabled={(!postText.trim() && images.length === 0) || isSubmitting}
            className={`px-4 py-1.5 rounded-full font-medium flex items-center ${
              (!postText.trim() && images.length === 0) || isSubmitting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Posting...
              </>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

