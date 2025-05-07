"use client";

import { useEffect, useState } from "react"
import { GetPosts } from "../app/api/posts"

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    function getDaysAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}d`;
    }
    
    
    useEffect(() => {
        async function loadPosts() {
            setIsLoading(true);
            const fetchedPosts = await GetPosts();
            const sortedPosts = (fetchedPosts || []).sort((a, b) => b.id - a.id);
            setPosts(sortedPosts);
            setIsLoading(false);
        }
        loadPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Carregando Posts...</h3>
            </div>
        );
    }

    return (
        <div>
            {posts.map((post, i) => (
                <div key={i} className="bg-white rounded-lg shadow">
                    <div className="p-4 pb-0">
                        <div className="flex justify-between">
                            <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                            {post.user.images.length > 0 && (
                                <img
                                    src={post.user.images[0].url}
                                    alt={post.user.name}
                                    className="h-full w-full object-cover"
                                />
                            )}
                            </div>
                            <div>
                                <h3 className="text-base font-medium">{post.user.name}</h3>
                                <p className="text-sm text-gray-500">{post.user.location}</p>
                                <p className="text-sm text-gray-500">{getDaysAgo(post.createdAt)} • 🌎</p>
                            </div>
                            </div>
                            <button className="rounded-full p-2 hover:bg-gray-100">
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
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                            </button>
                        </div>
                        </div>
                        <div className="p-4">
                        <p>
                            {post.description}
                        </p>
                        <div className="mt-3 rounded-lg overflow-hidden max-h-[500px] w-full">
                            {post.images.length > 0 && (
                                <img 
                                    src={post.images[0].url} 
                                    alt="Product launch" 
                                    className="w-full h-full object-cover object-center"
                                />
                            )}
                        </div>
                        </div>
                        <div className="border-t">
                        <div className="flex w-full">
                            <button className="flex-1 flex items-center justify-center py-3 hover:bg-gray-100">
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
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                            </svg>
                            Like
                            </button>
                            <button className="flex-1 flex items-center justify-center py-3 hover:bg-gray-100">
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
                            Comment
                            </button>
                            <button className="flex-1 flex items-center justify-center py-3 hover:bg-gray-100">
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
                                <path d="M12 21c-4.97-4.97-8-8-8-11a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 3-3.03 6.03-8 11z" />
                            </svg>
                            Contribuir
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
