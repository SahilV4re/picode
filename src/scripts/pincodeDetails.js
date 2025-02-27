import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../server/db.js";

async function getAllDistricts() {
  try {
    const res = await pool.query(`
      SELECT s.state_name, d.district_name, d.id AS district_id 
      FROM districts d
      JOIN states s ON d.state_id = s.id
    `);
    return res.rows;
  } catch (error) {
    console.error("❌ Error fetching districts:", error);
    return [];
  }
}

async function getPostOfficesByDistrict(districtId) {
  try {
    const res = await pool.query(
      `SELECT post_office_name FROM post_offices WHERE district_id = $1`,
      [districtId]
    );
    return res.rows.map((row) => row.post_office_name);
  } catch (error) {
    console.error(`❌ Error fetching post offices for district ID ${districtId}:`, error);
    return [];
  }
}

export const scrapePostOfficeDetails = async (state, district, postOfficeName) => {
  try {
    const formattedState = encodeURIComponent(state.replace(/ /g, "_"));
    const formattedDistrict = encodeURIComponent(district.replace(/ /g, "_"));
    const formattedPostOffice = encodeURIComponent(postOfficeName.replace(/ /g, "_"));

    const postOfficeInitial = formattedPostOffice.charAt(0).toUpperCase();
    const postOfficeURL = `https://pincode.net.in/${formattedState}/${formattedDistrict}/${postOfficeInitial}/${formattedPostOffice}`;

    console.log(`🌐 Fetching details from: ${postOfficeURL}`);
    const { data } = await axios.get(postOfficeURL);
    const $ = cheerio.load(data);

    const pinCode = $("b:contains('Pin Code:')").next("a").first().text().trim();

    return pinCode ? { postOfficeName, district, state, pinCode } : null;
  } catch (error) {
    console.error(`❌ Error fetching details for ${postOfficeName}:`, error);
    return null;
  }
};

async function insertPostOfficeDetails(details, districtId) {
  if (!details || !details.pinCode) {
    console.warn(`⚠️ Skipping ${details?.postOfficeName} due to missing pin code.`);
    return;
  }

  try {
    const query = `
      INSERT INTO post_offices (post_office_name, district_id, pin_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (post_office_name, district_id) 
      DO UPDATE SET pin_code = EXCLUDED.pin_code;
    `;

    await pool.query(query, [details.postOfficeName, districtId, details.pinCode]);
    console.log(`✅ Inserted/Updated: ${details.postOfficeName}`);
  } catch (error) {
    console.error(`❌ Error inserting ${details.postOfficeName}:`, error);
  }
}

(async () => {
  const districts = await getAllDistricts(); // Fetch all districts

  for (const { state_name, district_name, district_id } of districts) {
    console.log(`🔍 Processing district: ${district_name}, ${state_name} (ID: ${district_id})...`);
    
    if (!district_id) {
      console.warn(`⚠️ Skipping district ${district_name} due to missing ID.`);
      continue;
    }

    const postOffices = await getPostOfficesByDistrict(district_id);
    console.log(`📌 Found ${postOffices.length} post offices in ${district_name}.`);

    for (const postOffice of postOffices) {
      const details = await scrapePostOfficeDetails(state_name, district_name, postOffice);
      await insertPostOfficeDetails(details, district_id);
    }
  }

  console.log("🎯 All post office details updated successfully!");
  pool.end();
})();
