import axios from "axios";
import { Visitor } from "../types/Visitor";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://10.10.35.50:8080/api",
  withCredentials: false,
});

const handleError = (error: any) => {
  console.error(
    "API Error:",
    error.response ? error.response.data : error.message
  );
  throw error;
};

export const getAllVisitors = async (): Promise<Visitor[]> => {
  try {
    const response = await instance.get<Visitor[]>("/visitors");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const searchVisitors = async (name: string): Promise<Visitor[]> => {
  try {
    const response = await instance.get<Visitor[]>(
      `/visitors/search?name=${name}`
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const recordDeparture = async (id: number): Promise<Visitor> => {
  try {
    const response = await instance.put<Visitor>(`/visitors/${id}/departure`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const registerVisitor = async (visitor: Visitor): Promise<Visitor> => {
  try {
    const response = await instance.post<Visitor>(
      "/visitors/register",
      visitor
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateVisitor = async (
  id: number,
  visitorData: Partial<Visitor>
): Promise<Visitor> => {
  try {
    const response = await instance.put<Visitor>(
      `/visitors/${id}`,
      visitorData
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export default instance;
