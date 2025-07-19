import { BACKEND_URL } from "@/config/env";
import { MentorClass } from "@/lib/types";
import { SearchIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EditClassRoomDialog from "./EditClassRoomDialog";

export function ClassManagement() {
  const [mentorClasses, setMentorClasses] = useState<MentorClass[]>([]);
  const [isEditClassRoomModalOpen, setIsEditClassRoomModalOpen] = useState(false);
  const [mentorClass, setMentorClass] = useState<MentorClass>();
  
  useEffect(() => {
    async function fetchMentorClasses() {
      try {
        const response = await fetch(`${BACKEND_URL}/academic/classroom`);

        if (!response.ok) {
          throw new Error("Failed to fetch mentor classes");
        }

        const data = await response.json();
        setMentorClasses(data);
      } catch (error) {
        console.error("Error fetching mentor classes:", error);
      }
    }
    fetchMentorClasses();
  }, [isEditClassRoomModalOpen]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Class Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search classes..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <button className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Class
          </button>
        </div>
      </div>
      {/* Classes Table */}
      <div className="bg-white rounded-md overflow-hidden shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enrolled students
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mentorClasses.map((cls) => (
              <tr key={cls.class_room_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cls.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{`${cls.mentor.first_name} ${cls.mentor.last_name}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cls.enrolled_student_count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {setIsEditClassRoomModalOpen(true); setMentorClass(cls)}}
                    className="text-yellow-600 hover:text-yellow-800 mr-3"
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing 1 to 5 of 5 entries</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-yellow-500 text-white">1</button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100">Next</button>
        </div>
      </div>
      <div>
        <EditClassRoomDialog
                      isOpen={isEditClassRoomModalOpen}
                      onClose={() => {
                        setIsEditClassRoomModalOpen(false);
                      }}
                      mentorClass={mentorClass}
                    />
      </div>
    </div>
  );
}
