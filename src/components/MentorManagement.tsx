import { Mentor } from "@/lib/types";
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { BACKEND_URL } from "@/config/env";
import { Button } from "./ui/button";
import AddMentorModal from "./AddMentorModal";
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
} from "./ui/alert-dialog";
import EditMentorModal from "./EditMentorModal";
import { toast } from "sonner";
export function MentorManagement() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isAddMentorModalOpen, setisAddMentorModalOpen] = useState(false);
  const [selectId, setSelectId] = useState(0);
  const [isdeleted, setIsDeleted] = useState(false);
  const [selectMentor, setSelectMentor] = useState<Mentor | undefined>();
  const [isEditMentorModalOpen, setIsEditMentorModalOpen] = useState(false);
  const [searchMentor, setSearchMentor] = useState("");
  const { getToken } = useAuth();

  useEffect(() => {
    const getMentors = async () => {
      try {
        const token = await getToken({ template: "test-01" });
        const response = await fetch(`${BACKEND_URL}/academic/mentor`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch mentors");
        }
        const data = await response.json();
        setMentors(data);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    getMentors();
  }, [getToken, isAddMentorModalOpen, isEditMentorModalOpen, isdeleted]);

  const deleteMentor = async (selectId: number) => {
    try {
      if (!selectId) {
        throw new Error("Mentor id is missing");
      }
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/mentor/${selectId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errReponse = await response.json();
        throw new Error(errReponse.message || "Error with deleting mentor");
      }
      setIsDeleted(true);
      toast.success("Mentor deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("There was a problem with deleting mentor. Please try again!");
    }
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
              .filter((mentor) => 
                mentor.first_name.toLowerCase().includes(searchMentor.toLowerCase()) 
              || mentor.last_name.toLowerCase().includes(searchMentor.toLowerCase()))
              .map((mentor) => (
                <tr key={mentor.mentor_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                        <img className="object-cover h-8 w-8 rounded-full" src={mentor.mentor_image} alt={mentor.first_name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-800">
                          {mentor.first_name} {mentor.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{mentor.profession}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="ml-1">Rs. {mentor.session_fee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectMentor(mentor);
                        setIsEditMentorModalOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-800 mr-3"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => {
                            setSelectId(mentor.mentor_id);
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
                          <AlertDialogDescription>
                            This action cannot be undone. 
                            This will permanently delete mentor and remove data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteMentor(selectId);
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
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing 1 to 5 of 5 entries</div>
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
