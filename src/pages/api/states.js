// src/pages/api/states.js
import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT id, state_name FROM states");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching states:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
