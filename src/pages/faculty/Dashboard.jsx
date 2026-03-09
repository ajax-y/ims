import React, { useState } from 'react';
import Layout from '../../components/Layout';
import FacultyHomeView from './views/FacultyHomeView';
import StudentAttendanceView from './views/StudentAttendanceView';
import { FacultyCATMarks, FacultyLabMarks, FacultyAssignmentMarks } from './views/FacultyMarksViews';
import FacultyMaterialHubView from './views/FacultyMaterialHubView';
import ProfileView from '../../components/ProfileView';

// Reusing some student views for personal metrics/leaves
import TimeTableView from '../student/views/TimeTableView';
import AttendanceView from '../student/views/AttendanceView';
import LeaveView from '../student/views/LeaveView';

function FacultyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('ims_faculty_active_tab') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('ims_faculty_active_tab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <FacultyHomeView user={user} />;
      case 'timetable': return <TimeTableView user={user} />; // Personal timetable
      case 'student_attendance': return <StudentAttendanceView user={user} />;
      case 'cat': return <FacultyCATMarks />;
      case 'lab': return <FacultyLabMarks />;
      case 'assignment': return <FacultyAssignmentMarks />;
      case 'leave': return <LeaveView user={user} />; // Apply leave
      case 'material_hub': return <FacultyMaterialHubView user={user} />;
      case 'profile': return <ProfileView user={user} />;
      default: return <FacultyHomeView user={user} />;
    }
  };

  return (
    <Layout 
      user={user} 
      role="faculty" 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={onLogout}
    >
      <div className="fade-in">
        {renderContent()}
      </div>
    </Layout>
  );
}

export default FacultyDashboard;
