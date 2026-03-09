import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { 
  AdminHomeView, 
  TimetableUploadView, 
  ManageUsersView, 
  ApprovalsView, 
  SemResultsView,
  ManageClassesView,
  ManageAnnouncementsView
} from './views/AdminViews';
import FacultyAssignmentView from './views/FacultyAssignmentView';
import ProfileView from '../../components/ProfileView';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('ims_admin_active_tab') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('ims_admin_active_tab', activeTab);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <AdminHomeView />;
      case 'announcements': return <ManageAnnouncementsView />;
      case 'student_tt': return <TimetableUploadView type="student" />;
      case 'teacher_tt': return <TimetableUploadView type="faculty" />;
      case 'students': return <ManageUsersView type="student" />;
      case 'faculty': return <ManageUsersView type="faculty" />;
      case 'class_assignment': return <FacultyAssignmentView />;
      case 'admins': return <ManageUsersView type="admin" />;
      case 'approvals': return <ApprovalsView />;
      case 'results': return <SemResultsView />;
      case 'classes': return <ManageClassesView />;
      case 'profile': return <ProfileView user={user} />;
      default: return <AdminHomeView />;
    }
  };

  return (
    <Layout 
      user={user} 
      role="admin" 
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

export default AdminDashboard;
