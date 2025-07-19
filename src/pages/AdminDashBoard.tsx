import { useState } from 'react';
import { BookOpenIcon, UsersIcon, CalendarIcon} from 'lucide-react';
import { MentorManagement } from '@/components/MentorManagement';
import { SessionManagement } from '@/components/SessionManagement';
import { ClassManagement } from '@/components/ClassManagement';

const AdminDashBoard = () => {
  const [activeTab, setActiveTab] = useState('classes');
  return (
    <div className="flex flex-col container py-10">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button className={`px-4 py-2 font-medium flex items-center ${activeTab === 'classes' ? 'custom-button-color border-b-2' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('classes')}>
            <BookOpenIcon className="w-4 h-4 mr-2" />
            Classes
          </button>
          <button className={`px-4 py-2 font-medium flex items-center ${activeTab === 'mentors' ? 'custom-button-color border-b-2 ' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('mentors')}>
            <UsersIcon className="w-4 h-4 mr-2" />
            Mentors
          </button>
          <button className={`px-4 py-2 font-medium flex items-center ${activeTab === 'sessions' ? 'custom-button-color border-b-2 ' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('sessions')}>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Sessions
          </button>
        </div>
        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'classes' && <ClassManagement />}
          {activeTab === 'mentors' && <MentorManagement />}
          {activeTab === 'sessions' && <SessionManagement />}
        </div>
      </div>
  );
}

export default AdminDashBoard
