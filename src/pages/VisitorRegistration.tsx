import {
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  IdCardIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import axiosInstance from "../api/axios";

const VisitorRegistration = () => {
  const navigate = useNavigate(); // Use the hook
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    names: "",
    idNumber: "",
    phone: "",
    purpose: "",
    departmentToVisit: "",
    visitDate: "",
    arrivalTime: "",
  });

  // Update date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Convert to Africa/Kigali timezone
      const kigaliTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Kigali",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);

      const [datePart, time] = kigaliTime.split(", ");
      const [month, day, year] = datePart.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      setFormData((prevData) => ({
        ...prevData,
        visitDate: formattedDate,
        arrivalTime: time,
      }));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const departments = [
    "Reception",
    "Finance",
    "HRH",
    "PBF",
    "Internal Auditor",
    "Procurement",
    "Human Resources",
    "Health Workforce Development",
    "Planning and Health Financing Department",
    "Permanent Secretary Office",
    "Corporate Service Department",
    "Clinical Service Department",
    "Minister's Office",
    "Digitization",
    "S.P.I.U",
    "CCM",
    "Internal Legal",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "idNumber") {
      // Limit ID number to 16 digits
      const limitedValue = value.slice(0, 16);
      setFormData({ ...formData, [name]: limitedValue });
    } else if (name === "phone") {
      // Limit phone number to 10 digits
      const limitedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: limitedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const now = new Date();
      const kigaliTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Kigali",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      const [datePart, timePart] = kigaliTime.split(", ");
      const [month, day, year] = datePart.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      const visitorData = {
        ...formData,
        visitDate: formattedDate,
        arrivalTime: timePart,
      };
      const response = await axiosInstance.post(
        "/visitors/register",
        visitorData
      );
      console.log("Visitor registered:", response.data);
      alert("Visitor registered successfully!");
      // Reset form
      setFormData({
        names: "",
        idNumber: "",
        phone: "",
        purpose: "",
        departmentToVisit: "",
        visitDate: new Date().toISOString().split("T")[0],
        arrivalTime: new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      // Redirect to the landing page after a short delay
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error registering visitor:", error);
      alert("Failed to register visitor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          MOH Visitor Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <UserIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="names"
              placeholder="Full Name"
              value={formData.names}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="relative">
            <IdCardIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="idNumber"
              placeholder="ID Number (16 digits)"
              value={formData.idNumber}
              onChange={handleInputChange}
              required
              pattern="\d{16}"
              title="ID number must be exactly 16 digits"
              maxLength={16}
            />
          </div>

          <div className="relative">
            <PhoneIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="tel"
              name="phone"
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="\d{10}"
              title="Phone number must be exactly 10 digits"
              maxLength={10}
            />
          </div>

          <div className="relative">
            <BriefcaseIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="purpose"
              placeholder="Purpose of Visit"
              value={formData.purpose}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="relative">
            <BuildingIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <select
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              name="departmentToVisit"
              value={formData.departmentToVisit}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Department to Visit
              </option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <CalendarIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="date"
              name="visitDate"
              value={formData.visitDate}
              readOnly
            />
          </div>

          <div className="relative">
            <ClockIcon
              className="absolute top-3 left-3 text-gray-400"
              size={20}
            />
            <input
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              readOnly
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </div>
            ) : (
              "Register Visitor"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VisitorRegistration;
