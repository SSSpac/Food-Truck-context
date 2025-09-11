'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function ProfilePage() {
  const { user } = useUserContext() as UserContextType;
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user || user.favoriteRecipes.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch details for all saved recipes
        const requests = user.favoriteRecipes.map(recipeId => 
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
            .then(res => res.json())
            .then(data => data.meals[0])
        );
        
        const recipes = await Promise.all(requests);
        setSavedRecipes(recipes);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, [user]);

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
        <div className="bg-gray-100 p-6 rounded-lg">
          <p><strong>Name:</strong> {user.name}</p>
          {user.favoriteCategory && (
            <p><strong>Favorite Category:</strong> {user.favoriteCategory}</p>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Saved Recipes</h2>
        {loading ? (
          <p>Loading your saved recipes...</p>
        ) : savedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedRecipes.map(recipe => (
              <div key={recipe.idMeal} className="border rounded-lg overflow-hidden shadow-md">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{recipe.strMeal}</h3>
                  <Link 
                    href={`/recipe/${recipe.idMeal}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't saved any recipes yet.</p>
        )}
      </div>
    </div>
  );
}