import { FullSession } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "@clerk/clerk-react";
import { BACKEND_URL } from "@/config/env";
import { toast } from "sonner";

interface UpdateSessionProp {
  isOpen: boolean;
  onClose: () => void;
  fullSession: FullSession | null;
}

const formSchema = z.object({
  session_status: z.string().nonempty("Session status is empty"),
});

const UpdateSessionModal = ({ isOpen, onClose, fullSession }: UpdateSessionProp) => {
  const [sessionStatus, setSessionStatus] = useState("");
  const { getToken } = useAuth();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      session_status: "",
    },
  });

  useEffect(() => {
    if (fullSession?.session_status) {
      setSessionStatus(fullSession.session_status);
    }
  }, [fullSession]);

  useEffect(() => {
    if (isOpen && sessionStatus) {
      form.reset({
        session_status: sessionStatus || "",
      });
    }
  }, [isOpen, form, sessionStatus]);

  const updateSession = async (sessionStatus: string) => {
    try {
      if (!fullSession) {
        throw new Error("Session data is missing.");
      }
      const token = await getToken({ template: "test-01" });
      const response = await fetch(`${BACKEND_URL}/academic/session/${fullSession.session_id}?sessionStatus=${sessionStatus}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errResponse = await response.json();
        throw new Error(errResponse.message || "Failed to update session status");
      }
      onClose();
      toast.success("Session status updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("There was a problem with update session status. Please try again!");
    }
  };

  const onSubmit = (data: { session_status: string }) => {
    updateSession(data.session_status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Session</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="session_status"
              render={({ field }) => (
                <FormItem className="md:w-80">
                  <FormLabel>Change Session Status</FormLabel>
                  <Select value={field.value} onValueChange={(val) => field.onChange(val)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel></SelectLabel>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
};

export default UpdateSessionModal;
