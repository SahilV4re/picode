// src/pages/api/states.js


import pool from "@/server/db"; // ✅ Import MySQL pool

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Allow all origins temporarily
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === "GET") {
        try {
            const [rows] = await pool.query("SELECT id, state_name FROM states");

            // ✅ Debugging

            res.status(200).json(rows);
        } catch (error) {
            console.error("Database Error:", error); // ✅ Log error
            res.status(500).json({ error: error.message }); // ✅ Show actual error
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

