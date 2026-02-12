import { NextRequest, NextResponse } from "next/server";
import { db } from "@drizzle/db";
import { recipes } from "@drizzle/db/schema";
import { sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    const allRecipes = await db.select().from(recipes).limit(limit).offset(offset);
    const totalRecipesResult = await db.select({ count: sql<number>`count(*)` }).from(recipes);
    const totalRecipes = totalRecipesResult[0].count;

    return NextResponse.json({
      recipes: allRecipes,
      totalRecipes,
      currentPage: page,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}
