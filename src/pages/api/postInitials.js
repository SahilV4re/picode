import pool from "@/server/db"; // Adjust the path if needed

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins temporarily
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "GET") {
    const { districtId } = req.query;

    // ✅ Validate districtId
    if (!districtId) {
      return res.status(400).json({ error: "Missing districtId parameter" });
    }

    try {
      // ✅ MySQL uses "?" instead of "$1"
      const [rows] = await pool.query(
        "SELECT id, initial FROM post_office_initials WHERE district_id = ?",
        [districtId]
      );

      return res.status(200).json(rows); // ✅ Send MySQL results
    } catch (error) {
      console.error("❌ Error fetching post offices:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}