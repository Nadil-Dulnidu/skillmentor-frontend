import { SearchIcon, PlusIcon, EditIcon, TrashIcon} from 'lucide-react';
export function MentorManagement() {
  const mockMentors = [{
    id: 1,
    name: 'Alex Johnson',
    expertise: 'Web Development',
    students: 15,
    rating: 4.8
  }, {
    id: 2,
    name: 'Sarah Williams',
    expertise: 'Data Science',
    students: 12,
    rating: 4.9
  }, {
    id: 3,
    name: 'Michael Chen',
    expertise: 'Mobile Development',
    students: 8,
    rating: 4.7
  }, {
    id: 4,
    name: 'Jessica Taylor',
    expertise: 'UI/UX Design',
    students: 10,
    rating: 4.6
  }, {
    id: 5,
    name: 'David Brown',
    expertise: 'Machine Learning',
    students: 9,
    rating: 4.8
  }];
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mentor Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input type="text" placeholder="Search mentors..." className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64" />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <button className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Mentor
          </button>
        </div>
      </div>
      {/* Mentors Table */}
      <div className="bg-white rounded-md overflow-hidden shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expertise
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockMentors.map(mentor => <tr key={mentor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-medium text-yellow-800">
                      {mentor.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-800">
                        {mentor.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {mentor.expertise}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {mentor.students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{mentor.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-yellow-600 hover:text-yellow-800 mr-3">
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing 1 to 5 of 5 entries</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100">
            Previous
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-yellow-500 text-white">
            1
          </button>
          <button className="px-3 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>
    </div>;
}