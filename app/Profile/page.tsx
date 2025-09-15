'use client'
import { useState, useEffect } from "react";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";
import RecipeModal from '../components/RecipeModel/RecipeModel';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
}

export default function ProfilePage() {
  const { user } = useUserContext() as UserContextType;
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!user || user.favoriteRecipes.length === 0) {
        setLoading(false);
        return;
      }

      try {
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

  const handleViewRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Personal Information</h2>
        <div className="space-y-3">
          <p className="text-lg"><span className="font-semibold text-gray-700">Name:</span> {user.name}</p>
          <p className="text-lg"><span className="font-semibold text-gray-700">Email:</span> {user.email}</p>
          {user.favoriteCategory && (
            <p className="text-lg">
              <span className="font-semibold text-gray-700">Favorite Category:</span> 
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full ml-2 text-sm">
                {user.favoriteCategory}
              </span>
            </p>
          )}
          <p className="text-lg">
            <span className="font-semibold text-gray-700">Saved Recipes:</span> 
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full ml-2 text-sm">
              {user.favoriteRecipes.length}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Saved Recipes</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : savedRecipes.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">You have {savedRecipes.length} saved recipes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map(recipe => (
                <div key={recipe.idMeal} className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={recipe.strMealThumb} 
                    alt={recipe.strMeal} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{recipe.strMeal}</h3>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{recipe.strCategory}</p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleViewRecipe(recipe.idMeal)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                      >
                        View Recipe
                      </button>
                      <span className="text-xs text-gray-500">ID: {recipe.idMeal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">You haven't saved any recipes yet.</p>
            <a 
              href="/categories"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Browse Recipes
            </a>
          </div>
        )}
      </div>

      <RecipeModal
        recipeId={selectedRecipeId || ''}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}