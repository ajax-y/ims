import React, { useState } from 'react';

const subjects = [
  { id: 1, code: 'CS101', name: 'Programming in C', faculty: 'Dr. Smith', m1: 85, m2: 90, m3: 75, m4: 20, m5: 88, tot: 358 },
  { id: 2, code: 'CS102', name: 'Data Structures', faculty: 'Prof. John', m1: 65, m2: 50, m3: 45, m4: 55, m5: 60, tot: 275 },
];

const labs = [
  { id: 1, code: 'CS111', name: 'Programming Lab', faculty: 'Dr. Smith', c1: 85, c2: 45, c3: 90, tot: 220 },
];

const grades = [
  { id: 1, year: '2025-2026', sem: '01', code: 'CS101', name: 'Programming in C', grade: 'O', result: 'Pass', examMonth: 'Nov 2025' },
  { id: 2, year: '2025-2026', sem: '01', code: 'CS102', name: 'Data Structures', grade: 'C', result: 'Fail', examMonth: 'Nov 2025' },
];

export const CATMarks = () => (
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
          {subjects.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td><td>{row.code}</td><td>{row.name}</td><td>{row.faculty}</td>
              <td className={row.m1 < 25 ? 'text-danger font-bold' : ''}>{row.m1}</td>
              <td className={row.m2 < 25 ? 'text-danger font-bold' : ''}>{row.m2}</td>
              <td className={row.m3 < 25 ? 'text-danger font-bold' : ''}>{row.m3}</td>
              <td className={row.m4 < 25 ? 'text-danger font-bold' : ''}>{row.m4}</td>
              <td className={row.m5 < 25 ? 'text-danger font-bold' : ''}>{row.m5}</td>
              <td className="font-bold">{row.tot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const LabMarks = () => (
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
          {labs.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td><td>{row.code}</td><td>{row.name}</td><td>{row.faculty}</td>
              <td className={row.c1 < 50 ? 'text-danger font-bold' : ''}>{row.c1}</td>
              <td className={row.c2 < 50 ? 'text-danger font-bold' : ''}>{row.c2}</td>
              <td className={row.c3 < 50 ? 'text-danger font-bold' : ''}>{row.c3}</td>
              <td className="font-bold">{row.tot}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const AssignmentMarks = () => (
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
          {/* using subject data but max score logic differs */}
          {subjects.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td><td>{row.code}</td><td>{row.name}</td><td>{row.faculty}</td>
              <td className={(row.m1/10) < 5 ? 'text-danger font-bold' : ''}>{Math.round(row.m1/10)}</td>
              <td className={(row.m2/10) < 5 ? 'text-danger font-bold' : ''}>{Math.round(row.m2/10)}</td>
              <td className={(row.m3/10) < 5 ? 'text-danger font-bold' : ''}>{Math.round(row.m3/10)}</td>
              <td className={(row.m4/10) < 5 ? 'text-danger font-bold' : ''}>{Math.round(row.m4/10)}</td>
              <td className={(row.m5/10) < 5 ? 'text-danger font-bold' : ''}>{Math.round(row.m5/10)}</td>
              <td className="font-bold">{Math.round(row.tot/10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const GradeBook = () => {
  const [sem, setSem] = useState('01');
  const [show, setShow] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Grade Book</h2>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
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
        <button className="btn btn-primary" onClick={() => setShow(true)}>Submit</button>
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
                {grades.map((row) => {
                  const isFail = row.grade === 'C' && row.result === 'Fail';
                  return (
                    <tr key={row.id}>
                      <td>{row.id}</td><td>{row.year}</td><td>{row.sem}</td><td>{row.code}</td>
                      <td>{row.name}</td>
                      <td className={isFail ? 'text-danger font-bold' : ''}>{row.grade}</td>
                      <td className={isFail ? 'text-danger font-bold' : ''}>{row.result}</td>
                      <td>{row.examMonth}</td>
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
