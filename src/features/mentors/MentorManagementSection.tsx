import { Mentor } from "@/lib/types";
import { SearchIcon, PlusIcon } from "lucide-react";
import { JSX, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "../../components/ui/button";
import AddMentorModal from "./AddMentorModal";
import EditMentorModal from "./EditMentorModal";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { useGetMentorsQuery, selectAllMentors } from "@/features/mentors/mentorSlice";
import MentorTableRow from "@/features/mentors/MentorTableRow";

export function MentorManagement() {
  const [isAddMentorModalOpen, setisAddMentorModalOpen] = useState(false);
  const [selectMentor, setSelectMentor] = useState<Mentor | undefined>();
  const [isEditMentorModalOpen, setIsEditMentorModalOpen] = useState(false);
  const [searchMentor, setSearchMentor] = useState("");
  const { getToken } = useAuth();
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
  const { isLoading, isSuccess, isError, error } = useGetMentorsQuery(stableToken, { skip: !stableToken, });
  const mentors = useSelector(selectAllMentors(stableToken));

  const renderMentors = () => {
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profession
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Fee
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mentors
                  .filter((mentor) => mentor.first_name.toLowerCase().includes(searchMentor.toLowerCase()) || mentor.last_name.toLowerCase().includes(searchMentor.toLowerCase()))
                  .map((mentor) => (
                    <MentorTableRow key={mentor.mentor_id} mentor={mentor} setSelectMentor={setSelectMentor} setIsEditMentorModalOpen={setIsEditMentorModalOpen} />
                  ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div>{`${mentors.length} Mentors`}</div>
          </div>
        </>
      );
    } else if (isError) {
      toast.error("Something went wrong! Failed to fetch mentors");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
      content = <p className="text-center text-gray-500 text-sm">Empty classes</p>;
    }
    return content;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mentor Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mentors..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1
               focus:ring-yellow-500 w-64"
              value={searchMentor}
              onChange={(event) => {
                setSearchMentor(event.target.value);
              }}
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <Button
            onClick={() => {
              setisAddMentorModalOpen(true);
            }}
            className="flex items-center text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Mentor
          </Button>
        </div>
      </div>
      <AddMentorModal
        isOpen={isAddMentorModalOpen}
        onClose={() => {
          setisAddMentorModalOpen(false);
        }}
      />
      {/* Mentors Table */}
      {renderMentors()}
      <div>
        <EditMentorModal
          isOpen={isEditMentorModalOpen}
          mentor={selectMentor}
          isClose={() => {
            setIsEditMentorModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
