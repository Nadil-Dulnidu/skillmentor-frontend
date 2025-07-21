import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/config/env";
import { MentorClass } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
interface EditClassRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorClass: MentorClass | undefined;
}

const formSchema = z.object({
  title: z.string().nonempty("Class title must not be empty"),
});

function EditClassRoomModal({ isOpen, onClose, mentorClass }: EditClassRoomModalProps) {
  const [classTitle, setClassTitle] = useState("");
  const { getToken } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (mentorClass?.title) {
      setClassTitle(mentorClass.title);
    }
  }, [mentorClass]);

  useEffect(() => {
    if (isOpen && classTitle) {
      form.reset({
        title: classTitle || "",
      });
    }
  }, [classTitle, isOpen, form]);

  const editClassRoom = async (title: string) => {
    try {
      if (!mentorClass) {
        throw new Error("Mentor class data is missing.");
      }
      const updatedClassRoom: MentorClass = {
        class_room_id: mentorClass.class_room_id,
        title: title,
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
      toast.success("Classroom updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("There was a problem with update classroom. Please try again!");
    }
  };

  const onSubmit = async (title: { title: string }): Promise<void> => {
    onClose();
    await editClassRoom(title.title);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Classroom</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classroom Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Classroom title" value={field.value} onChange={field.onChange} />
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditClassRoomModal;
