export interface User {
    id: string;
    name: string;
    email: string;
    favoriteCategory: string;
    favoriteRecipes: string[];
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export interface NavItem {
  name: string;
  link: string;
}