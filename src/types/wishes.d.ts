// Wish Types

export interface Wish {
    id: number;
    name: string;
    message: string;
    created_at: string;
}

export interface WishFormData {
    name: string;
    message: string;
}

export interface WishesResponse {
    wishes: Wish[];
    success: boolean;
    error?: string;
}

export interface WishSubmitResponse {
    success: boolean;
    message: string;
    wish?: Wish;
    error?: string;
}
