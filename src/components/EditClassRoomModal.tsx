import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKEND_URL } from "@/config/env";
import { MentorClass } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditClassRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorClass: MentorClass | undefined;
}

function EditClassRoomModal({ isOpen, onClose, mentorClass }: EditClassRoomModalProps) {
  const [classTitle, setClassTitle] = useState<string>("");
  const { getToken } = useAuth();

  useEffect(() => {
    if (mentorClass?.title) {
      setClassTitle(mentorClass.title);
    }
  }, [mentorClass]);

  const editClassRoom = async () => {
    if (!mentorClass) {
      throw new Error("Mentor class data is missing.");
    }
    try {
      const updatedClassRoom: MentorClass = {
        class_room_id: mentorClass.class_room_id,
        title: classTitle,
        enrolled_student_count: mentorClass.enrolled_student_count,
        class_image: mentorClass.class_image,
        mentor: mentorClass.mentor,
      };
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/classroom`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedClassRoom),
      });
      if (!response.ok) {
        throw new Error("Failed to update classroom");
      }
      onClose();
      toast.success("Successfully Updated");
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("There was a problem with update classroom. Please try again!");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await editClassRoom();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Classroom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={classTitle} onChange={(e) => setClassTitle(e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditClassRoomModal;
