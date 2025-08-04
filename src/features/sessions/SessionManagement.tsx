import { FullSession } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { SearchIcon, EditIcon, CalendarIcon } from "lucide-react";
import { JSX, useEffect, useMemo, useState } from "react";
import { StatusPill } from "@/components/StatusPill";
import UpdateSessionModal from "./UpdateSessionModal";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useGetSessionsQuery, selectAllSessions } from "./sessionSlice";
import { useSelector } from "react-redux";

export function SessionManagement() {
  const { getToken } = useAuth();
  const [searchSession, setSearchSession] = useState("");
  const [isUpdateSessionModalOpen, setupdateSessionModalOpen] = useState(false);
  const [session, setSession] = useState<FullSession | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const t = await getToken({ template: "test-01" });
      setToken(t);
    };
    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stableToken = useMemo(() => token, [token]);
  const { isLoading, isSuccess, isError, error } = useGetSessionsQuery(stableToken, { skip: !stableToken });
  const sessions = useSelector(selectAllSessions(stableToken));

  const renderSessions = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size="sm" text="Loading mentors" />;
    } else if (isSuccess) {
      content = (
        <>
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
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div>{`${sessions.length} Sessions`}</div>
          </div>
        </>
      );
    } else if (isError) {
      toast.error("Something went wrong! Failed to fetch sessions");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
      content = <p className="text-center text-gray-500 text-sm">Empty sessions</p>;
    }
    return content;
  };

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
      {renderSessions()}
      <div>
        <UpdateSessionModal
          isOpen={isUpdateSessionModalOpen}
          onClose={() => {
            setupdateSessionModalOpen(false);
          }}
          fullSession={session}
        />
      </div>
    </div>
  );
}
