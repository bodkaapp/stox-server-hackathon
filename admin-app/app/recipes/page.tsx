"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../AuthProvider";

type Recipe = {
  id: number;
  userId: string;
  url: string;
  createdAt: string;
};

// This component fetches and displays recipes, and handles pagination logic.
// It uses useSearchParams, so it needs to be wrapped in a Suspense boundary.
function RecipesList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const itemsPerPage = 10;

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(totalRecipes / itemsPerPage);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchRecipes() {
      if (!user) return; // Do not fetch if user is not authenticated

      setDataLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/recipes?page=${currentPage}&limit=${itemsPerPage}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data.recipes);
        setTotalRecipes(data.totalRecipes);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setDataLoading(false);
      }
    }

    fetchRecipes();
  }, [currentPage, user]); // Add user to dependency array

  if (authLoading || dataLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Loading...
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

  // Pushes a new URL to the router to change the page
  const handlePageChange = (page: number) => {
    router.push(`/recipes?page=${page}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
        レシピ一覧
      </h1>
      <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-4">
        ユーザーの入力したレシピURLの一覧です。
      </p>
      {recipes.length === 0 ? (
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          No recipes found.
        </p>
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
                <tr
                  key={recipe.id}
                  className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {recipe.id}
                  </td>
                  <td className="py-3 px-6 text-left">{recipe.userId}</td>
                  <td className="py-3 px-6 text-left">
                    <a
                      href={recipe.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {recipe.url}
                    </a>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(recipe.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={totalPages <= 1 || currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={totalPages <= 1 || currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={totalPages <= 1 || currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={totalPages <= 1 || currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// This is the main page component.
// It wraps the RecipesList component in a Suspense boundary, which is required
// when a component uses useSearchParams.
export default function RecipesPage() {
  return (
    <Suspense>
      <RecipesList />
    </Suspense>
  );
}
