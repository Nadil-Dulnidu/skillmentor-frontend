import { Mentor } from "@/lib/types";
import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { ClassRoom } from "@/lib/types";
import { BACKEND_URL } from "@/config/env";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
interface AddMentorModalProp {
  isOpen: boolean;
  onClose(): void;
}
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
  class_room_id: number;
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
  class_room_id: z.number().positive("must be postive value"),
});

const AddMentorModal = ({ isOpen, onClose }: AddMentorModalProp) => {
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
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
      class_room_id: undefined,
    },
  });
  const { getToken } = useAuth();

  useEffect(() => {
    if (isOpen && mentor) {
      form.reset({
        first_name: mentor.first_name || "",
        last_name: mentor.last_name || "",
        address: mentor.address || "",
        email: mentor.email || "",
        title: mentor.title || "",
        session_fee: mentor.session_fee || undefined,
        profession: mentor.profession || "",
        subject: mentor.subject || "",
        phone_number: mentor.phone_number || "",
        qualification: mentor.qualification || "",
        mentor_image: mentor.mentor_image || "",
        class_room_id: mentor.class_room_id || undefined,
      });
    } else if (isOpen && !mentor) {
      form.reset();
    }
  }, [form, isOpen, mentor]);

  const createMentor = async () => {
    try {
      if (!mentor) {
        throw new Error("Error");
      }
      const newMentor = {
        first_name: mentor.first_name.trim(),
        clerk_mentor_id: "333332112",
        last_name: mentor.last_name.trim(),
        address: mentor.address,
        email: mentor.email,
        title: mentor.title,
        session_fee: mentor.session_fee,
        profession: mentor.profession,
        subject: mentor.subject.trim(),
        phone_number: mentor.phone_number,
        qualification: mentor.qualification,
        mentor_image: mentor.mentor_image,
        class_room_id: mentor.class_room_id,
      };
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/mentor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMentor),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      onClose();
      toast.success("Mentor successfully added");
    } catch (err) {
      toast.error("There was a problem with create mentor. Please try again!");
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  };

  const onSubmit = (data: FormData) => {
    setMentor((prev) => ({ ...prev!, ...data }));
    createMentor();
  };

  useEffect(() => {
    const getClassrooms = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/academic/classroom`);
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    getClassrooms();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-y-scroll scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-transparent sm:max-w-[725px] h-5/6">
        <DialogHeader>
          <DialogTitle>Create new mentor</DialogTitle>
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
                      <Input className="md:w-80" placeholder="Jhon" {...field} />
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
                      <Input className="md:w-80" placeholder="Doe" {...field} />
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
                    <Input placeholder="No.1, Main Street, City" {...field} />
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
                      <Input type="email" className="md:w-80" placeholder="jhondoe@gmail.com" {...field} />
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
                      <Input type="tel" className="md:w-80" placeholder="0112222000" {...field} />
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
                      <Input className="md:w-80" placeholder="Tech Lead at IFS" {...field} />
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
                    <Textarea placeholder="Type your subject here..." {...field} />
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
                      <Input className="md:w-80" placeholder="3000.00" {...field} value={field.value === undefined || field.value === null ? "" : String(field.value)} />
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
                      <Input className="md:w-80" placeholder="Tutor since 2015" {...field} />
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
                name="class_room_id"
                render={({ field }) => (
                  <FormItem className="md:w-80">
                    <FormLabel>Select a classroom</FormLabel>
                    <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(parseInt(val))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel></SelectLabel>
                          {classes.map((cls) => (
                            <SelectItem key={cls.class_room_id} value={cls.class_room_id.toString()}>
                              {cls.title}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mentor_image"
                render={({ field }) => (
                  <FormItem className="md:w-80">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMentorModal;
