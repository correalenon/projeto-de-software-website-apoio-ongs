import Cookies from 'js-cookie';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
export const TOKEN = Cookies.get("auth_token") || null;
