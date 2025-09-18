'use client'
import { useState, useEffect } from "react";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
}

interface RecipeModalProps {
  recipeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeModal({ recipeId, isOpen, onClose }: RecipeModalProps) {
  const { user, setUser } = useUserContext() as UserContextType;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen && recipeId) {
      fetchRecipe();
    }
  }, [isOpen, recipeId]);

  useEffect(() => {
    if (user && recipe) {
      setIsSaved(user.favoriteRecipes.includes(recipe.idMeal));
    }
  }, [user, recipe]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
      const data = await response.json();
      setRecipe(data.meals[0]);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = () => {
    if (!user || !recipe) return;

    let updatedFavorites;
    
    if (isSaved) {
      updatedFavorites = user.favoriteRecipes.filter(id => id !== recipe.idMeal);
    } else {
      updatedFavorites = [...user.favoriteRecipes, recipe.idMeal];
    }

    setUser({
      ...user,
      favoriteRecipes: updatedFavorites
    });
    
    setIsSaved(!isSaved);
  };

  if (!isOpen) return null;

  const ingredients = [];
  if (recipe) {
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
      const measure = recipe[`strMeasure${i}` as keyof Recipe];
      
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({ ingredient, measure });
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-black text-2xl font-bold">
              {loading ? "Loading..." : recipe?.strMeal}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : recipe ? (
            <div className="text-black flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal} 
                  className="text-black w-full rounded-lg shadow-md"
                />
                
                <div className="text-black mt-4">
                  <h3 className="text-black text-lg font-semibold mb-2">Details</h3>
                  <p><strong>Category:</strong> {recipe.strCategory}</p>
                  <p><strong>Cuisine:</strong> {recipe.strArea}</p>
                  
                  {user && (
                    <button 
                      onClick={toggleSaveRecipe}
                      className={`mt-4 px-4 py-2 rounded ${
                        isSaved ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {isSaved ? "Remove from Favorites" : "Save Recipe"}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="mb-6">
                  <h3 className="text-black text-lg font-semibold mb-2">Ingredients</h3>
                  <ul className="text-black list-disc list-inside pl-4">
                    {ingredients.map((item, index) => (
                      <li key={index} className="mb-1">
                        <strong>{item.measure}</strong> {item.ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-black text-lg font-semibold mb-2">Instructions</h3>
                  <div className="text-black whitespace-pre-line text-sm">
                    {recipe.strInstructions}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Recipe not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}