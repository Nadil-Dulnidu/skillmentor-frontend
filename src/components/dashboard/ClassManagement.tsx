import { BACKEND_URL } from "@/config/env";
import { MentorClass } from "@/lib/types";
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EditClassRoomModal from "./EditClassRoomModal";
import { Button } from "../ui/button";
import AddClassRoomModal from "./AddClassRoomModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { LoadingSpinner } from "../LoadingSpinner";
export function ClassManagement() {
  const [mentorClasses, setMentorClasses] = useState<MentorClass[]>([]);
  const [isEditClassRoomModalOpen, setIsEditClassRoomModalOpen] = useState(false);
  const [isAddClassRoomModalOpen, setIsAddClassRoomModalOpen] = useState(false);
  const [mentorClass, setMentorClass] = useState<MentorClass>();
  const [searchClasses, setSearchClasses] = useState("");
  const [selectId, setSelectId] = useState(0);
  const [isdeleted, setIsDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    async function fetchMentorClasses() {
      try {
        const response = await fetch(`${BACKEND_URL}/academic/classroom`);

        if (!response.ok) {
          throw new Error("Failed to fetch mentor classes");
        }

        const data = await response.json();
        setMentorClasses(data);
      } catch (error) {
        console.error("Error fetching mentor classes:", error);
        toast.error("Something went wrong! Failed to fetch mentor classes");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMentorClasses();
  }, [isEditClassRoomModalOpen, isAddClassRoomModalOpen, isdeleted]);

  const deleteClassroom = async (selectId: number) => {
    try {
      if (!selectId) {
        throw new Error("Classroom id is missing");
      }
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/classroom/${selectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errReponse = await response.json();
        throw new Error(errReponse.message || "Error with deleting classroom");
      }
      setIsDeleted(true);
      toast.success("Classroom deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("There was a problem with deleting classroom. Please try again!");
    }
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
      {!isLoading ? (
        mentorClasses.length ? (
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
                {mentorClasses
                  .filter((classroom) => classroom.title.toLowerCase().includes(searchClasses.toLowerCase()))
                  .map((cls) => (
                    <tr key={cls.class_room_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cls.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                        {cls.mentor ? `${cls.mentor.first_name} ${cls.mentor.last_name}` : <p className="text-red-400">Not Assign</p>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cls.enrolled_student_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setIsEditClassRoomModalOpen(true);
                            setMentorClass(cls);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 mr-3"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => {
                                setSelectId(cls.class_room_id);
                                setIsDeleted(false);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone. This will permanently delete classroom and remove data from servers.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteClassroom(selectId);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm">Empty classes</p>
        )
      ) : (
        <LoadingSpinner size="sm" text="Loading classes" />
      )}
      {!isLoading && mentorClasses.length ? (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>{`${mentorClasses.length} Classrooms`}</div>
      </div>
      ) : ""}
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
