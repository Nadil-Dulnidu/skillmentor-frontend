import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { ClassRoom } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { BACKEND_URL } from "@/config/env";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
interface AddClassRoomModalProp {
  isOpen: boolean;
  onClose(): void;
}
interface FormData {
  title: string;
  class_image: string;
}

const formSchema = z.object({
  title: z.string().nonempty("Class title must not be empty"),
  class_image: z.string().nonempty("Class image must not be empty"),
});

const AddClassRoomModal = ({ isOpen, onClose }: AddClassRoomModalProp) => {
  const [classRoomData, setClassRoomData] = useState<ClassRoom | null>(null);
  const { getToken } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      class_image: "",
    },
  });

  useEffect(() => {
    if (isOpen && classRoomData) {
      form.reset({
        title: classRoomData.title || "",
        class_image: classRoomData.class_image || "",
      });
    } else if (isOpen && !classRoomData) {
      form.reset();
    }
  }, [classRoomData, form, isOpen]);

  const AddClassRoom = async () => {
    try {
      if (!classRoomData) {
        throw new Error("Error");
      }
      const newClassRoom: ClassRoom = {
        class_room_id: classRoomData.class_room_id,
        title: classRoomData?.title,
        enrolled_student_count: classRoomData.enrolled_student_count,
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
        const errResponse = await response.json();
        throw new Error(errResponse.message || "Failed to update classroom");
      }
      toast.success("Classroom added successfully");
    } catch (err) {
      console.log(err);
      toast.error("There was a problem with Adding classroom. Please try again!");
    }
  };
  const onSubmit = (data: FormData): void => {
    setClassRoomData((prev) => ({ ...prev!, ...data }));
    onClose();
    AddClassRoom();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classroom Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Classroom title" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classroom image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Classroom image URL" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassRoomModal;
