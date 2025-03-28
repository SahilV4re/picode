// src/api/pincodeApi.js
const API_BASE = "https://pincodechecker-beta.vercel.app";

export const fetchStates = async () => {
  const response = await fetch(`${API_BASE}/api/states`);
  return await response.json();
};

export const fetchDistricts = async (stateId) => {
  const response = await fetch(`${API_BASE}/api/districts?stateId=${stateId}`);
  return await response.json();
};

export const fetchPostInitials = async (districtId) => {
  const response = await fetch(`${API_BASE}/api/postInitials?districtId=${districtId}`);
  return await response.json();
};

export const fetchPostOffices = async (districtId, initials) => {
  const response = await fetch(
    `${API_BASE}/api/postoffices?districtId=${districtId}&initials=${initials}`
  );
  return await response.json();
};

export const fetchPincodeDetails = async (postOfficeId) => {
  const response = await fetch(`${API_BASE}/api/pincode?postOfficeId=${postOfficeId}`);
  return await response.json();
};