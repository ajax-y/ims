import React, { useState } from 'react';
import Layout from '../../components/Layout';
import HomeView from './views/HomeView';
import TimeTableView from './views/TimeTableView';
import AttendanceView from './views/AttendanceView';
import LeaveView from './views/LeaveView';
import { CATMarks, LabMarks, AssignmentMarks, GradeBook } from './views/MarksViews';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView user={user} />;
      case 'timetable': return <TimeTableView />;
      case 'attendance': return <AttendanceView />;
      case 'leave': return <LeaveView />;
      case 'cat': return <CATMarks />;
      case 'lab': return <LabMarks />;
      case 'assignment': return <AssignmentMarks />;
      case 'grade': return <GradeBook />;
      default: return <HomeView user={user} />;
    }
  };

  return (
    <Layout 
      user={user} 
      role="student" 
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

export default StudentDashboard;
