import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVisitors = async () => {
      const response = await axios.get(
        `/api/visitors/search?name=${searchTerm}`
      );
      setVisitors(response.data);
    };
    if (searchTerm) fetchVisitors();
  }, [searchTerm]);

  const recordDeparture = async (id: number) => {
    await axios.put(`/api/visitors/${id}/departure`);
    // Handle success
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Visitor Dashboard</h2>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      <div>
        {visitors.map((visitor: any) => (
          <div key={visitor.id} className="border p-4 mb-4">
            <h3 className="text-xl">{visitor.names}</h3>
            <p>Department: {visitor.departmentToVisit}</p>
            <p>Arrival Time: {visitor.arrivalTime}</p>
            <button
              onClick={() => recordDeparture(visitor.id)}
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Record Departure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
