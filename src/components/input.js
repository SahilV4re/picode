"use client";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function InputWithLabel() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [postOffices, setPostOffices] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedPostOffice, setSelectedPostOffice] = useState(null);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      const response = await fetch("/api/states");
      const data = await response.json();
      setStates(data);
    };
    fetchStates();
  }, []);

  // Fetch districts when a state is selected
  useEffect(() => {
    if (selectedState) {
      const fetchDistricts = async () => {
        const response = await fetch(`/api/districts?stateId=${selectedState}`);
        const data = await response.json();
        setDistricts(data);
        setPostOffices([]); // Clear post offices when state changes
      };
      fetchDistricts();
    }
  }, [selectedState]);

  // Fetch post offices when a district is selected
  useEffect(() => {
    if (selectedDistrict) {
      const fetchPostOffices = async () => {
        const response = await fetch(`/api/postoffices?districtId=${selectedDistrict}`);
        const data = await response.json();
        setPostOffices(data);
      };
      fetchPostOffices();
    }
  }, [selectedDistrict]);

  const handleSearch = () => {
    console.log("State:", selectedState, "District:", selectedDistrict, "Post Office:", selectedPostOffice);
  };

  return (
    <div className="grid-col text-2xl w-full max-w-sm items-center gap-3 text-white">
      <div className="space-y-1 mb-2">
        <Label>State</Label>
        <Select onValueChange={(value) => setSelectedState(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select State" />
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

      <div className="space-y-1 mb-2">
        <Label>District</Label>
        <Select onValueChange={(value) => setSelectedDistrict(value)} disabled={!selectedState}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select District" />
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

      <div className="space-y-1 mb-2">
        <Label>Post Office Name</Label>
        <Select onValueChange={(value) => setSelectedPostOffice(value)} disabled={!selectedDistrict}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Post Office" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Post Offices</SelectLabel>
              

              {
                postOffices.map((postOffice) => (
                <SelectItem key={postOffice.id} value={postOffice.id}>
                  {postOffice.post_office_name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-start text-black mt-4">
        <Button variant="outline" onClick={handleSearch} disabled={!selectedPostOffice}>
          Search
        </Button>
      </div>
    </div>
  );
}
