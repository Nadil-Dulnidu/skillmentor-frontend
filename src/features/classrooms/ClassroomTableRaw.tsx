import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MentorClass } from "@/lib/types";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { EditIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useDeleteClassroomMutation } from "@/features/classrooms/classroomSlice";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";

type ClassroomExcerptProps = {
  cls: MentorClass;
  setIsEditClassRoomModalOpen: (isOpen: boolean) => void;
  setMentorClass: (cls: MentorClass) => void;
};

const ClassroomExcerpt = ({ cls, setIsEditClassRoomModalOpen, setMentorClass }: ClassroomExcerptProps) => {
  const [selectId, setSelectId] = useState<number | null>(null);
  const [deleteClassroom] = useDeleteClassroomMutation();
  const auth = useAuth();

  const handleDeleteClassroom = async (classroomId: number | null) => {
    try {
      const token = await auth.getToken({ template: "test-01" });
      if (!classroomId) {
        throw new Error("Classroom ID is required for deletion");
      }
      await deleteClassroom({ classroomId, token });
      toast.success("Classroom deleted successfully");
    } catch (error) {
      console.error("Error deleting classroom:", error);
      toast.error("Failed to delete classroom");
    }
  };

  return (
    <tr key={cls.class_room_id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cls.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{cls.mentor ? `${cls.mentor.first_name} ${cls.mentor.last_name}` : <p className="text-red-400">Not Assign</p>}</td>
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
                  handleDeleteClassroom(selectId);
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

export default ClassroomExcerpt;
