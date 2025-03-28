// src/pages/api/districts.js
import pool from "@/server/db";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins temporarily
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    
    const { stateId } = req.query; // Get stateId from query parameters

    try {
      // ✅ Use "?" instead of "$1" for MySQL placeholders
      const [rows] = await pool.query(
        "SELECT id, district_name FROM districts WHERE state_id = ?",
        [stateId]
      );

      res.status(200).json(rows); // ✅ Send MySQL results
    } catch (error) {
      console.error("Error fetching districts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
