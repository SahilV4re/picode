import axios from "axios";
import * as cheerio from "cheerio";
import pool from "../server/db.js"; // Import your PostgreSQL database connection

// 🔍 **Get District ID from the database (Insert if missing)**
async function getDistrictId(state, district) {
  try {
    console.log(`🔍 Checking district ID for: ${district}, ${state}`);

    // ✅ Find district ID if it exists
    const res = await pool.query(
      `SELECT id FROM districts WHERE district_name = $1`,
      [district]
    );

    if (res.rows.length > 0) {
      console.log(`✅ Found district ID: ${res.rows[0].id}`);
      return res.rows[0].id;
    }

    // ⚠️ Insert district if not found
    console.log(`⚠️ District '${district}' not found. Inserting...`);

    const insertRes = await pool.query(
      `INSERT INTO districts (district_name, state_id) 
       VALUES ($1, (SELECT id FROM states WHERE state_name = $2)) RETURNING id`,
      [district, state]
    );

    console.log(`✅ Inserted ${district}, New ID: ${insertRes.rows[0].id}`);
    return insertRes.rows[0].id;
  } catch (error) {
    console.error(`❌ Error fetching district ID for ${district}:`, error);
    return null;
  }
}

// 🔄 **Fetch all districts from the database**
async function getAllDistricts() {
  try {
    const res = await pool.query(`
      SELECT s.state_name, d.district_name 
      FROM districts d
      JOIN states s ON d.state_id = s.id
    `);
    return res.rows; // Returns [{ state_name, district_name }, ...]
  } catch (error) {
    console.error("❌ Error fetching districts:", error);
    return [];
  }
}

let finalPostOffices = []; 
// 🌐 **Scrape Post Office Names from the website**
async function scrapePostOfficesByInitial(state, district) {
  const formattedState = encodeURIComponent(state.replace(/ /g, "_"));
  const formattedDistrict = encodeURIComponent(district.replace(/ /g, "_"));
  const baseURL = `https://pincode.net.in/${formattedState}/${formattedDistrict}`;

  try {
    console.log(`🌐 Fetching first-letter categories from: ${baseURL}`);
    const { data } = await axios.get(baseURL);
    const $ = cheerio.load(data);

    let initials = [];

    // ✅ Get first-letter categories (A, B, C, etc.)
    $("select[name='SelectURL'] option").each((_, el) => {
      const letter = $(el).text().trim();
      if (letter && letter.length === 1) {
        initials.push(letter);
      }
    });

    console.log(`🔠 Found initials:`, initials);

    let allPostOffices = []; // Reset list for fresh data

    // ✅ Visit each first-letter page and extract names
    for (const letter of initials) {
      const letterURL = `${baseURL}/${letter}`;
      console.log(`🌐 Fetching post offices for letter: ${letter} -> ${letterURL}`);

      const { data: letterData } = await axios.get(letterURL);
      const $$ = cheerio.load(letterData);
      
      let postOfficesForLetter = []; // ✅ Reset this inside the loop

      $$("#po select[name='SelectURL'] option").each((_, el) => {
        const postOffice = $$(el).text().trim();
        if (postOffice && postOffice !== "Post Office Name") {
          postOfficesForLetter.push(postOffice);
        }
      });

      // ✅ Merge unique values into `allPostOffices`
      allPostOffices = [...new Set([...allPostOffices, ...postOfficesForLetter])];

      console.log(`📌 Extracted post offices for '${letter}':`, postOfficesForLetter);
    }

    // ✅ Update `finalPostOffices` at the end
    finalPostOffices = [...new Set([...finalPostOffices, ...allPostOffices])];

    return allPostOffices;
  } catch (error) {
    console.error(`❌ Error fetching post offices for ${district}, ${state}:`, error);
    return [];
  }
}
// 📥 **Insert Post Offices into Database (Efficient Batch Insertion)**
async function insertPostOffices(districtId, postOffices) {
  if (postOffices.length === 0) {
    console.log(`⚠️ No post offices found for district ID ${districtId}`);
    return;
  }

  try {
    console.log(`📝 Inserting ${postOffices.length} post offices for district ID ${districtId}`);

    // Begin transaction
    await pool.query("BEGIN");

    // Bulk insert with conflict handling
    const values = postOffices.map((name) => `(${districtId}, '${name.replace(/'/g, "''")}')`).join(", ");
    const query = `
      INSERT INTO post_offices (district_id, post_office_name) 
      VALUES ${values}
      ON CONFLICT (district_id, post_office_name) DO NOTHING;
    `;

    await pool.query(query);

    // Commit transaction
    await pool.query("COMMIT");

    console.log(`✅ Successfully inserted post offices for district ID: ${districtId}`);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Error inserting post offices:", error);
  }
}

// 🚀 **Main Function: Scrape and Insert Data**
(async () => {
  const districts = await getAllDistricts();
  if (districts.length === 0) {
    console.error("⚠️ No districts found in database. Exiting...");
    return;
  }

  for (const { state_name, district_name } of districts) {
    console.log(`🔍 Scraping post office names for ${district_name}, ${state_name}...`);

    // Get or insert the district ID
    const districtId = await getDistrictId(state_name, district_name);
    if (!districtId) {
      console.error(`⚠️ Skipping ${district_name} due to missing ID`);
      continue;
    }

    // Scrape post offices
    const postOffices = await scrapePostOfficesByInitial(state_name, district_name);

    // Insert into the database
    await insertPostOffices(districtId, postOffices);
  }

  console.log("🎉 Post office name scraping & insertion completed!");
  pool.end();
})();
