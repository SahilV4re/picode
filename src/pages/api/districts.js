// src/pages/api/districts.js
import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { stateId } = req.query;
    try {
      const result = await pool.query(
        "SELECT id, district_name FROM districts WHERE state_id = $1",
        [stateId]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
