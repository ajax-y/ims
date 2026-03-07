import React, { useState } from 'react';
import Layout from '../../components/Layout';
import FacultyHomeView from './views/FacultyHomeView';
import StudentAttendanceView from './views/StudentAttendanceView';
import { FacultyCATMarks, FacultyLabMarks, FacultyAssignmentMarks } from './views/FacultyMarksViews';

// Reusing some student views for personal metrics/leaves
import TimeTableView from '../student/views/TimeTableView';
import AttendanceView from '../student/views/AttendanceView';
import LeaveView from '../student/views/LeaveView';

function FacultyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <FacultyHomeView user={user} />;
      case 'timetable': return <TimeTableView />; // Personal timetable
      case 'student_attendance': return <StudentAttendanceView />;
      case 'cat': return <FacultyCATMarks />;
      case 'lab': return <FacultyLabMarks />;
      case 'assignment': return <FacultyAssignmentMarks />;
      case 'leave': return <LeaveView />; // Apply leave
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
