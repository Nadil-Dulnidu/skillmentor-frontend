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
} from "@/components/ui/alert-dialog";
import { Mentor } from "@/lib/types";
import { EditIcon, TrashIcon } from "lucide-react";
import { useDeleteMentorMutation } from "./mentorSlice";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

interface MentorTableRowProps {
  mentor: Mentor;
  setSelectMentor: (mentor: Mentor) => void;
  setIsEditMentorModalOpen: (isOpen: boolean) => void;
}
const MentorTableRow = ({ mentor, setSelectMentor, setIsEditMentorModalOpen }: MentorTableRowProps) => {
  const [selectId, setSelectId] = useState<number | null>(null);
  const [classId, selectClassId] = useState<number | null>(null);
  const { getToken } = useAuth();
  const [deleteMentor] = useDeleteMentorMutation();

  const removeMentor = async (selectId: number | null, classId: number | null) => {
    try {
      if (!selectId || !classId) {
        throw new Error("Mentor id or Classroom id is missing");
      }
      const token = await getToken({ template: "test-01" });
      await deleteMentor({ mentorId: selectId, classroom_id: classId, token }).unwrap();
      toast.success("Mentor deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("There was a problem with deleting mentor. Please try again!");
    }
  };

  return (
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
                selectClassId(mentor.class_room_id ?? null);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone. This will permanently delete mentor and remove data from our servers.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  removeMentor(selectId, classId);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </td>
    </tr>
  );
};

export default MentorTableRow;
