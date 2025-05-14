"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useUser } from "@/context/userContext"
import type { Comment, Post } from "@/interfaces/index"

export default function Feed({ reloadTrigger }: { reloadTrigger: number }) {
    const { user } = useUser()
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [comments, setComments] = useState<Record<number, Comment[]>>({})
    const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({})
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
    const [editCommentText, setEditCommentText] = useState("")
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
    const [showCommentInput, setShowCommentInput] = useState<Record<number, boolean>>({})
    const [visibleComments, setVisibleComments] = useState<Record<number, number>>({})
    const [hasMoreComments, setHasMoreComments] = useState<Record<number, boolean>>({})
    const commentInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

    function getDaysAgo(dateString: string): string {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays === 0) return "Hoje"
        return `${diffDays}d`
    }

    async function handleLike(postId: number) {
        if (!user) return

        const postIndex = posts.findIndex((p) => p.id === postId)
        if (postIndex === -1) return

        const post = posts[postIndex]

        if (post.userLiked) {
            try {
                const like = post.likes.find((like: any) => like.user.id === user.id)
                const res = await fetch('/api/posts/' + postId + '/likes/' + like.id, {
                    method: "DELETE",
                })

                if (res.ok) {
                    const updatedPosts = [...posts]
                    updatedPosts[postIndex] = {
                        ...post,
                        likes: post.likes.filter((like: any) => like.user.id !== user.id),
                        userLiked: false,
                    }
                    setPosts(updatedPosts)
                }
            } catch (err) {
                console.error("Erro ao descurtir:", err)
            }
        } else {
            try {
                const res = await fetch('/api/posts/' + postId + '/likes', {
                    method: "POST",
                })

                if (res.ok) {
                    const newLike = await res.json()
                    const updatedPosts = [...posts]
                    updatedPosts[postIndex] = {
                        ...post,
                        likes: [...post.likes, newLike],
                        userLiked: true,
                    }
                    setPosts(updatedPosts)
                }
            } catch (err) {
                console.error("Erro ao curtir:", err)
            }
        }
    }

    async function handleDelete(postId: number) {
        if (!confirm("Tem certeza que deseja excluir este post?")) return

        try {
            const response = await fetch('/api/posts/' + postId, {
                method: "DELETE",
            })

            if (response.ok) {
                setPosts((prev) => prev.filter((post) => post.id !== postId))
            } else {
                alert("Erro ao excluir o post.")
            }
        } catch (error) {
            console.error("Erro ao excluir o post:", error)
        }
    }

    function initializeComments(postId: number) {
        const post = posts.find((p) => p.id === postId)
        if (post && post.comments) {
            setComments((prev) => ({ ...prev, [postId]: post.comments }))

            setHasMoreComments((prev) => ({
                ...prev,
                [postId]: post.comments.length > (visibleComments[postId] || 2),
            }))
        }
    }

    function toggleComments(postId: number) {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }))

        if (!expandedComments[postId]) {
            initializeComments(postId)
            setVisibleComments((prev) => ({
                ...prev,
                [postId]: 2,
            }))
        }
    }

    function loadMoreComments(postId: number) {
        const currentVisible = visibleComments[postId] || 2
        const newVisible = currentVisible + 5

        setVisibleComments((prev) => ({
            ...prev,
            [postId]: newVisible,
        }))

        setHasMoreComments((prev) => ({
            ...prev,
            [postId]: (comments[postId]?.length || 0) > newVisible,
        }))
    }

    async function handleComment(postId: number, event?: React.FormEvent) {
        if (event) {
            event.preventDefault()
        }

        if (!event) {
            if (!expandedComments[postId]) {
                toggleComments(postId)
            }

            setShowCommentInput((prev) => ({
                ...prev,
                [postId]: true,
            }))

            setTimeout(() => {
                if (commentInputRefs.current[postId]) {
                    commentInputRefs.current[postId]?.focus()
                }
            }, 100)

            return
        }

        const text = commentDrafts[postId]
        if (!text?.trim()) return

        try {
            const res = await fetch('/api/posts/' + postId + '/comments', {
                method: "POST",
                body: JSON.stringify({ description: text }),
            })

            if (res.ok) {
                const newComment = await res.json()

                setComments((prev) => {
                    const updatedComments = [...(prev[postId] || []), newComment]
                    return { ...prev, [postId]: updatedComments }
                })

                setPosts((prev) => {
                    return prev.map((post) => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                comments: [...(post.comments || []), newComment],
                            }
                        }
                        return post
                    })
                })

                setCommentDrafts((prev) => ({ ...prev, [postId]: "" }))

                setExpandedComments((prev) => ({ ...prev, [postId]: true }))

                const currentVisible = visibleComments[postId] || 2
                const updatedCommentsLength = (comments[postId]?.length || 0) + 1
                if (currentVisible < updatedCommentsLength) {
                    setVisibleComments((prev) => ({
                        ...prev,
                        [postId]: currentVisible + 1,
                    }))
                }

                setHasMoreComments((prev) => ({
                    ...prev,
                    [postId]: updatedCommentsLength > (visibleComments[postId] || 2),
                }))
            }
        } catch (err) {
            console.error("Erro ao comentar:", err)
        }
    }

    function startEditComment(comment: Comment) {
        setEditingCommentId(comment.id)
        setEditCommentText(comment.description)
    }

    async function handleEditComment(postId: number, commentId: number) {
        if (!editCommentText.trim()) return

        try {
            const res = await fetch('/api/posts/' + postId + '/comments/' + commentId, {
                method: "PUT",
                body: JSON.stringify({ description: editCommentText }),
            });

            if (res.ok) {
                const updatedComment = await res.json()

                setComments((prev) => {
                    const updatedComments = prev[postId].map((comment) => (comment.id === commentId ? updatedComment : comment))
                    return { ...prev, [postId]: updatedComments }
                })

                setPosts((prev) => {
                    return prev.map((post) => {
                        if (post.id === postId) {
                        return {
                            ...post,
                            comments: post.comments.map((comment) => (comment.id === commentId ? updatedComment : comment)),
                        }
                        }
                        return post
                    })
                })

                setEditingCommentId(null)
            }
        } catch (err) {
            console.error("Erro ao editar comentário:", err)
        }
    }

    async function handleDeleteComment(postId: number, commentId: number) {
        if (!confirm("Tem certeza que deseja excluir este comentário?")) return

        try {
            const res = await fetch('/api/posts/' + postId + '/comments/' + commentId, { 
                method: "DELETE" 
            });
            if (res.ok) {
                setComments((prev) => {
                    const updatedComments = prev[postId].filter((comment) => comment.id !== commentId)
                    return { ...prev, [postId]: updatedComments }
                })

                setPosts((prev) => {
                    return prev.map((post) => {
                        if (post.id === postId) {
                            return {
                                ...post,
                                comments: post.comments.filter((comment) => comment.id !== commentId),
                            }
                        }
                        return post
                    })
                })

                const updatedCommentsLength = (comments[postId]?.length || 0) - 1
                setHasMoreComments((prev) => ({
                    ...prev,
                    [postId]: updatedCommentsLength > (visibleComments[postId] || 2),
                }))
            }
        } catch (err) {
            console.error("Erro ao excluir comentário:", err)
        }
    }

    useEffect(() => {
        async function loadPosts() {
            setIsLoading(true)
            try {
                const response = await fetch('/api/posts', {
                    method: "GET",
                })

                if (response.ok) {
                    const fetchedPosts = await response.json()
                    const sortedPosts = (fetchedPosts || [])
                        .sort((a: Post, b: Post) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((post: any) => ({
                            ...post,
                            userLiked: post.likes.some((like: any) => like.user.id === user?.id),
                        }))

                    setPosts(sortedPosts)

                    const initialCommentDrafts: Record<number, string> = {}
                    const initialExpandedComments: Record<number, boolean> = {}
                    const initialShowCommentInput: Record<number, boolean> = {}
                    const initialVisibleComments: Record<number, number> = {}
                    const initialHasMoreComments: Record<number, boolean> = {}
                    const initialComments: Record<number, Comment[]> = {}

                    sortedPosts.forEach((post: Post) => {
                        initialCommentDrafts[post.id] = ""
                        initialExpandedComments[post.id] = false
                        initialShowCommentInput[post.id] = false
                        initialVisibleComments[post.id] = 2
                        initialHasMoreComments[post.id] = (post.comments?.length || 0) > 2
                        initialComments[post.id] = post.comments || []
                    })

                    setCommentDrafts(initialCommentDrafts)
                    setExpandedComments(initialExpandedComments)
                    setShowCommentInput(initialShowCommentInput)
                    setVisibleComments(initialVisibleComments)
                    setHasMoreComments(initialHasMoreComments)
                    setComments(initialComments)
                }
            } catch (error) {
                console.error("Erro ao carregar posts:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (user?.id) {
            loadPosts()
        }
    }, [user?.id, reloadTrigger])

    if (isLoading) {
        return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-base font-medium mb-4">Carregando Posts...</h3>
        </div>
        )
    }

    return (
        <div className="space-y-4">
        {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow">
            {/* Cabeçalho do post */}
            <div className="p-2 pb-0">
                <div className="flex justify-between">
                <div className="flex gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                    {post.user.profileImage ? (
                        <img
                        src={post.user.profileImage || "/placeholder.svg"}
                        alt={post.user.name}
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">{post.user.name.charAt(0)}</span>
                        </div>
                    )}
                    </div>
                    <div>
                    <h3 className="text-base font-medium">{post.user.name}</h3>
                    <p className="text-sm text-gray-500">{post.user.location || post.user.role}</p>
                    <p className="text-sm text-gray-500">{getDaysAgo(post.createdAt)} • 🌎</p>
                    </div>
                </div>
                {user?.id === post.user.id && (
                    <button
                    className="rounded-full p-2 hover:bg-gray-100"
                    onClick={() => handleDelete(post.id)}
                    aria-label="Excluir post"
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
                        className="h-5 w-5"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    </button>
                )}
                </div>
            </div>

            {/* Conteúdo do post */}
            <div className="p-2">
                <p className="whitespace-pre-line">{post.description}</p>

                {post.images.length > 0 && (
                    <div className="mt-3 rounded-lg overflow-hidden max-h-[500px] w-full">
                        <img
                        src={post.images[0].content}
                        alt={post.images[0].caption}
                        className="w-full h-full object-cover object-center"
                        />
                    </div>
                )}

                {/* Contador de curtidas e comentários */}
                <div className="mt-3 flex justify-between items-center text-sm text-gray-500 border-b pb-2">
                {post.likes.length > 0 && (
                    <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-blue-500 mr-1"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {post.likes.length} {post.likes.length === 1 ? "curtida" : "curtidas"}
                    </div>
                )}

                {comments[post.id]?.length > 0 && (
                    <button onClick={() => toggleComments(post.id)} className="text-gray-500 hover:text-gray-700">
                    {comments[post.id].length} {comments[post.id].length === 1 ? "comentário" : "comentários"}
                    </button>
                )}
                </div>
            </div>

            {/* Botões de ação */}
            <div className="flex w-full border-b">
                <button
                className={`flex-1 flex items-center justify-center py-3 hover:bg-gray-100 transition duration-200 ${post.userLiked ? "text-blue-600 font-semibold" : "text-gray-600"}`}
                onClick={() => handleLike(post.id)}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={post.userLiked ? "currentColor" : "none"}
                    stroke={post.userLiked ? "currentColor" : "currentColor"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-5 w-5 mr-2 transition-transform duration-200 ${post.userLiked ? "scale-110 text-blue-600" : ""}`}
                >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                {post.userLiked ? "Curtido" : "Curtir"}
                </button>

                <button
                className="flex-1 flex items-center justify-center py-3 hover:bg-gray-100"
                onClick={() => handleComment(post.id)}
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
                    className="h-5 w-5 mr-2"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Comentar
                </button>
            </div>

            {/* Área de comentários */}
            <div className="px-4 py-2">
                {/* Input de comentário */}
                {showCommentInput[post.id] && (
                <form className="flex items-start gap-2 mb-3" onSubmit={(e) => handleComment(post.id, e)}>
                    <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                    {user?.profileImage ? (
                        <img
                        src={post.user.profileImage || "/placeholder.svg"}
                        alt={user.name || ""}
                        className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">{user?.name?.charAt(0) || "U"}</span>
                        </div>
                    )}
                    </div>
                    <div className="flex-grow relative">
                    <input
                        ref={(el) => (commentInputRefs.current[post.id] = el)}
                        type="text"
                        value={commentDrafts[post.id] || ""}
                        onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Adicione um comentário..."
                        className="w-full border border-gray-300 rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!commentDrafts[post.id]?.trim()}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 disabled:text-gray-400"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <path d="M22 2L11 13" />
                        <path d="m22 2-7 20-4-9-9-4 20-7z" />
                        </svg>
                    </button>
                    </div>
                </form>
                )}

                {/* Lista de comentários */}
                {expandedComments[post.id] && comments[post.id]?.length > 0 && (
                <div className="space-y-3 mt-2">
                    {comments[post.id].slice(0, visibleComments[post.id] || 2).map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                        {comment.user.profileImage ? (
                            <img
                            src={comment.user.profileImage || "/placeholder.svg"}
                            alt={comment.user.name}
                            className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">{comment.user.name.charAt(0)}</span>
                            </div>
                        )}
                        </div>

                        <div className="flex-grow">
                        {editingCommentId === comment.id ? (
                            <div className="bg-gray-100 rounded-lg p-3">
                            <input
                                type="text"
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full border border-gray-300 rounded py-1 px-2 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                onClick={() => setEditingCommentId(null)}
                                className="text-gray-500 text-sm hover:text-gray-700"
                                >
                                Cancelar
                                </button>
                                <button
                                onClick={() => handleEditComment(post.id, comment.id)}
                                className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                Atualizar
                                </button>
                            </div>
                            </div>
                        ) : (
                            <div className="bg-gray-100 rounded-lg p-3 relative group">
                            <div className="flex justify-between">
                                <h4 className="font-medium text-sm">{comment.user.name}</h4>
                                {user?.id === comment.user.id && (
                                <div className="hidden group-hover:flex gap-1">
                                    <button
                                    onClick={() => startEditComment(comment)}
                                    className="text-gray-500 hover:text-gray-700"
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
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                    className="text-gray-500 hover:text-red-500"
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
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                    </button>
                                </div>
                                )}
                            </div>
                            <p className="text-sm mt-1">{comment.description}</p>
                            </div>
                        )}
                        </div>
                    </div>
                    ))}

                    {/* Botão "Exibir mais" */}
                    {hasMoreComments[post.id] && (
                    <button
                        onClick={() => loadMoreComments(post.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 flex items-center"
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                        </svg>
                        Exibir mais comentários
                    </button>
                    )}
                </div>
                )}

                {/* Botão para mostrar mais comentários */}
                {comments[post.id]?.length > 0 && !expandedComments[post.id] && (
                <button
                    onClick={() => toggleComments(post.id)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium mt-2 flex items-center"
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
                    <polyline points="18 15 12 9 6 15" />
                    </svg>
                    Ver {comments[post.id].length} {comments[post.id].length === 1 ? "comentário" : "comentários"}
                </button>
                )}

                {/* Botão para esconder comentários */}
                {comments[post.id]?.length > 0 && expandedComments[post.id] && (
                <button
                    onClick={() => toggleComments(post.id)}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium mt-2 flex items-center"
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
                    <polyline points="6 9 12 15 18 9" />
                    </svg>
                    Esconder comentários
                </button>
                )}
            </div>
            </div>
        ))}

        {posts.length === 0 && !isLoading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum post encontrado</h3>
            <p className="text-gray-500">Seja o primeiro a compartilhar algo com sua rede!</p>
            </div>
        )}
        </div>
    )
}
