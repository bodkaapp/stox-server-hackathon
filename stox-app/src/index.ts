import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { db } from "@drizzle/db/index";
import { recipes } from "@drizzle/db/schema";

const app = new Hono();

app.get("/", (c: Context) => {
  return c.text("Hello Hono!");
});

app.post("/recipes", async (c: Context) => {
  try {
    const { userId, url } = await c.req.json<{ userId: string; url: string }>();

    if (!userId || !url) {
      return c.json({ error: "userId and url are required" }, 400);
    }

    const newRecipe = await db
      .insert(recipes)
      .values({ userId, url })
      .returning();

    return c.json(newRecipe[0], 201);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

const port = Number(process.env.PORT) || 3000;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info: { address: string; family: string; port: number }) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

export default app;
