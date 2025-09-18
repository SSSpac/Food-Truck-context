'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function RecipePage() {
  const params = useParams();
  const recipeId = params.id as string;
  const { user, setUser } = useUserContext() as UserContextType;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
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

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    if (user && recipe) {
      setIsSaved(user.favoriteRecipes.includes(recipe.idMeal));
    }
  }, [user, recipe]);

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

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-8">
        <p>Recipe not found.</p>
      </div>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe];
    const measure = recipe[`strMeasure${i}` as keyof Recipe];
    
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{recipe.strMeal}</h1>
        {user && (
          <button 
            onClick={toggleSaveRecipe}
            className={`px-4 py-2 rounded ${
              isSaved ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isSaved ? "Remove from Favorites" : "Save Recipe"}
          </button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal} 
            className="w-full rounded-lg shadow-md"
          />
          
          <div className="mt-6">
            <h2 className=" text-xl font-semibold mb-3">Details</h2>
            <p><strong>Category:</strong> {recipe.strCategory}</p>
            <p><strong>Cuisine:</strong> {recipe.strArea}</p>
            
            {recipe.strYoutube && (
              <div className="mt-4">
                <a 
                  href={recipe.strYoutube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Watch on YouTube
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-black md:w-1/2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
            <ul className="list-disc list-inside">
              {ingredients.map((item, index) => (
                <li key={index}>
                  {item.measure} {item.ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-black text-xl font-semibold mb-3">Instructions</h2>
            <div className="text-blackwhitespace-pre-line">{recipe.strInstructions}</div>
          </div>
        </div>
      </div>
    </div>
  );
}