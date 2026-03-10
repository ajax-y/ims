import React, { useState, useEffect } from 'react';
import { useData } from '../../../context/DataContext';
import { supabase } from '../../../lib/supabase';

export const CATMarks = ({ user }) => {
  const { getStudentMarks, getSubjectsForStudent } = useData();
  const marks = getStudentMarks(user?.id, 'CAT Marks');
  const mySubjects = getSubjectsForStudent(user?.department);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>CAT Marks</h2>
      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Subject Code</th><th>Subject Name</th><th>Faculty Name</th>
              <th>C01</th><th>C02</th><th>C03</th><th>C04</th><th>C05</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            {mySubjects.length === 0 ? (
              <tr><td colSpan="10" className="text-center text-muted">No subjects assigned yet.</td></tr>
            ) : mySubjects.map((row, idx) => {
              const m1 = parseInt(marks?.C01) || 0;
              const m2 = parseInt(marks?.C02) || 0;
              const m3 = parseInt(marks?.C03) || 0;
              const m4 = parseInt(marks?.C04) || 0;
              const m5 = parseInt(marks?.C05) || 0;
              const tot = m1 + m2 + m3 + m4 + m5;
              
              const facName = row.facultyId || 'Unknown';

              return (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td><td>-</td><td className="font-bold">{row.subject}</td><td>{facName}</td>
                  <td className={m1 > 0 && m1 < 25 ? 'text-danger font-bold' : ''}>{m1 || '-'}</td>
                  <td className={m2 > 0 && m2 < 25 ? 'text-danger font-bold' : ''}>{m2 || '-'}</td>
                  <td className={m3 > 0 && m3 < 25 ? 'text-danger font-bold' : ''}>{m3 || '-'}</td>
                  <td className={m4 > 0 && m4 < 25 ? 'text-danger font-bold' : ''}>{m4 || '-'}</td>
                  <td className={m5 > 0 && m5 < 25 ? 'text-danger font-bold' : ''}>{m5 || '-'}</td>
                  <td className="font-bold">{tot || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const LabMarks = ({ user }) => {
  const { getStudentMarks, getSubjectsForStudent } = useData();
  const marks = getStudentMarks(user?.id, 'LAB Marks');
  const mySubjects = getSubjectsForStudent(user?.department);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>LAB Marks</h2>
      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Subject Code</th><th>Subject Name</th><th>Faculty Name</th>
              <th>Cycle 1</th><th>Cycle 2</th><th>Cycle 3</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            {mySubjects.length === 0 ? (
              <tr><td colSpan="8" className="text-center text-muted">No subjects assigned yet.</td></tr>
            ) : mySubjects.map((row, idx) => {
              const c1 = parseInt(marks?.['Cycle 1']) || 0;
              const c2 = parseInt(marks?.['Cycle 2']) || 0;
              const c3 = parseInt(marks?.['Cycle 3']) || 0;
              const tot = c1 + c2 + c3;
              const facName = row.facultyId || 'Unknown';

              return (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td><td>-</td><td className="font-bold">{row.subject}</td><td>{facName}</td>
                  <td className={c1 > 0 && c1 < 50 ? 'text-danger font-bold' : ''}>{c1 || '-'}</td>
                  <td className={c2 > 0 && c2 < 50 ? 'text-danger font-bold' : ''}>{c2 || '-'}</td>
                  <td className={c3 > 0 && c3 < 50 ? 'text-danger font-bold' : ''}>{c3 || '-'}</td>
                  <td className="font-bold">{tot || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const AssignmentMarks = ({ user }) => {
  const { getStudentMarks, getSubjectsForStudent } = useData();
  const marks = getStudentMarks(user?.id, 'Assignment Marks');
  const mySubjects = getSubjectsForStudent(user?.department);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Assignment Marks</h2>
      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>S.No</th><th>Subject Code</th><th>Subject Name</th><th>Faculty Name</th>
              <th>A01</th><th>A02</th><th>A03</th><th>A04</th><th>A05</th><th>Total</th>
            </tr>
          </thead>
          <tbody>
            {mySubjects.length === 0 ? (
              <tr><td colSpan="10" className="text-center text-muted">No subjects assigned yet.</td></tr>
            ) : mySubjects.map((row, idx) => {
              const a1 = parseInt(marks?.A01) || 0;
              const a2 = parseInt(marks?.A02) || 0;
              const a3 = parseInt(marks?.A03) || 0;
              const a4 = parseInt(marks?.A04) || 0;
              const a5 = parseInt(marks?.A05) || 0;
              const tot = a1 + a2 + a3 + a4 + a5;
              const facName = row.facultyId || 'Unknown';
              
              return (
                <tr key={row.id || idx}>
                  <td>{idx + 1}</td><td>-</td><td className="font-bold">{row.subject}</td><td>{facName}</td>
                  <td className={a1 > 0 && a1 < 5 ? 'text-danger font-bold' : ''}>{a1 || '-'}</td>
                  <td className={a2 > 0 && a2 < 5 ? 'text-danger font-bold' : ''}>{a2 || '-'}</td>
                  <td className={a3 > 0 && a3 < 5 ? 'text-danger font-bold' : ''}>{a3 || '-'}</td>
                  <td className={a4 > 0 && a4 < 5 ? 'text-danger font-bold' : ''}>{a4 || '-'}</td>
                  <td className={a5 > 0 && a5 < 5 ? 'text-danger font-bold' : ''}>{a5 || '-'}</td>
                  <td className="font-bold">{tot || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// GradeBook uses the imports from the top of the file

export const GradeBook = ({ user }) => {
  const { getSubjectsForStudent } = useData();
  const [sem, setSem] = useState('01');
  const [show, setShow] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const mySubjects = getSubjectsForStudent(user?.department);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('semester_results')
      .select('*')
      .eq('student_id', user.id)
      .eq('semester', parseInt(sem));
    
    if (error) {
      console.error('fetchResults error:', error);
      setResults([]);
    } else {
      setResults(data || []);
    }
    setLoading(false);
    setShow(true);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Grade Book</h2>
      
      <div className="flex-mobile-col" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div className="input-group mobile-w-full" style={{ marginBottom: 0, flex: 1 }}>
          <label>Semester</label>
          <select value={sem} onChange={(e) => { setSem(e.target.value); setShow(false); }}>
            <option value="01">Semester 1 (Year 1)</option>
            <option value="02">Semester 2 (Year 1)</option>
            <option value="03">Semester 3 (Year 2)</option>
            <option value="04">Semester 4 (Year 2)</option>
            <option value="05">Semester 5 (Year 3)</option>
            <option value="06">Semester 6 (Year 3)</option>
            <option value="07">Semester 7 (Year 4)</option>
            <option value="08">Semester 8 (Year 4)</option>
          </select>
        </div>
        <button className="btn btn-primary mobile-w-full" onClick={fetchResults} disabled={loading}>
          {loading ? 'Fetching...' : 'Submit'}
        </button>
      </div>

      {show && (
        <>
          <div className="card table-container" style={{ marginBottom: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>S.No</th><th>Semester</th><th>GPA</th><th>Total Credits</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results && results.length > 0 ? (
                  results.map((res, idx) => (
                    <tr key={res.id}>
                      <td>{idx + 1}</td>
                      <td>Semester {res.semester}</td>
                      <td className="font-bold">{res.gpa.toFixed(2)}</td>
                      <td>{res.total_credits}</td>
                      <td className="text-success font-bold">Pass</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No results found for this semester.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            <p className="font-bold" style={{ marginBottom: '0.5rem' }}>Semester Stats Summary:</p>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Individual subject marks are available in CAT, LAB, and Assignment views. This table shows the consolidated semester performance as uploaded by the administrator.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
