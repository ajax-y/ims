import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import HomeView from './views/HomeView';
import TimeTableView from './views/TimeTableView';
import AttendanceView from './views/AttendanceView';
import LeaveView from './views/LeaveView';
import { CATMarks, LabMarks, AssignmentMarks, GradeBook } from './views/MarksViews';
import StudentMaterialHubView from './views/StudentMaterialHubView';
import ProfileView from '../../components/ProfileView';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('ims_student_active_tab') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('ims_student_active_tab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView user={user} />;
      case 'timetable': return <TimeTableView />;
      case 'attendance': return <AttendanceView user={user} />;
      case 'leave': return <LeaveView user={user} />;
      case 'cat': return <CATMarks user={user} />;
      case 'lab': return <LabMarks user={user} />;
      case 'assignment': return <AssignmentMarks user={user} />;
      case 'grade': return <GradeBook user={user} />;
      case 'material_hub': return <StudentMaterialHubView user={user} />;
      case 'profile': return <ProfileView user={user} />;
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
