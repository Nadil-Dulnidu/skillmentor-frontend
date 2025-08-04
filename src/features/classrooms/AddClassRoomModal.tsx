import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { ClassRoom } from "@/lib/types";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { useAddClassroomMutation } from "@/features/classrooms/classroomSlice";

interface AddClassRoomModalProp {
  isOpen: boolean;
  onClose(): void;
}

const formSchema = z.object({
  title: z.string().nonempty("Class title must not be empty"),
  class_image: z.string().nonempty("Class image must not be empty"),
});

type FormData = {
  title: string;
  class_image: string;
}

const AddClassRoomModal = ({ isOpen, onClose }: AddClassRoomModalProp) => {
  const { getToken } = useAuth();
  const [addClassroom] = useAddClassroomMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      class_image: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const token = await getToken({ template: "test-01" });
      const newClassRoom: ClassRoom = {
        title: data.title,
        class_image: data.class_image,
      };
      await addClassroom({ newClassroom: newClassRoom, token: token }).unwrap();
      toast.success("Classroom added successfully");
      onClose();
    } catch (err) {
      console.error("AddClassRoom error:", err);
      toast.error("There was a problem with adding the classroom. Please try again!");
    }
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
