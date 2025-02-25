import axios from "axios";
import * as cheerio from "cheerio";

// async function scrapePostOfficeInitials(district) {
//   const url = `https://pincode.net.in/${district.replace(/ /g, "_")}`;

//   try {
//     const { data } = await axios.get(url, {
//       headers: {
//         "User-Agent": "Mozilla/5.0"
//       }
//     });

//     const $ = cheerio.load(data);
//     let initials = [];

//     // Correcting the form ID from `pof1` to `pofl`
//     $("form#pofl select[name='SelectURL'] option").each((_, element) => {
//       const text = $(element).text().trim();
//       if (text) initials.push(text);  // Do not ignore empty value attributes
//     });

//     console.log(`📌 Found initials for ${district}:`, initials);
//     return initials;
//   } catch (error) {
//     console.error(`❌ Error fetching data for ${district}:`, error);
//     return [];
//   }
// }

// // Example usage
// scrapePostOfficeInitials("TAMIL_NADU/ARIYALUR");


let finalPostOffices = []; // Keep this global if needed

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

// Example usage
scrapePostOfficesByInitial("ANDAMAN_AND_NICOBAR_ISLANDS", "NICOBAR").then((data) =>
  console.log("✅ Final List of Post Offices:", data)
);
