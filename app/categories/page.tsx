 'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

interface Category {
  strCategory: string;
}

export default function CategoriesPage() {
  const { user, setUser } = useUserContext() as UserContextType;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const setFavoriteCategory = (category: string) => {
    if (user) {
      setUser({
        ...user,
        favoriteCategory: category
      });
    }
  };

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Categories</h1>
        <p>Please log in to view categories.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Recipe Categories</h1>
      
      {user.favoriteCategory && (
        <div className="text-black mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blackfont-semibold">Your favorite category: {user.favoriteCategory}</p>
          <button 
            onClick={() => setFavoriteCategory("")}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Remove favorite
          </button>
        </div>
      )}
      
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => (
            <div key={category.strCategory} className="border rounded-lg p-4 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-2">{category.strCategory}</h3>
              <div className="flex gap-2 mt-4">
                <Link 
                  href={`/categories/${category.strCategory}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                >
                  View Recipes
                </Link>
                <button 
                  onClick={() => setFavoriteCategory(category.strCategory)}
                  className={`px-3 py-1 rounded text-sm ${
                    user.favoriteCategory === category.strCategory 
                      ? "text-black bg-green-500 text-white" 
                      : "text-black bg-white hover:bg-gray-300"
                  }`}
                >
                  {user.favoriteCategory === category.strCategory ? "Favorite" : "Set as Favorite"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  