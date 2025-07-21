import { BACKEND_URL } from "@/config/env";
import { FullSession } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { SearchIcon, EditIcon, CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import UpdateSessionModal from "./UpdateSessionModal";

export function SessionManagement() {
  const [sessions, setSessions] = useState<FullSession[]>([]);
  const { getToken } = useAuth();
  const [searchSession, setSearchSession] = useState("");
  const [isUpdateSessionModalOpen, setupdateSessionModalOpen] = useState(false);
  const [session, setSession] = useState<FullSession | null>(null);
  
  useEffect(() => {
    const getMentors = async () => {
      try {
        const token = await getToken({ template: "test-01" });
        const response = await fetch(`${BACKEND_URL}/academic/session`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.message || "Failed to fetch mentors");
        }
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    getMentors();
  }, [getToken,isUpdateSessionModalOpen]);
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Session Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search sessions..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64"
              value={searchSession}
              onChange={(event) => {
                setSearchSession(event.target.value);
              }}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
      {/* Sessions Table */}
      <div className="bg-white rounded-md overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sessions
              .filter(
                (session) =>
                  session.topic.toLowerCase().includes(searchSession.toLowerCase()) ||
                  session.mentor.first_name.toLowerCase().includes(searchSession.toLowerCase()) ||
                  session.mentor.last_name.toLowerCase().includes(searchSession.toLowerCase()) ||
                  session.student.first_name.toLowerCase().includes(searchSession.toLowerCase()) ||
                  session.student.last_name.toLowerCase().includes(searchSession.toLowerCase())
              )
              .map((session) => (
                <tr key={session.session_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{session.topic}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.mentor.first_name} {session.mentor.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{session.start_time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.student.first_name} {session.student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusPill status={session.session_status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSession(session);
                        setupdateSessionModalOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800 mr-3"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <UpdateSessionModal
        isOpen={isUpdateSessionModalOpen}
        onClose={() => {
          setupdateSessionModalOpen(false);
        }}
        fullSession={session}
      />
      {/* <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing 1 to 5 of 5 entries</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-yellow-500 text-white">1</button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100">Next</button>
        </div>
      </div> */}
    </div>
  );
}
