import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { Info, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { supabase } from '../../../lib/supabase';

function TimeTableView({ user }) {
  const { getAssignmentsForFaculty } = useData();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Only query assignments if the profile looking at this view is a faculty member
  const isFaculty = user?.role === 'faculty';
  const assignments = isFaculty ? getAssignmentsForFaculty(user?.id) : [];

  const classId = isFaculty ? assignments[0]?.assignedClassNode : user?.department;

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!classId) return setLoading(false);
      const { data, error } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('class_id', classId);

      if (error) {
        console.error('fetchTimetable:', error.message);
        setLoading(false);
        return;
      }

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const grid = days.map(d => {
        const row = { day: d, p1:'', p2:'', p3:'', p4:'Break', p5:'', p6:'', p7:'' };
        (data || []).filter(e => e.day_of_week === d).forEach(e => {
          if (e.period_number >= 1 && e.period_number <= 7) {
            if (e.period_number === 4) row.p4 = e.subject_name;
            else row[`p${e.period_number}`] = e.subject_name;
          }
        });
        return row;
      });
      setScheduleData(grid);
      setLoading(false);
    };
    fetchTimetable();
  }, [classId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Timetable - ${classId}`, 14, 15);
    
    const tableColumn = ["Day", "1", "2", "3", "4", "5", "6", "7"];
    const tableRows = [];

    scheduleData.forEach(row => {
      const rowData = [row.day, row.p1, row.p2, row.p3, row.p4, row.p5, row.p6, row.p7];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Timetable_${classId}.pdf`);
  };

  if (isFaculty && assignments.length === 0) {
    return (
      <div className="fade-in">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Personal Timetable</h2>
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1' }}>
          <Info size={48} style={{ color: '#94a3b8', margin: '0 auto 1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            No Schedule Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
            You have not been assigned to any classes yet, so a personal timetable cannot be generated. Please contact the Admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: 'var(--primary)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: '600',
          boxShadow: 'var(--shadow-sm)'
        }}>
          Class : {classId || 'N/A'}
        </div>
        
        {scheduleData.length > 0 && (
          <button 
            className="btn btn-primary"
            onClick={handleDownloadPDF}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={18} /> Download TimeTable
          </button>
        )}
      </div>

      <div className="card table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">Loading timetable...</div>
        ) : scheduleData.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">No timetable imported for {classId}.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Period 1<br/><span className="text-muted text-sm">8:30 - 9:20</span></th>
                <th>Period 2<br/><span className="text-muted text-sm">9:20 - 10:10</span></th>
                <th>Period 3<br/><span className="text-muted text-sm">10:10 - 11:00</span></th>
                <th>Period 4<br/><span className="text-muted text-sm">11:00 - 11:50</span></th>
                <th>Period 5<br/><span className="text-muted text-sm">12:40 - 1:30</span></th>
                <th>Period 6<br/><span className="text-muted text-sm">1:30 - 2:20</span></th>
                <th>Period 7<br/><span className="text-muted text-sm">2:20 - 3:10</span></th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-bold">{row.day}</td>
                  <td>{row.p1}</td>
                  <td>{row.p2}</td>
                  <td>{row.p3}</td>
                  <td style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-muted)' }}>{row.p4}</td>
                  <td>{row.p5}</td>
                  <td>{row.p6}</td>
                  <td>{row.p7}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default TimeTableView;
