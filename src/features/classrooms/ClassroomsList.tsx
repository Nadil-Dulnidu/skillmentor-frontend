import { useSelector } from "react-redux";
import { selectClassroomIds, useGetClassroomsQuery } from "./classroomSlice";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { JSX } from "react";
import { MentorCard } from "./MentorCard";
import { toast } from "sonner";

const ClassroomsList = () => {
  const { isLoading, isSuccess, isError, error } = useGetClassroomsQuery();
  const classroomIds = useSelector(selectClassroomIds);

  const renderedClassrooms = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size="lg" text="Loading" />;
    } else if (isSuccess) {
      content = (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classroomIds.map((mentorClassId) => (
            <MentorCard key={mentorClassId} mentorClassId={mentorClassId} />
          ))}
        </div>
      );
    } else if (isError) {
      toast.error("Something went wrong. Error fetching mentor classes");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
      content = <p className="text-center text-gray-500 text-sm">Empty classes</p>;
    }
    return content;
  };
  return <>{renderedClassrooms()}</>;
};

export default ClassroomsList;
