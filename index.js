import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

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
  res.json(data);
});

app.post("/orders", async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .insert([{ user_id, product_id, quantity }]);

  res.json({ status: "success", data });
});

app.get("/ai/recommend", (req, res) => {
  res.json({ recommendation: "Try Ankara products" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});