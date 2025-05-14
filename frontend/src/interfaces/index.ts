export interface User {
  id: number
  name: string
  location: string
  profileImage: string
  role?: string
}

export interface Comment {
  id: number
  description: string
  createdAt: string
  user: User
}

export interface Like {
  id: number
  user: User
}

export interface Image {
  id: number
  content: string
  caption: string
}

export interface Post {
  id: number
  description: string
  createdAt: string
  user: User
  likes: Like[]
  comments: Comment[]
  images: Image[]
  userLiked: boolean
}

export interface Ong {
    id: number
    name: string
    cnpj: string
    contact: string
    description: string
    createdAt: string
    updatedAt: string
    user: User
    images: Image[]
}

export interface Project {
    id: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
    ong: Ong[]
    images: Image[]
    post: Post[]
}
