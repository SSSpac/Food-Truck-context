'use client'
import { useEffect, useState } from "react";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";
import Link from "next/link";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Home() {
  const { user } = useUserContext() as UserContextType;
  const API_ENDPOINT: string = "https://www.themealdb.com/api/json/v1/1/";
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryRecipes = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}filter.php?c=${user?.favoriteCategory}`);
      const data = await response.json();
      setRecipes(data.meals.slice(0, 3));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const getRandomRecipes = async () => {
    try {
      const requests = Array(3).fill(0).map(() => 
        fetch(`${API_ENDPOINT}random.php`).then(res => res.json())
      );
      
      const results = await Promise.all(requests);
      const randomRecipes = results.map(result => result.meals[0]);
      setRecipes(randomRecipes);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (user?.favoriteCategory) {
      getCategoryRecipes();
    } else {
      getRandomRecipes();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Food Trucker</h1>
        <p className="text-lg mb-4">Discover amazing recipes from around the world!</p>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Please log in to access all features</h2>
          <p className="mb-4">Once logged in, you can:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Save your favorite recipes</li>
            <li>Set your favorite food category</li>
            <li>Browse recipes by category</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
      
      {user.favoriteCategory ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recipes in your favorite category: {user.favoriteCategory}</h2>
          {loading ? (
            <p>Loading recipes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recipes.map(recipe => (
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
          )}
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Popular Recipes</h2>
          {loading ? (
            <p>Loading recipes...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recipes.map(recipe => (
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
          )}
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Saved Recipes</h2>
        {user.favoriteRecipes && user.favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user.favoriteRecipes.slice(0, 3).map(recipeId => (
              <div key={recipeId} className="border rounded-lg p-4">
                <p className="mb-2">Recipe ID: {recipeId}</p>
                <Link 
                  href={`/recipe/${recipeId}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  View Recipe
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't saved any recipes yet.</p>
        )}
        {user.favoriteRecipes && user.favoriteRecipes.length > 3 && (
          <div className="mt-4">
            <Link href="/profile" className="text-blue-500 hover:underline">
              View all saved recipes →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}