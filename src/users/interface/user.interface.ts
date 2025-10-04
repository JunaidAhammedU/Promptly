// need to add respective interface for user
export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    role: string;
}

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface UserRegister {
    email: string;
    name: string;
    password: string;
}

export interface UserUpdate {
    email?: string;
    name?: string;
    password?: string;
    role?: string;
}