import { Calendar, Download, Home, LogOut, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axiosInstance from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

interface Visitor {
  id: number;
  names: string;
  idNumber: string;
  phone: string;
  purpose: string;
  arrivalTime: string;
  departureTime: string | null;
  visitDate: string;
  departmentToVisit: string;
}

type FilterPeriod = "day" | "week" | "month";

const ReceptionistDashboard: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const navigate = useNavigate();
  const { checkAuth, logout } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        logout();
      }
    };
    verifyAuth();
  }, [checkAuth, logout]);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get<Visitor[]>("/visitors");
      setVisitors(response.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      setError("Failed to fetch visitors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const visitDate = new Date(visitor.visitDate);
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);

    if (filterPeriod === "week") {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (filterPeriod === "month") {
      startDate.setDate(1);
      endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
    }

    return visitDate >= startDate && visitDate <= endDate;
  });

  const displayedVisitors = filteredVisitors.filter((visitor) =>
    visitor.names.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeparture = async (id: number) => {
    try {
      const response = await axiosInstance.put(`/visitors/${id}/departure`);
      console.log("Departure recorded:", response.data);

      if (response.data) {
        setVisitors((prevVisitors) =>
          prevVisitors.map((visitor) =>
            visitor.id === id
              ? { ...visitor, departureTime: response.data.departureTime }
              : visitor
          )
        );
        setSuccessMessage("Departure recorded successfully");
      } else {
        setError("Failed to record departure. Please try again.");
      }
    } catch (error) {
      console.error("Error recording departure:", error);
      setError("Failed to record departure. Please try again.");
    } finally {
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleFilterPeriodChange = (period: FilterPeriod) => {
    setFilterPeriod(period);
  };

  const downloadExcel = () => {
    const headers = [
      "Name",
      "ID Number",
      "Phone",
      "Purpose",
      "Department",
      "Visit Date",
      "Arrival Time",
      "Departure Time",
    ];

    const data = [
      headers,
      ...filteredVisitors.map((v) => [
        v.names,
        v.idNumber,
        v.phone,
        v.purpose,
        v.departmentToVisit,
        v.visitDate,
        v.arrivalTime,
        v.departureTime || "Not departed",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Visitors");

    // Generate and download file
    XLSX.writeFile(wb, `visitors_report_${filterPeriod}.xlsx`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Receptionist Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 flex items-center"
          >
            <Home size={20} className="mr-2" />
            Home
          </Link>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search visitors..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 flex items-center"
          >
            <LogOut size={20} className="mr-2" />
            Exit Dashboard
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap justify-between items-center">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <button
            onClick={() => handleFilterPeriodChange("day")}
            className={`px-4 py-2 rounded ${
              filterPeriod === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => handleFilterPeriodChange("week")}
            className={`px-4 py-2 rounded ${
              filterPeriod === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handleFilterPeriodChange("month")}
            className={`px-4 py-2 rounded ${
              filterPeriod === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Month
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => date && setSelectedDate(date)}
            customInput={
              <button className="bg-white border border-gray-300 rounded px-3 py-2 flex items-center">
                <Calendar size={20} className="mr-2" />
                {selectedDate.toDateString()}
              </button>
            }
          />
          <button
            onClick={downloadExcel}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 flex items-center"
          >
            <Download size={20} className="mr-2" />
            Download Excel
          </button>
        </div>
      </div>

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <p className="text-center">Loading visitors...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">ID Number</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Purpose</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Visit Date</th>
                <th className="px-4 py-2 text-left">Arrival Time</th>
                <th className="px-4 py-2 text-left">Departure Time</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedVisitors.map((visitor) => (
                <tr key={visitor.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{visitor.names}</td>
                  <td className="px-4 py-2">{visitor.idNumber}</td>
                  <td className="px-4 py-2">{visitor.phone}</td>
                  <td className="px-4 py-2">{visitor.purpose}</td>
                  <td className="px-4 py-2">{visitor.departmentToVisit}</td>
                  <td className="px-4 py-2">{visitor.visitDate}</td>
                  <td className="px-4 py-2">{visitor.arrivalTime}</td>
                  <td className="px-4 py-2">
                    {visitor.departureTime || "Not departed"}
                  </td>
                  <td className="px-4 py-2">
                    {!visitor.departureTime && (
                      <button
                        onClick={() => handleDeparture(visitor.id)}
                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-300"
                      >
                        Record Departure
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && displayedVisitors.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No visitors found.</p>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
