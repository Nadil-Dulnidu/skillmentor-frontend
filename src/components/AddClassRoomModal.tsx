import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ClassRoom } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { BACKEND_URL } from "@/config/env";
import { toast } from "sonner";

interface AddClassRoomModalProp {
  isOpen: boolean;
  onClose(): void;
}

const AddClassRoomModal = ({ isOpen, onClose }: AddClassRoomModalProp) => {
  const [classRoomData, setClassRoomData] = useState<ClassRoom | null>(null);
  const { getToken } = useAuth();
  const AddClassRoom = async () => {
    try {
      if (!classRoomData) {
        throw new Error("Error");
      }
      const newClassRoom: ClassRoom = {
        title: classRoomData?.title,
        class_image: classRoomData?.class_image,
      };
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/classroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClassRoom),
      });
      if (!response.ok) {
        throw new Error("Failed to update classroom");
      }
      onClose();
      toast.success("Successfully Added");
    } catch (err) {
      console.log(err);
      toast.error("There was a problem with Adding classroom. Please try again!");
    }
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    AddClassRoom();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label htmlFor="title-1">Class Image</Label>
            <Input
              id="title-1"
              placeholder="Image URL"
              required
              value={classRoomData?.class_image || ""}
              onChange={(event) => {
                setClassRoomData((prev) => ({
                  ...prev,
                  title: prev?.title || "",
                  class_image: event.target.value,
                }));
              }}
            />
          </div>
          <div className="grid gap-4 py-4">
            <Label htmlFor="title-2">Title</Label>
            <Input
              id="title-2"
              placeholder="Classroom Title"
              required
              value={classRoomData?.title || ""}
              onChange={(event) => {
                setClassRoomData((prev) => ({
                  ...prev,
                  class_image: prev?.class_image || "",
                  title: event.target.value,
                }));
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassRoomModal;
