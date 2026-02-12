"use client";

import { useEffect, useState } from 'react';

type Recipe = {
  id: number;
  userId: string;
  url: string;
  createdAt: string;
};

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Loading Recipes...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-red-600 dark:text-red-400">
          Error: {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">Recipes List</h1>
      {recipes.length === 0 ? (
        <p className="text-lg text-zinc-700 dark:text-zinc-300">No recipes found.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white dark:bg-zinc-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-zinc-200 dark:bg-zinc-700 text-left text-zinc-600 dark:text-zinc-200 uppercase text-sm leading-normal">
                <th className="py-3 px-6">ID</th>
                <th className="py-3 px-6">User ID</th>
                <th className="py-3 px-6">URL</th>
                <th className="py-3 px-6">Created At</th>
              </tr>
            </thead>
            <tbody className="text-zinc-700 dark:text-zinc-300 text-sm font-light">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{recipe.id}</td>
                  <td className="py-3 px-6 text-left">{recipe.userId}</td>
                  <td className="py-3 px-6 text-left">
                    <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {recipe.url}
                    </a>
                  </td>
                  <td className="py-3 px-6 text-left">{new Date(recipe.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
