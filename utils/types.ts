export interface UserType {
    name: string,
    favoriteCategory: string | null,
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