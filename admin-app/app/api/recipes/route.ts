import { NextResponse } from "next/server";
import { db } from "@drizzle/db";
import { recipes } from "@drizzle/db/schema";
// import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const allRecipes = await db.select().from(recipes);
    return NextResponse.json(allRecipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 },
    );
  }
}
