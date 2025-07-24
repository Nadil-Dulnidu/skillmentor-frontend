import { useState } from "react";
import { BookOpenIcon, UsersIcon, CalendarIcon } from "lucide-react";
import { MentorManagement } from "@/components/dashboard/MentorManagement";
import { SessionManagement } from "@/components/dashboard/SessionManagement";
import { ClassManagement } from "@/components/dashboard/ClassManagement";

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState<string>(localStorage.getItem("activeTab") || "classes");

  return (
    <div className="flex flex-col container py-10">
      <h1 className="text-4xl mb-6 font-semibold">Admin Dashboard</h1>
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium flex items-center ${activeTab === "classes" ? "custom-button-color border-b-2" : "text-gray-600 hover:text-gray-800"}`}
          onClick={() => {
            setActiveTab("classes");
            localStorage.setItem("activeTab", "classes");
          }}
        >
          <BookOpenIcon className="w-4 h-4 mr-2" />
          Classes
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center ${activeTab === "mentors" ? "custom-button-color border-b-2 " : "text-gray-600 hover:text-gray-800"}`}
          onClick={() => {
            setActiveTab("mentors");
            localStorage.setItem("activeTab", "mentors");
          }}
        >
          <UsersIcon className="w-4 h-4 mr-2" />
          Mentors
        </button>
        <button
          className={`px-4 py-2 font-medium flex items-center ${activeTab === "sessions" ? "custom-button-color border-b-2 " : "text-gray-600 hover:text-gray-800"}`}
          onClick={() => {
            setActiveTab("sessions");
            localStorage.setItem("activeTab", "sessions");
          }}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Sessions
        </button>
      </div>
      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "classes" && <ClassManagement />}
        {activeTab === "mentors" && <MentorManagement />}
        {activeTab === "sessions" && <SessionManagement />}
      </div>
    </div>
  );
};

export default AdminDashBoard;
