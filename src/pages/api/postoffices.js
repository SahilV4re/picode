// src/pages/api/postoffices.js
import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { districtId, initials } = req.query;

    if (!districtId || !initials) {
      return res.status(400).json({ error: "Both districtId and initials are required" });
    }

    try {
      const result = await pool.query(
        `SELECT id, post_office_name 
         FROM post_offices 
         WHERE district_id = $1 
         AND post_office_name ILIKE $2
         ORDER BY post_office_name`,
        [districtId, `${initials}%`] // Filter by first letter
      );

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("❌ Error fetching post offices:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
