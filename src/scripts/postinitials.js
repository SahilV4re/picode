import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../server/db.js"; // Your database connection

async function getDistrictId(districtName) {
  try {
      console.log(`🔍 Checking district ID for: ${districtName}`);
      const res = await pool.query(
          "SELECT id FROM districts WHERE district_name = $1",
          [districtName]
      );

      if (res.rows.length > 0) {
          console.log(`✅ Found district ID: ${res.rows[0].id}`);
          return res.rows[0].id;
      } else {
          console.log(`⚠️ District ${districtName} not found in DB. Inserting...`);
      }

      // Insert the district if not found
      const insertRes = await pool.query(
          "INSERT INTO districts (district_name) VALUES ($1) RETURNING id",
          [districtName]
      );
      console.log(`✅ Inserted ${districtName}, New ID: ${insertRes.rows[0].id}`);
      return insertRes.rows[0].id;
  } catch (error) {
      console.error(`❌ Error fetching district ID for ${districtName}:`, error);
      return null;
  }
}


async function getAllDistricts() {
  try {
      const res = await pool.query(`
          SELECT s.state_name, d.district_name 
          FROM districts d
          JOIN states s ON d.state_id = s.id
      `);
      return res.rows; // Return an array of objects [{ state_name, district_name }]
  } catch (error) {
      console.error("❌ Error fetching districts from database:", error);
      return [];
  }
}



async function scrapePostOfficeInitials(state, district) {
  const formattedState = encodeURIComponent(state.replace(/ /g, "_"));
  const formattedDistrict = encodeURIComponent(district.replace(/ /g, "_"));
  const url = `https://pincode.net.in/${formattedState}/${formattedDistrict}`;

  try {
      console.log(`🌐 Fetching URL: ${url}`);
      const { data } = await axios.get(url, {
          headers: { 
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
              "Referer": "https://www.google.com/"
          }
      });

      const $ = cheerio.load(data);
      let initials = [];

      $("form select[name='SelectURL'] option").each((_, element) => {
          const text = $(element).text().trim();
          if (text.length === 1 && /^[A-Z]$/.test(text)) {
              initials.push(text);
          }
      });

      console.log(`📌 Final initials for ${district}, ${state}:`, initials);
      return initials;
  } catch (error) {
      console.error(`❌ Error fetching data for ${district}, ${state}:`, error);
      return [];
  }
}




async function insertPostOfficeInitials(districtId, initials) {
  try {
      for (const initial of initials) {
          await pool.query(
              `INSERT INTO post_office_initials (district_id, initial) 
               VALUES ($1, $2) 
               ON CONFLICT (district_id, initial) DO NOTHING`,
              [districtId, initial]
          );
      }
      console.log(`✅ Inserted initials for district ID: ${districtId}`);
  } catch (error) {
      console.error("❌ Error inserting initials:", error);
  }
}


(async () => {
  const districts = await getAllDistricts();
  if (districts.length === 0) {
      console.error("⚠️ No districts found in database. Exiting...");
      return;
  }

  for (const { state_name, district_name } of districts) {  // Extract state & district
      console.log(`🔍 Scraping first alphabets for ${district_name}, ${state_name}...`);

      const districtId = await getDistrictId(district_name);
      if (!districtId) {
          console.error(`⚠️ Skipping ${district_name} due to missing ID`);
          continue;
      }

      const initials = await scrapePostOfficeInitials(state_name, district_name);
      if (initials.length > 0) {
          await insertPostOfficeInitials(districtId, initials);
      }
  }
  
  console.log("🎉 Scraping completed!");
  pool.end();
})();
