export default async function handler(req, res) {
    const { state, district, office } = req.query;

    // Validate query parameters
    if (!state || !district || !office) {
        return res.status(400).json({ error: "State, district, and office name are required" });
    }

    // Construct the API URL with encoded query parameters
    const API_URL = new URL('https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd');
    API_URL.searchParams.append('api-key', '579b464db66ec23bdd00000100264ede9b3c474468a3a81af1721358');
    API_URL.searchParams.append('format', 'json');
    API_URL.searchParams.append('filters[state]', state);
    API_URL.searchParams.append('filters[district]', district);
    API_URL.searchParams.append('filters[office_name]', office);

    try {
        const response = await fetch(API_URL.toString());

        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if data.records exists and is not empty
        if (!data.records || data.records.length === 0) {
            return res.status(404).json({ error: "No data found" });
        }

        // Return the records
        return res.status(200).json(data.records);
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: "Failed to fetch data" });
    }
}