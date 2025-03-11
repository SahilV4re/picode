// pages/api/pincode.js
import pool from "@/server/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { postOfficeId } = req.query;

    // ✅ Validate postOfficeId
    if (!postOfficeId) {
      return res.status(400).json({ error: "Post Office ID is required" });
    }

    try {
      // ✅ MySQL uses `?` for placeholders instead of `$1`
      const [rows] = await pool.query(
        `SELECT post_office_name, pin_code 
         FROM post_offices 
         WHERE id = ?`,
        [postOfficeId]
      );

      // ✅ Check if any records were found
      if (rows.length === 0) {
        return res.status(404).json({ error: "Post Office not found" });
      }

      res.status(200).json(rows[0]); // ✅ Send first row as response
    } catch (error) {
      console.error("❌ Error fetching pincode details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
