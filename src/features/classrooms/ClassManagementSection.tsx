import { MentorClass } from "@/lib/types";
import { SearchIcon, PlusIcon } from "lucide-react";
import { JSX, useState } from "react";
import EditClassRoomModal from "../../features/classrooms/EditClassRoomModal";
import { Button } from "../../components/ui/button";
import AddClassRoomModal from "./AddClassRoomModal";
import { toast } from "sonner";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useGetClassroomsQuery, selectAllClassrooms } from "@/features/classrooms/classroomSlice";
import { useSelector } from "react-redux";
import ClassroomExcerpt from "@/features/classrooms/ClassroomTableRaw";

export function ClassManagement() {
  const [isEditClassRoomModalOpen, setIsEditClassRoomModalOpen] = useState(false);
  const [isAddClassRoomModalOpen, setIsAddClassRoomModalOpen] = useState(false);
  const [mentorClass, setMentorClass] = useState<MentorClass>();
  const [searchClasses, setSearchClasses] = useState("");
  const { isLoading, isSuccess, isError, error } = useGetClassroomsQuery();
  const classrooms = useSelector(selectAllClassrooms);

  const renderClassrooms = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size="sm" text="Loading classes" />;
    } else if (isSuccess) {
      content = (
        <>
          <div className="bg-white rounded-md overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mentor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled students
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classrooms
                  .filter((classroom) => classroom.title.toLowerCase().includes(searchClasses.toLowerCase()))
                  .map((classroom) => (
                    <ClassroomExcerpt 
                    key={classroom.class_room_id} 
                    cls={classroom} 
                    setIsEditClassRoomModalOpen={setIsEditClassRoomModalOpen}
                    setMentorClass={setMentorClass}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
            <div>{`${classrooms.length} Classrooms`}</div>
          </div>
        </>
      );
    } else if (isError) {
      toast.error("Something went wrong! Failed to fetch mentor classes");
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
        <h2 className="text-xl font-semibold">Class Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              onSubmit={(event) => {
                event.preventDefault();
              }}
              type="text"
              placeholder="Search classes..."
              value={searchClasses}
              onChange={(event) => {
                setSearchClasses(event.target.value);
              }}
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md 
              text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400 w-64"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <Button
            onClick={() => {
              setIsAddClassRoomModalOpen(true);
            }}
            className="flex items-center text-sm"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Class
          </Button>
        </div>
      </div>
      <AddClassRoomModal
        isOpen={isAddClassRoomModalOpen}
        onClose={() => {
          setIsAddClassRoomModalOpen(false);
        }}
      />
      {/* Classes Table */}
      {renderClassrooms()}
      <div>
        <EditClassRoomModal
          isOpen={isEditClassRoomModalOpen}
          onClose={() => {
            setIsEditClassRoomModalOpen(false);
          }}
          mentorClass={mentorClass}
        />
      </div>
    </div>
  );
}
