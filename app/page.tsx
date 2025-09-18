'use client'
import { useState, useEffect } from "react";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";
import RecipeModal from './components/RecipeModel/RecipeModel';

interface FeaturedRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
}

export default function HomePage() {
  const { user } = useUserContext() as UserContextType;
  const [featuredRecipes, setFeaturedRecipes] = useState<FeaturedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=");
        const data = await response.json();
        setFeaturedRecipes(data.meals.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  const handleViewRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipeId(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Food Trucker</h1>
      <p className="text-lg text-white-600 mb-8">We have many foods !</p>

      {user && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl text-black font-semibold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-black">You have {user.favoriteRecipes.length} saved recipes.</p>
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Recipes</h2>
        
        {loading ? (
          <div className=" flex justify-center items-center py-12">
            <div className=" animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map(recipe => (
              <div key={recipe.idMeal} className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-green-500 text-lg font-semibold mb-2 text-gray-800">{recipe.strMeal}</h3>
                  <p className="text-sm text-white-600 mb-3 capitalize">{recipe.strCategory}</p>
                  <button
                    onClick={() => handleViewRecipe(recipe.idMeal)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
       
          
          <div className="bg-orange-500 text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Futuregames 2025</h3>
          
          </div>
      </section>

      <RecipeModal
        recipeId={selectedRecipeId || ''}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}