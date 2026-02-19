import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/node";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

const app = express();


app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", (req, res) => {
  res.json({ message: "BIDORO backend running" });
});

app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    Sentry.captureException(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.post("/orders", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert([{ user_id, product_id, quantity }]);

    if (error) throw error;

    res.json({ status: "success", data });
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ error: "Order failed" });
  }
});

app.get("/ai/recommend", (req, res) => {
  res.json({ recommendation: "Try Ankara products" });
});



export default app;