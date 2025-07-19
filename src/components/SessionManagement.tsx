import { SearchIcon, PlusIcon, EditIcon, TrashIcon, CalendarIcon } from 'lucide-react';
export function SessionManagement() {
  const mockSessions = [{
    id: 1,
    title: 'JavaScript Basics',
    mentor: 'Alex Johnson',
    date: '2023-08-15',
    time: '10:00 AM',
    students: 8,
    status: 'Upcoming'
  }, {
    id: 2,
    title: 'Python Data Analysis',
    mentor: 'Sarah Williams',
    date: '2023-08-14',
    time: '2:00 PM',
    students: 12,
    status: 'Completed'
  }, {
    id: 3,
    title: 'React Components',
    mentor: 'Michael Chen',
    date: '2023-08-16',
    time: '11:00 AM',
    students: 6,
    status: 'Upcoming'
  }, {
    id: 4,
    title: 'UI Design Principles',
    mentor: 'Jessica Taylor',
    date: '2023-08-13',
    time: '3:00 PM',
    students: 10,
    status: 'Completed'
  }, {
    id: 5,
    title: 'Machine Learning Intro',
    mentor: 'David Brown',
    date: '2023-08-17',
    time: '1:00 PM',
    students: 9,
    status: 'Upcoming'
  }];
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Session Management</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input type="text" placeholder="Search sessions..." className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 w-64" />
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>
          <button className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Schedule Session
          </button>
        </div>
      </div>
      {/* Sessions Table */}
      <div className="bg-white rounded-md overflow-hidden shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Session
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mentor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Students
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockSessions.map(session => <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                  {session.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {session.mentor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                    <span>
                      {session.date} at {session.time}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {session.students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${session.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : session.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {session.status}
                  </span>
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