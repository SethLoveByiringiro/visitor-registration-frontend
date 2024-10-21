import {
  Calendar,
  Download,
  Edit,
  Home,
  LogOut,
  Save,
  Search,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useAuth } from "../contexts/AuthContext";
import { Visitor } from "../types/Visitor";
import {
  getAllVisitors,
  recordDeparture,
  searchVisitors,
  updateVisitor,
} from "../utils/api";

type FilterPeriod = "day" | "week" | "month" | "year";

const ReceptionistDashboard: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);

  const navigate = useNavigate();
  const { checkAuth, logout } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        logout();
        navigate("/");
      }
    };
    verifyAuth();
  }, [checkAuth, logout, navigate]);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAllVisitors();
      setVisitors(response);
    } catch (error: any) {
      console.error("Error fetching visitors:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch visitors. Please check your network connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const visitDate = new Date(visitor.visitDate);
    const startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    switch (filterPeriod) {
      case "day":
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "week":
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "month":
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
        break;
      case "year":
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
    }

    return visitDate >= startDate && visitDate <= endDate;
  });

  const displayedVisitors = filteredVisitors
    .filter((visitor) =>
      visitor.names.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by visit date and arrival time
      const dateA = new Date(`${a.visitDate}T${a.arrivalTime}`);
      const dateB = new Date(`${b.visitDate}T${b.arrivalTime}`);
      return dateA.getTime() - dateB.getTime();
    });

  const handleFilterPeriodChange = (period: FilterPeriod) => {
    setFilterPeriod(period);

    const today = new Date();
    let newSelectedDate: Date = new Date(today);

    switch (period) {
      case "day":
        // Use today's date
        break;

      case "week":
        // Set to the start of the current week (Sunday)
        newSelectedDate.setDate(today.getDate() - today.getDay());
        break;

      case "month":
        // Set to the first day of the current month
        newSelectedDate.setDate(1);
        break;

      case "year":
        // Set to January 1st of the current year
        newSelectedDate = new Date(today.getFullYear(), 0, 1);
        break;

      default:
        break;
    }

    setSelectedDate(newSelectedDate);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setFilterPeriod("day"); // Reset to day view when a specific date is selected
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.length > 2) {
      try {
        setIsLoading(true);
        const searchResults = await searchVisitors(searchValue);
        setVisitors(searchResults);
      } catch (error: any) {
        console.error("Error searching visitors:", error);
        setError(
          error.response?.data?.message ||
            "Failed to search visitors. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else if (searchValue.length === 0) {
      fetchVisitors();
    }
  };

  const handleDeparture = async (id: number) => {
    try {
      const updatedVisitor = await recordDeparture(id);
      setVisitors((prevVisitors) =>
        prevVisitors.map((visitor) =>
          visitor.id === id ? updatedVisitor : visitor
        )
      );
      setSuccessMessage("Departure recorded successfully");
    } catch (error: any) {
      console.error("Error recording departure:", error);
      setError(
        error.response?.data?.message ||
          "Failed to record departure. Please try again."
      );
    } finally {
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingVisitor(visitor);
  };

  const handleSaveEdit = async () => {
    if (!editingVisitor) return;
    try {
      const updatedVisitor = await updateVisitor(
        editingVisitor.id,
        editingVisitor
      );
      setVisitors(
        visitors.map((v) => (v.id === updatedVisitor.id ? updatedVisitor : v))
      );
      setEditingVisitor(null);
      setSuccessMessage("Visitor information updated successfully");
    } catch (error: any) {
      console.error("Error updating visitor:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update visitor. Please try again."
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingVisitor(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingVisitor((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const downloadExcel = () => {
    const headers = [
      "No.",
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
      ...displayedVisitors.map((v, index) => [
        index + 1,
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
          {["day", "week", "month", "year"].map((period) => (
            <button
              key={period}
              onClick={() => handleFilterPeriodChange(period as FilterPeriod)}
              className={`px-4 py-2 rounded ${
                filterPeriod === period
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={10}
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
                <th className="px-4 py-2 text-left">No.</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">ID Number</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Purpose</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Visit Date</th>
                <th className="px-4 py-2 text-left">Arrival Time</th>
                <th className="px-4 py-2 text-left">Departure Time</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedVisitors.map((visitor, index) => (
                <tr key={visitor.id} className="border-b hover:bg-gray-100">
                  {editingVisitor && editingVisitor.id === visitor.id ? (
                    <>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="names"
                          value={editingVisitor.names}
                          onChange={handleEditInputChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="idNumber"
                          value={editingVisitor.idNumber}
                          onChange={handleEditInputChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="phone"
                          value={editingVisitor.phone}
                          onChange={handleEditInputChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="purpose"
                          value={editingVisitor.purpose}
                          onChange={handleEditInputChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          name="departmentToVisit"
                          value={editingVisitor.departmentToVisit}
                          onChange={handleEditInputChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">{visitor.visitDate}</td>
                      <td className="px-4 py-2">{visitor.arrivalTime}</td>
                      <td className="px-4 py-2">
                        {visitor.departureTime || "Not departed"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-300 mr-2"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{index + 1}</td>
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
                        <button
                          onClick={() => handleEdit(visitor)}
                          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition duration-300 mr-2"
                        >
                          <Edit size={16} />
                        </button>
                        {!visitor.departureTime && (
                          <button
                            onClick={() => handleDeparture(visitor.id)}
                            className="bg-purple-500 text-white py-1 px-2 rounded hover:bg-purple-600 transition duration-300"
                          >
                            Record Departure
                          </button>
                        )}
                      </td>
                    </>
                  )}
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
