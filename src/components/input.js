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

// ✅ Replace with your Vercel backend API URL
const API_URL = "https://pincodechecker-beta.vercel.app/api";  

export function InputWithLabel() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postOffices, setPostOffices] = useState([]);
  const [initials, setInitials] = useState([]);
  const [pincodeDetails, setPincodeDetails] = useState(null);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedInitial, setSelectedInitial] = useState(null);
  const [selectedPostOffice, setSelectedPostOffice] = useState(null);

  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    postOffices: false,
    pincode: false,
  });

  // ✅ Fetch States on Mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoading((prev) => ({ ...prev, states: true }));
      try {
        const res = await fetch(`${API_URL}/states`);
        if (!res.ok) throw new Error("Failed to fetch states");
        const data = await res.json();
        setStates(data);
      } catch (error) {
        console.error("❌ Error fetching states:", error);
      } finally {
        setLoading((prev) => ({ ...prev, states: false }));
      }
    };
    fetchStates();
  }, []);

  // ✅ Fetch Districts
  useEffect(() => {
    if (!selectedState) return;
    const fetchDistricts = async () => {
      setLoading((prev) => ({ ...prev, districts: true }));
      try {
        const res = await fetch(`${API_URL}/districts?stateId=${selectedState}`);
        if (!res.ok) throw new Error("Failed to fetch districts");
        const data = await res.json();
        setDistricts(data);
        setPostOffices([]);
        setInitials([]);
      } catch (error) {
        console.error("❌ Error fetching districts:", error);
      } finally {
        setLoading((prev) => ({ ...prev, districts: false }));
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // ✅ Fetch Post Office Initials
  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchInitials = async () => {
      setLoading((prev) => ({ ...prev, postOffices: true }));
      try {
        const res = await fetch(
          `${API_URL}/postInitials?districtId=${selectedDistrict}`
        );
        if (!res.ok) throw new Error("Failed to fetch initials");
        const data = await res.json();
        setInitials(data);
        setPostOffices([]);
      } catch (error) {
        console.error("❌ Error fetching initials:", error);
      } finally {
        setLoading((prev) => ({ ...prev, postOffices: false }));
      }
    };
    fetchInitials();
  }, [selectedDistrict]);

  // ✅ Fetch Post Offices
  useEffect(() => {
    if (!selectedInitial || !selectedDistrict) return;
    const fetchPostOffices = async () => {
      setLoading((prev) => ({ ...prev, postOffices: true }));
      try {
        const res = await fetch(
          `${API_URL}/postoffices?districtId=${selectedDistrict}&initials=${selectedInitial}`
        );
        if (!res.ok) throw new Error("Failed to fetch post offices");
        const data = await res.json();
        setPostOffices(data);
      } catch (error) {
        console.error("❌ Error fetching post offices:", error);
      } finally {
        setLoading((prev) => ({ ...prev, postOffices: false }));
      }
    };
    fetchPostOffices();
  }, [selectedInitial, selectedDistrict]);

  // ✅ Fetch Pincode Details on Search
  const handleSearch = async () => {
    if (!selectedPostOffice) return;
    setLoading((prev) => ({ ...prev, pincode: true }));
    try {
      const res = await fetch(
        `${API_URL}/pincode?postOfficeId=${selectedPostOffice}`
      );
      if (!res.ok) throw new Error("Failed to fetch pincode details");
      const data = await res.json();
      setPincodeDetails(data);
    } catch (error) {
      console.error("❌ Error fetching pincode details:", error);
    } finally {
      setLoading((prev) => ({ ...prev, pincode: false }));
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
            <SelectValue
              placeholder={loading.states ? "Loading..." : "Select State"}
            />
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
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading.districts ? "Loading..." : "Select District"}
            />
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

      {/* Post Office Initials */}
      <div className="space-y-1 mb-2">
        <Label>Initials</Label>
        <Select
          onValueChange={setSelectedInitial}
          disabled={!selectedDistrict || loading.postOffices}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading.postOffices ? "Loading..." : "Select Initial"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {initials.map((initial) => (
                <SelectItem key={initial.id} value={initial.initial}>
                  {initial.initial}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <div className="flex justify-start mt-4">
        <Button
          variant="outline"
          onClick={handleSearch}
          disabled={!selectedPostOffice || loading.pincode}
          className="w-full"
        >
          {loading.pincode ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Display Pincode Details */}
      {pincodeDetails && (
        <div className="mt-4 p-4 border rounded-lg bg-white shadow-lg">
          <h2 className="text-lg font-semibold">Pincode:</h2>
          <p>{pincodeDetails.pin_code}</p>
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
