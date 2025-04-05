import pool from "@/server/db"; // Adjust based on your DB connection

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins temporarily
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pincode } = req.query;
  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const [results] = await pool.query(
      `
      SELECT 
        po.post_office_name,
        po.pin_code,
        d.district_name,
        s.state_name
      FROM post_offices po
      JOIN districts d ON po.district_id = d.id
      JOIN states s ON d.state_id = s.id
      WHERE po.pin_code = ?
      `,
      [pincode]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "No post offices found" });
    }

    res.status(200).json([results]); // Still wrapping in [ ] if your frontend expects it
  } catch (error) {
    console.error("Error fetching post offices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
