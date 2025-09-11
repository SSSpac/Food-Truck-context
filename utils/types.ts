export interface UserType {
    id: string;
    name: string;
    email?: string;
    favoriteCategory: string | null;
    favoriteRecipes: string[];
}

export interface UserContextType {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}

export interface NavItem {
    name: string;
    link: string;
}