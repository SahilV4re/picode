'use client'
import { useState } from "react";

const PincodeSearch = () => {
    const [state, setState] = useState("");  // Selected state
    const [district, setDistrict] = useState("");  // Selected district
    const [office, setOffice] = useState("");  // Selected post office
    const [pincodes, setPincodes] = useState([]);  // Fetched results
    const [loading, setLoading] = useState(false);  // Loading state
    const [error, setError] = useState(null);  // Error state

    const fetchPincodes = async () => {
        if (!state || !district || !office) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const normalizedState = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
            const normalizedDistrict = district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
            const normalizedOffice = office.charAt(0).toUpperCase() + office.slice(1).toLowerCase();

            const response = await fetch(
                `https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd00000100264ede9b3c474468a3a81af1721358&format=json&filters[statename]=${encodeURIComponent(normalizedState)}&filters[district]=${encodeURIComponent(normalizedDistrict)}&filters[officename]=${encodeURIComponent(normalizedOffice)}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();

            if (!data.records || data.records.length === 0) {
                setError("No results found.");
                setPincodes([]);
            } else {
                setPincodes(data.records);
            }
        } catch (error) {
            console.error("Error fetching pincode data:", error);
            setError("An error occurred while fetching data.");
            setPincodes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Search Pincode</h2>
            <div>
                <label>State: </label>
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state"
                />
            </div>
            <div>
                <label>District: </label>
                <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Enter district"
                />
            </div>
            <div>
                <label>Post Office: </label>
                <input
                    type="text"
                    value={office}
                    onChange={(e) => setOffice(e.target.value)}
                    placeholder="Enter post office"
                />
            </div>
            <button onClick={fetchPincodes} disabled={loading}>
                {loading ? "Searching..." : "Search"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Results:</h3>
            {pincodes.length > 0 ? (
                <ul>
                    {pincodes.map((pincode, index) => (
                        <li key={index}>
                            <strong>{pincode.officename}</strong> - {pincode.pincode} ({pincode.district}, {pincode.statename})
                            <br />
                            <small>
                                Type: {pincode.officetype}, Delivery: {pincode.delivery}, Coordinates: {pincode.latitude}, {pincode.longitude}
                            </small>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No results found</p>
            )}
        </div>
    );
};

export default PincodeSearch;