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

export function InputWithLabel() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [initials, setInitials] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedInitial, setSelectedInitial] = useState(null);
  const [selectedPostOffice, setSelectedPostOffice] = useState(null);

  // New state to hold fetched pincode details
  const [pincodeDetails, setPincodeDetails] = useState(null);

  const [loading, setLoading] = useState({ states: false, districts: false, postOffices: false });

  // Fetch states on mount
  useEffect(() => {
    setLoading((prev) => ({ ...prev, states: true }));
    fetch(`/api/states`)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .finally(() => setLoading((prev) => ({ ...prev, states: false })));
  }, []);

  // Fetch districts when a state is selected
  useEffect(() => {
    if (!selectedState) return;
    setLoading((prev) => ({ ...prev, districts: true }));
    fetch(`/api/districts?stateId=${selectedState}`)
      .then((res) => res.json())
      .then((data) => {
        setDistricts(data);
        setPostOffices([]);
        setInitials([]);
      })
      .finally(() => setLoading((prev) => ({ ...prev, districts: false })));
  }, [selectedState]);

  // Fetch post office initials when a district is selected
  useEffect(() => {
    if (!selectedDistrict) return;
    setLoading((prev) => ({ ...prev, postOffices: true }));
    fetch(`/api/postInitials?districtId=${selectedDistrict}`)
      .then((res) => res.json())
      .then((data) => {
        setInitials(data);
        setPostOffices([]);
      })
      .finally(() => setLoading((prev) => ({ ...prev, postOffices: false })));
  }, [selectedDistrict]);

  // Fetch post offices when initials are selected
  useEffect(() => {
    if (!selectedInitial || !selectedDistrict) return;
  
    console.log("Fetching post offices with:", selectedDistrict, selectedInitial);
    setLoading((prev) => ({ ...prev, postOffices: true }));
    fetch(`/api/postoffices?districtId=${selectedDistrict}&initials=${selectedInitial}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setPostOffices(data);
      })
      .catch((error) => console.error("Fetch error:", error))
      .finally(() => setLoading((prev) => ({ ...prev, postOffices: false })));
  }, [selectedInitial, selectedDistrict]);

  // When search is clicked, fetch pincode details for the selected post office
  const handleSearch = async () => {
    console.log("State:", selectedState, "District:", selectedDistrict, "Initials:", selectedInitial, "Post Office:", selectedPostOffice);
    if (!selectedPostOffice) return;
    try {
      const response = await fetch(`/api/pincode?postOfficeId=${selectedPostOffice}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setPincodeDetails(data);
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  };

  return (
    <div className="grid-col text-2xl w-full max-w-sm items-center gap-3 text-black">
      {/* State Dropdown */}
      <div className="space-y-1 mb-2">
        <Label>State</Label>
        <Select onValueChange={setSelectedState} disabled={loading.states}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.states ? "Loading..." : "Select State"} />
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
        <Select onValueChange={setSelectedDistrict} disabled={!selectedState || loading.districts}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.districts ? "Loading..." : "Select District"} />
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
        <Select onValueChange={setSelectedInitial} disabled={!selectedDistrict || loading.postOffices}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.postOffices ? "Loading..." : "Select Initial"} />
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
        <Select onValueChange={setSelectedPostOffice} disabled={!selectedInitial || loading.postOffices}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading.postOffices ? "Loading..." : "Select Post Office"} />
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
                <div className="text-gray-500 p-2 text-center">No post offices found</div>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-black">
        <AdBanner
          className="w-full h-[50px]"
          dataAdSlot="up" // Replace with your ad slot ID
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
        />
      </div>
      {/* Search Button */}
      <div className="flex justify-start text-black mt-4">
        <Button variant="outline" onClick={handleSearch} disabled={!selectedPostOffice} className="w-full">
          Search
        </Button>
      </div>

      {/* Display Pincode Details */}
      {pincodeDetails && (
        <div className="mt-4 p-4 border-solid border-2 border rounded-lg bg-white shadow-lg">
        <div className="text-lg grid grid-cols-2 gap-4"> 
          <div>
            <h2 className="text-lg font-semibold">State:</h2>
            <p>{states.find((s) => s.id === selectedState)?.state_name || "N/A"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">District:</h2>
            <p>{districts.find((d) => d.id === selectedDistrict)?.district_name || "N/A"}</p>
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
          dataAdSlot="bottom" // Replace with your ad slot ID
          dataAdFormat="auto"
          dataFullWidthResponsive={true}
        />
      </div>
    </div>
  );
}