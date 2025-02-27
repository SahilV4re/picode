'use client'
import { useState, useEffect } from 'react';

const StateDropdown = () => {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const apiUrl = '/api/resource/5c2f62fe-5afa-4139-a499-fec9d684d5bd?api-key=579b464db66ec23bdd00000100264ede9b3c474468a3a81af1721358&format=json&filters[statename]';
        console.log('Fetching data from:', apiUrl);

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.status === "error") {
          throw new Error(`API error: ${data.message}`);
        }

        if (!data.records || data.records.length === 0) {
          console.warn('No records found in the API response.');
          return;
        }

        // Extract unique state names from the records
        const uniqueStates = [...new Set(data.records.map(record => record.statename))];
        console.log('Unique States:', uniqueStates); // Log the extracted states
        setStates(uniqueStates);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    console.log('Selected State:', event.target.value);
  };

  return (
    <select value={selectedState} onChange={handleStateChange}>
      <option value="">Select a state</option>
      {states.map(state => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
};

export default StateDropdown;