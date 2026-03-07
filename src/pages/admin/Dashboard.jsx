import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { 
  AdminHomeView, 
  TimetableUploadView, 
  ManageUsersView, 
  ApprovalsView, 
  SemResultsView 
} from './views/AdminViews';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <AdminHomeView />;
      case 'student_tt': return <TimetableUploadView type="student" />;
      case 'teacher_tt': return <TimetableUploadView type="faculty" />;
      case 'students': return <ManageUsersView type="student" />;
      case 'faculty': return <ManageUsersView type="faculty" />;
      case 'approvals': return <ApprovalsView />;
      case 'results': return <SemResultsView />;
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
