import { Mentor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/clerk-react";
import { BACKEND_URL } from "@/config/env";
import { toast } from "sonner";

type ModalProp = {
  isOpen: boolean;
  isClose: () => void;
  mentor: Mentor | undefined;
};

interface FormData {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  title: string;
  session_fee: number;
  profession: string;
  subject: string;
  phone_number: string;
  qualification: string;
  mentor_image: string;
}

const formSchema = z.object({
  first_name: z.string().nonempty("First name is empty"),
  last_name: z.string().nonempty("Last name is empty"),
  address: z.string().nonempty("Address is empty"),
  email: z.email("Invalid Email").nonempty("Email is empty"),
  title: z.string().nonempty("Title is empty"),
  session_fee: z.preprocess((val) => Number(val), z.number().positive("Must be positive")),
  profession: z.string().nonempty("Profession is empty"),
  subject: z.string().nonempty("Subject is empty"),
  phone_number: z.string().nonempty("Phonenumber is empty"),
  qualification: z.string().nonempty("Qualification is empty"),
  mentor_image: z.string().nonempty("Image url is empty"),
});

const EditMentorModal = ({ isOpen, isClose, mentor }: ModalProp) => {
  const [mentorState, setMentorState] = useState<Mentor | null>(null);
  const { getToken } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address: "",
      email: "",
      title: "",
      session_fee: undefined,
      profession: "",
      subject: "",
      phone_number: "",
      qualification: "",
      mentor_image: "",
    },
  });
  useEffect(() => {
    if (mentor) {
      setMentorState(mentor);
    }
  }, [mentor]);

  useEffect(() => {
    if (isOpen && mentorState) {
      form.reset({
        first_name: mentorState.first_name || "",
        last_name: mentorState.last_name || "",
        address: mentorState.address || "",
        email: mentorState.email || "",
        title: mentorState.title || "",
        session_fee: mentorState.session_fee || undefined,
        profession: mentorState.profession || "",
        subject: mentorState.subject || "",
        phone_number: mentorState.phone_number || "",
        qualification: mentorState.qualification || "",
        mentor_image: mentorState.mentor_image || "",
      });
    }
  }, [isOpen, form, mentorState]);

  const editMentor = async (formMentor: FormData) => {
    try {
      if (!mentor) {
        throw new Error("Mentor class data is missing.");
      }
      const updatedMentor: Mentor = {
        mentor_id: mentor.mentor_id,
        first_name: formMentor.first_name.trim(),
        clerk_mentor_id: mentor.clerk_mentor_id,
        last_name: formMentor.last_name.trim(),
        address: formMentor.address,
        email: formMentor.email,
        title: formMentor.title,
        session_fee: formMentor.session_fee,
        profession: formMentor.profession,
        subject: formMentor.subject.trim(),
        phone_number: formMentor.phone_number,
        qualification: formMentor.qualification,
        mentor_image: formMentor.mentor_image,
        class_room_id: mentor.class_room_id
      };
      console.log(updatedMentor)
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/mentor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMentor),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to update mentor");
      }
      isClose();
      toast.success("Mentor updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("There was a problem with updatading mentor. Please try again!");
    }
  };

  const onSubmit = (data: FormData): void => {
    editMentor(data);
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={isClose}>
        <DialogContent className="overflow-y-scroll scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-transparent sm:max-w-[725px] h-5/6">
          <DialogHeader>
            <DialogTitle>Edit Mentor</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex-row">
              <div className="md:flex gap-1 justify-between">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input className="md:w-80" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input className="md:w-80" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:flex gap-1 justify-between">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" className="md:w-80" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" className="md:w-80" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:flex gap-1 justify-between">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className="md:w-80" placeholder="Mr." {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession</FormLabel>
                      <FormControl>
                        <Input className="md:w-80" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:flex gap-1 justify-between">
                <FormField
                  control={form.control}
                  name="session_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session fee</FormLabel>
                      <FormControl>
                        <Input className="md:w-80" {...field} value={field.value === undefined || field.value === null ? "" : String(field.value)} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification</FormLabel>
                      <FormControl>
                        <Input className="md:w-80" {...field} />
                      </FormControl>
                      <FormDescription />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="mentor_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
    </div>
  );
};

export default EditMentorModal;
