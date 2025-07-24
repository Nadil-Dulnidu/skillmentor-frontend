import { MentorCard } from "@/components/MentorCard";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { MentorClass } from "@/lib/types";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import api from "@/utils/axios";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [mentorClasses, setMentorClasses] = useState<MentorClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMentorClasses() {
      try {
        const response = await api.get("/classroom");
        setMentorClasses(response.data);
      } catch (error) {
        toast.error("Something went wrong. Error fetching mentor classes");
        // @ts-expect-error: error.response is likely from axios
        console.error(error.response);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMentorClasses();
  }, []);

  return (
    <div className="py-10">
      <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
        <div className="space-y-2">
          <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">Find your SkillMentor</h1>
          <p className="mx-auto text-gray-500 md:text-xl dark:text-gray-400 max-w-xs sm:max-w-full">
            Empower your career with personalized mentorship for AWS Developer <br className="hidden sm:block" />
            Associate, Interview Prep, and more.
          </p>
        </div>

        {isSignedIn ? (
          <Link to="/dashboard">
            <Button size="lg" className="text-xl">
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button size="lg" className="text-xl">
              Sign up to see all tutors
            </Button>
          </Link>
        )}
      </div>

      <div className="space-y-8 mt-8 container bg-background">
        <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-3xl">Schedule a Call</h1>
        {!isLoading ? (
          mentorClasses.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentorClasses
                .filter((mentorClass) => mentorClass.mentor)
                .map((mentorClass) => (
                  <MentorCard key={mentorClass.class_room_id} mentorClass={mentorClass} />
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">Empty classes</p>
          )
        ) : (
          <LoadingSpinner size="lg" text="Loading" />
        )}
      </div>
    </div>
    
  );
}
