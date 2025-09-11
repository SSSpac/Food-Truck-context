'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        setRecipes(data.meals);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">{category} Recipes</h1>
      
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
  );
}