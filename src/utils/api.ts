import axios from "axios";
import { Visitor } from "../types/Visitor";

// Create an Axios instance with the base URL for your backend
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Make sure this matches your backend's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to register a new visitor
export const registerVisitor = async (visitor: Visitor): Promise<Visitor> => {
  try {
    const response = await api.post<Visitor>("/visitors/register", visitor);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Function to search for visitors by name
export const searchVisitors = async (name: string): Promise<Visitor[]> => {
  try {
    const response = await api.get<Visitor[]>(`/visitors/search?name=${name}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Function to record a visitor's departure time
export const recordDeparture = async (id: number): Promise<Visitor> => {
  try {
    const response = await api.put<Visitor>(`/visitors/${id}/departure`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Function to handle and log API errors
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    console.error("API Error:", error.response.data);
  } else if (error.request) {
    // No response received from the server
    console.error("API Error: No response from server");
  } else {
    // Something else caused the error
    console.error("API Error:", error.message);
  }
};
