// Modelos del login

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

// Modelo de la respuesta del login
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: AuthUser;
        roles: string[];
    }
}