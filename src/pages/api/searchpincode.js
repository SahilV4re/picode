import pool from "@/server/db"; // Adjust based on your DB connection

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const postOffices = await pool.query(
      "SELECT * FROM post_offices WHERE pin_code = ?",
      [pincode]
    );

    if (postOffices.length === 0) {
      return res.status(404).json({ error: "No post offices found" });
    }

    res.status(200).json(postOffices);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
