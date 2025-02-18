import pool from "@/server/db"



export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { pincode } = req.query;

  if (!pincode) {
    return res.status(400).json({ error: "Pincode is required" });
  }

  try {
    const query = `
      SELECT p.pincode, p.post_office_name, d.district_name, s.state_name
      FROM pincodes p
      JOIN districts d ON p.district_id = d.id
      JOIN states s ON d.state_id = s.id
      WHERE p.pincode = $1
    `;
    const result = await pool.query(query, [pincode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pincode not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
