"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AdBanner from "./addbanner";

// Add this middleware before your routes

// API base URL
const API_BASE = "https://pincodechecker-beta.vercel.app";

export function InputWithLabel() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [initials, setInitials] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedInitial, setSelectedInitial] = useState(null);
  const [selectedPostOffice, setSelectedPostOffice] = useState(null);

  const [pincodeDetails, setPincodeDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ 
    states: false, 
    districts: false, 
    postOffices: false,
    search: false
  });

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(prev => ({ ...prev, states: true }));
        setError(null);
        const response = await fetch(`${API_BASE}/api/states`);
        if (!response.ok) throw new Error('Failed to fetch states');
        const data = await response.json();
        setStates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };

    fetchStates();
  }, []);

  // Fetch districts when a state is selected
  useEffect(() => {
    if (!selectedState) return;

    const fetchDistricts = async () => {
      try {
        setLoading(prev => ({ ...prev, districts: true }));
        setError(null);
        const response = await fetch(`${API_BASE}/api/districts?stateId=${selectedState}`);
        if (!response.ok) throw new Error('Failed to fetch districts');
        const data = await response.json();
        setDistricts(data);
        setPostOffices([]);
        setInitials([]);
        setSelectedDistrict(null);
        setSelectedInitial(null);
        setSelectedPostOffice(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    };

    fetchDistricts();
  }, [selectedState]);

  // Fetch post office initials when a district is selected
  useEffect(() => {
    if (!selectedDistrict) return;

    const fetchInitials = async () => {
      try {
        setLoading(prev => ({ ...prev, postOffices: true }));
        setError(null);
        const response = await fetch(`${API_BASE}/api/postInitials?districtId=${selectedDistrict}`);
        if (!response.ok) throw new Error('Failed to fetch initials');
        const data = await response.json();
        setInitials(data);
        setPostOffices([]);
        setSelectedInitial(null);
        setSelectedPostOffice(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, postOffices: false }));
      }
    };

    fetchInitials();
  }, [selectedDistrict]);

  // Fetch post offices when initials are selected
  useEffect(() => {
    if (!selectedInitial || !selectedDistrict) return;

    const fetchPostOffices = async () => {
      try {
        setLoading(prev => ({ ...prev, postOffices: true }));
        setError(null);
        const response = await fetch(
          `${API_BASE}/api/postoffices?districtId=${selectedDistrict}&initials=${selectedInitial}`
        );
        if (!response.ok) throw new Error('Failed to fetch post offices');
        const data = await response.json();
        setPostOffices(data);
        setSelectedPostOffice(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(prev => ({ ...prev, postOffices: false }));
      }
    };

    fetchPostOffices();
  }, [selectedInitial, selectedDistrict]);

  // Handle search
  const handleSearch = async () => {
    if (!selectedPostOffice) return;

    try {
      setLoading(prev => ({ ...prev, search: true }));
      setError(null);
      const response = await fetch(`${API_BASE}/api/pincode?postOfficeId=${selectedPostOffice}`);
      if (!response.ok) throw new Error('Failed to fetch pincode details');
      const data = await response.json();
      setPincodeDetails(data);
    } catch (err) {
      setError(err.message);
      setPincodeDetails(null);
    } finally {
      setLoading(prev => ({ ...prev, search: false }));
    }
  };

  return (
    <div className="grid-col text-2xl w-full max-w-sm items-center gap-3 text-black">
      {/* Error Message */}
      {error && (
        <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
          Error: {error}
        </div>
      )}

      {/* State Dropdown */}
      <div className="space-y-1 mb-2">
        <Label>State</Label>
        <Select 
          onValueChange={setSelectedState} 
          disabled={loading.states}
          value={selectedState || undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.states ? "Loading states..." : "Select State"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>States</SelectLabel>
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.state_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* District Dropdown */}
      <div className="space-y-1 mb-2">
        <Label>District</Label>
        <Select 
          onValueChange={setSelectedDistrict} 
          disabled={!selectedState || loading.districts}
          value={selectedDistrict || undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              !selectedState ? "Select state first" : 
              loading.districts ? "Loading districts..." : "Select District"
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Districts</SelectLabel>
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.district_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Post Office Initials Dropdown */}
      <div className="space-y-1 mb-2">
        <Label>Post Office Initials</Label>
        <Select 
          onValueChange={setSelectedInitial} 
          disabled={!selectedDistrict || loading.postOffices}
          value={selectedInitial || undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              !selectedDistrict ? "Select district first" : 
              loading.postOffices ? "Loading initials..." : "Select Initial"
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Initials</SelectLabel>
              {initials.map((initial) => (
                <SelectItem key={initial.id} value={initial.initial}>
                  {initial.initial}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Post Office Name Dropdown */}
      <div className="space-y-1 mb-2">
        <Label>Post Office Name</Label>
        <Select 
          onValueChange={setSelectedPostOffice} 
          disabled={!selectedInitial || loading.postOffices}
          value={selectedPostOffice || undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={
              !selectedInitial ? "Select initial first" : 
              loading.postOffices ? "Loading post offices..." : "Select Post Office"
            } />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Post Offices</SelectLabel>
              {postOffices.length > 0 ? (
                postOffices.map((postOffice) => (
                  <SelectItem key={postOffice.id} value={postOffice.id}>
                    {postOffice.post_office_name}
                  </SelectItem>
                ))
              ) : (
                <div className="text-gray-500 p-2 text-center">
                  {loading.postOffices ? "Loading..." : "No post offices found"}
                </div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-black">
        <AdBanner
          className="w-full h-[50px]"
          dataAdSlot="up"
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
        />
      </div>

      {/* Search Button */}
      <div className="flex justify-start text-black mt-4">
        <Button 
          variant="outline" 
          onClick={handleSearch} 
          disabled={!selectedPostOffice || loading.search}
          className="w-full"
        >
          {loading.search ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Display Pincode Details */}
      {pincodeDetails && (
        <div className="mt-4 p-4 border-solid border-2 border rounded-lg bg-white shadow-lg">
          <div className="text-lg grid grid-cols-2 gap-4"> 
            <div>
              <h2 className="text-lg font-semibold">State:</h2>
              <p>{states.find(s => s.id === selectedState)?.state_name || "N/A"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">District:</h2>
              <p>{districts.find(d => d.id === selectedDistrict)?.district_name || "N/A"}</p>
            </div>
          </div>
          <div className="text-lg mt-4">
            <h2 className="font-semibold">Post Office Name:</h2>
            <p>{pincodeDetails.post_office_name}</p>
          </div>
          <div className="text-lg mt-2">
            <h2 className="font-semibold">Pincode:</h2>
            <p>{pincodeDetails.pin_code}</p> 
          </div>
        </div>
      )}

      <div className="bg-black">
        <AdBanner
          className="w-full h-[50px]"
          dataAdSlot="bottom"
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
        />
      </div>
    </div>
  );
}