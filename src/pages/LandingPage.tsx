import { LogIn, Zap } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const registrationUrl = `${window.location.origin}/register`;

  const handleReceptionistLogin = () => {
    if (isLoading) {
      // Optional: You could show a loading indicator here
      return;
    }
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
          Welcome to MOH Visitor Registration
        </h1>
        <div className="flex justify-center mb-8">
          <div
            className="w-48 h-48 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => navigate("/register")}
            title="Click to go to registration page"
          >
            <QRCodeSVG
              value={registrationUrl}
              size={180}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={false}
            />
          </div>
        </div>
        <p className="text-gray-600 mb-8 text-center">
          Scan the QR code or click the button below to register as a visitor.
        </p>
        <div className="space-y-4">
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
            onClick={() => navigate("/register")}
          >
            <Zap size={20} className="mr-2" />
            Assistance
          </button>
          <button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
            onClick={handleReceptionistLogin}
          >
            <LogIn size={20} className="mr-2" />
            Receptionist Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
