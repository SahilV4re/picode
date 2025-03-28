// src/pages/api/postoffices.js
import pool from "@/server/db";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins temporarily
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    const { districtId, initials } = req.query;

    // ✅ Validate districtId and initials
    if (!districtId || !initials) {
      return res.status(400).json({ error: "Both districtId and initials are required" });
    }

    try {
      // ✅ MySQL uses `?` for placeholders
      const [rows] = await pool.query(
        `SELECT id, post_office_name 
         FROM post_offices 
         WHERE district_id = ? 
         AND post_office_name LIKE ? 
         ORDER BY post_office_name`,
        [districtId, `${initials}%`] // ✅ MySQL uses `LIKE` instead of `ILIKE`
      );

      res.status(200).json(rows); // ✅ Send MySQL results
    } catch (error) {
      console.error("❌ Error fetching post offices:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
