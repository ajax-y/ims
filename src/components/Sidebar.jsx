import React from 'react';
import { 
  Home, Calendar, CheckSquare, FileText, 
  BarChart2, BookOpen, Layers, ClipboardList,
  Users, UserPlus, FileCheck, Award, FolderDown, UploadCloud, Bell
} from 'lucide-react';

const studentLinks = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'timetable', name: 'Time Table', icon: Calendar },
  { id: 'attendance', name: 'Attendance', icon: CheckSquare },
  { id: 'leave', name: 'Apply Leave / OD', icon: FileText },
  { id: 'cat', name: 'CAT Marks', icon: BarChart2 },
  { id: 'lab', name: 'LAB Marks', icon: BookOpen },
  { id: 'assignment', name: 'Assignment Marks', icon: Layers },
  { id: 'grade', name: 'Grade Book', icon: Award },
  { id: 'material_hub', name: 'Material Hub', icon: FolderDown }
];

const facultyLinks = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'timetable', name: 'My Time Table', icon: Calendar },
  { id: 'student_attendance', name: 'Student Attendance', icon: Users },
  { id: 'cat', name: 'CAT Marks', icon: BarChart2 },
  { id: 'lab', name: 'LAB Marks', icon: BookOpen },
  { id: 'assignment', name: 'Assignment Marks', icon: Layers },
  { id: 'leave', name: 'Apply Leave / OD', icon: FileText },
  { id: 'material_hub', name: 'Material Hub', icon: UploadCloud }
];

const adminLinks = [
  { id: 'home', name: 'Home', icon: Home },
  { id: 'announcements', name: 'Announcements', icon: Bell },
  { id: 'student_tt', name: 'Student Time Table', icon: Calendar },
  { id: 'teacher_tt', name: 'Teachers Time Table', icon: Calendar },
  { id: 'students', name: 'Student', icon: Users },
  { id: 'faculty', name: 'Faculty', icon: UserPlus },
  { id: 'class_assignment', name: 'Class Assignment', icon: UserPlus },
  { id: 'admins', name: 'Admin', icon: UserPlus },
  { id: 'classes', name: 'Manage Classes', icon: Layers },
  { id: 'approvals', name: 'Leave / OD', icon: FileCheck },
  { id: 'results', name: 'Sem Results', icon: Award }
];

function Sidebar({ role, activeTab, onTabChange, isOpen }) {
  let links = [];
  if (role === 'student') links = studentLinks;
  else if (role === 'faculty') links = facultyLinks;
  else if (role === 'admin') links = adminLinks;

  return (
    <aside className="sidebar" style={{
      width: '260px',
      backgroundColor: 'var(--card-bg)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 70px)',
      position: 'fixed',
      top: '70px',
      left: 0,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'var(--transition)',
      zIndex: 100,
      boxShadow: isOpen ? 'var(--shadow-lg)' : 'none',
      overflowY: 'auto'
    }}>
      <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        
        {/* Logo injected above the Home tab */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="RIT Logo" 
            style={{ maxWidth: '180px', height: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        </div>

        {links.map((link) => {
          const isActive = activeTab === link.id;
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1rem',
                border: 'none',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-muted)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: isActive ? '600' : '500',
                transition: 'var(--transition)'
              }}
            >
              <Icon size={20} />
              {link.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
