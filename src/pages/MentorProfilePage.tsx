import { SchedulingModal } from "@/components/SchedulingModel";
import { SignupDialog } from "@/components/SignUpDialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Building2, Calendar, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";

const MentorProfile = () => {
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);
  const { mentorId } = useParams();
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const mentorClass = location.state;

  const handleSchedule = () => {
    if (!isSignedIn) {
      setIsSignupDialogOpen(true);
      return;
    }
    setIsSchedulingModalOpen(true);
  };

  return (
    <div data-id={mentorId}>
      {/* Header */}
      <div className="text-black pb-3 pt-6">
        <div className="container mx-auto px-4">
          <Link to="/">
            <button className="flex items-center gap-2 text-black text-md">
              <ArrowLeft size={25} />
              Back to Classes
            </button>
          </Link>
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src={mentorClass.mentor.mentor_image} alt={mentorClass.mentor.first_name} className="w-40 h-40 rounded-full object-cover border-4 border-gray-100" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {mentorClass.mentor.first_name} {mentorClass.mentor.last_name}
              </h1>
              <p className="text-md text-gray-600 mb-3">{mentorClass.mentor.email}</p>
              <p className="flex gap-1 items-center text-lg text-gray-700 mb-3">
                <Building2 size={21} />
                {mentorClass.mentor.profession}
              </p>
              <p className="text-gray-600 mb-5 text-md leading-relaxed">{mentorClass.mentor.subject}</p>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-1 text-gray-600 text-lg">
                    <Calendar size={21} />
                    {mentorClass.mentor.qualification}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Classes</h2>
          <div className="grid gap-6 md:grid-cols-1 lg:w-1/2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{mentorClass.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  <p className="flex gap-2 items-center text-gray-800">
                    <GraduationCap size={21} />
                    <span>{mentorClass.enrolled_student_count} Students Enrolled</span>
                  </p>
                </span>
              </div>
              <Button onClick={handleSchedule} className="mt-4 w-full">Schedule a session</Button>
            </div>
          </div>
        </div>
      </div>
      <SignupDialog isOpen={isSignupDialogOpen} onClose={() => setIsSignupDialogOpen(false)} />

      <SchedulingModal isOpen={isSchedulingModalOpen} onClose={() => setIsSchedulingModalOpen(false)} mentorClass={mentorClass} />
    </div>
  );
};

export default MentorProfile;
