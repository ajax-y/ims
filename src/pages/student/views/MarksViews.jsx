import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';

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

export const GradeBook = ({ user }) => {
  const { getSubjectsForStudent } = useData();
  const [sem, setSem] = useState('01');
  const [show, setShow] = useState(false);
  
  const mySubjects = getSubjectsForStudent(user?.department);

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
        <button className="btn btn-primary mobile-w-full" onClick={() => setShow(true)}>Submit</button>
      </div>

      {show && (
        <>
          <div className="card table-container" style={{ marginBottom: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>S.No</th><th>Academic Year</th><th>Semester</th><th>Subject Code</th>
                  <th>Subject Name</th><th>Grade</th><th>Result</th><th>Exam Month and Year</th>
                </tr>
              </thead>
              <tbody>
                {mySubjects.length === 0 ? (
                  <tr><td colSpan="8" className="text-center text-muted">No subjects assigned yet.</td></tr>
                ) : mySubjects.map((row, idx) => {
                  // For simulation purposes using O grade
                  const grade = 'O'; 
                  const result = 'Pass';
                  
                  return (
                    <tr key={row.id || idx}>
                      <td>{idx + 1}</td><td>2025-2026</td><td>{sem}</td><td>-</td>
                      <td className="font-bold">{row.subject}</td>
                      <td>{grade}</td>
                      <td className="text-success font-bold">{result}</td>
                      <td>Nov 2025</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--secondary)', borderRadius: 'var(--radius-md)' }}>
            <p className="font-bold" style={{ marginBottom: '0.5rem' }}>Legends:</p>
            <ul style={{ listStyleType: 'none', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem' }}>
              <li><strong>RA</strong> - Reappearance is required</li>
              <li><strong>RA*</strong> - Absent for End exam</li>
              <li><strong>W/WD</strong> - Withdrawal</li>
              <li><strong>SA</strong> - Shortage of Attendance</li>
              <li><strong>SE</strong> - Sports Exemption</li>
              <li><strong>Wh1</strong> - Suspected Malpractise</li>
              <li><strong>Wh2</strong> - Contact COE Office</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
