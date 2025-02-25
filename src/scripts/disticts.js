import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../server/db.js"; // Import database connection
import dotenv from "dotenv";
dotenv.config();


const states = [
  "ANDAMAN AND NICOBAR ISLANDS",
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHANDIGARH",
  "CHHATTISGARH",
  "DADRA AND NAGAR HAVELI",
  "DAMAN AND DIU",
  "DELHI",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JAMMU AND KASHMIR",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "LAKSHADWEEP",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ORISSA",
  "PONDICHERRY",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL"
];

async function getDistricts(state) {
  try {
    const url = `https://pincode.net.in/${state.replace(/ /g, "_")}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(data);
    
    let districts = [];

    // Extract district names from the select dropdown
    $("form#district select[name='SelectURL'] option").each((_, element) => {
      const district = $(element).text().trim();
      if (district && district !== "Select District") { 
        districts.push(district);
      }
    });

    console.log(`📌 Found districts for ${state}:`, districts);
    return districts;
  } catch (error) {
    console.error(`❌ Error fetching districts for ${state}:`, error);
    return [];
  }
}

async function getStateId(stateName) {
  const res = await pool.query("SELECT id FROM states WHERE state_name = $1", [stateName]);
  if (res.rows.length > 0) return res.rows[0].id;
  
  const insertRes = await pool.query("INSERT INTO states (state_name) VALUES ($1) RETURNING id", [stateName]);
  return insertRes.rows[0].id;
}




async function insertDistricts(stateId, districts) {
  try {
    for (const district of districts) {
      await pool.query(
        "INSERT INTO districts (district_name, state_id) VALUES ($1, $2) ON CONFLICT (district_name) DO NOTHING",
        [district, stateId]
      );
    }
    console.log(`✅ Districts inserted successfully for state ID: ${stateId}`);
  } catch (error) {
    console.error("Error inserting districts:", error);
  }
}

(async () => {
  for (const state of states) {
    console.log(`🔍 Scraping districts for ${state}...`);
    const stateId = await getStateId(state);
    const districts = await getDistricts(state);
    console.log(`📌 Scraped districts for ${state}:`, districts);
    if (districts.length > 0) {
      await insertDistricts(stateId, districts);
    }
  }
  console.log("🎉 Scraping completed for all states!");
  pool.end();
})();
