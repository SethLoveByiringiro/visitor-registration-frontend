import axios from "axios";
import {
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  IdCardIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VisitorRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    names: "",
    idNumber: "",
    phone: "",
    purpose: "",
    departmentToVisit: "",
    visitDate: new Date().toISOString().split("T")[0],
    arrivalTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
  });

  const departments = [
    "Human Resources",
    "Health Workforce Development",
    "Planning and Health Financing Department",
    "Permanent Secretary Office",
    "Corporate Service Department",
    "Clinical Service Department",
    "Minister's Office",
    "Digitization",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const visitorData = {
        ...formData,
        visitDate: formData.visitDate,
        arrivalTime: formData.arrivalTime,
      };
      const response = await axios.post(
        "http://localhost:8080/api/visitors/register",
        visitorData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Visitor registered:", response.data);
      // Show success message
      alert("Visitor registered successfully!");
      // Reset form
      setFormData({
        names: "",
        idNumber: "",
        phone: "",
        purpose: "",
        departmentToVisit: "",
        visitDate: new Date().toISOString().split("T")[0],
        arrivalTime: new Date().toTimeString().split(" ")[0].slice(0, 5),
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
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="^\+?[0-9]{10,14}$"
              title="Phone number must be between 10 and 14 digits"
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
              onChange={handleInputChange}
              required
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
              onChange={handleInputChange}
              required
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
