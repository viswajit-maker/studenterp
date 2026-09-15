import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

const app = express();
const PORT = 3000;

app.use(express.json());

// Setup file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and ZIP are allowed.'));
    }
  }
});

app.post('/api/upload-assignment', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
  }
  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename
  });
});

// Initialize SQLite database
const db = new Database(':memory:');

// Setup schema
db.exec(`
  CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    attendance_percentage REAL NOT NULL,
    average_marks REAL NOT NULL,
    assignment_completion_rate REAL NOT NULL,
    participation_score REAL NOT NULL,
    ssis_score REAL NOT NULL,
    risk_level TEXT NOT NULL
  );
`);

// Generate 100 sample students
const insertStudent = db.prepare(`
  INSERT INTO students (
    name, department, attendance_percentage, average_marks, 
    assignment_completion_rate, participation_score, ssis_score, risk_level
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const departments = ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'];
const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

for (let i = 0; i < 100; i++) {
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  const department = departments[Math.floor(Math.random() * departments.length)];
  
  // Generate realistic but varied data
  const attendance = Math.floor(Math.random() * 60) + 40; // 40-100
  const marks = Math.floor(Math.random() * 70) + 30; // 30-100
  const assignments = Math.floor(Math.random() * 80) + 20; // 20-100
  const participation = Math.floor(Math.random() * 90) + 10; // 10-100
  
  // Calculate SSIS
  const ssis = (0.30 * attendance) + (0.40 * marks) + (0.20 * assignments) + (0.10 * participation);
  
  let riskLevel = 'High Risk';
  if (ssis >= 80) riskLevel = 'Low Risk';
  else if (ssis >= 60) riskLevel = 'Medium Risk';
  
  insertStudent.run(name, department, attendance, marks, assignments, participation, ssis, riskLevel);
}

// API Routes

// --- Student Endpoints ---
app.get('/api/student/assignments', (req, res) => {
  res.json([
    { id: 1, name: 'Calculus Midterm', subject: 'Mathematics', dueDate: '2023-10-15', status: 'Submitted', score: 85 },
    { id: 2, name: 'Physics Lab Report', subject: 'Physics', dueDate: '2023-10-18', status: 'Pending', score: null },
    { id: 3, name: 'Literature Essay', subject: 'English', dueDate: '2023-10-20', status: 'Submitted', score: 92 },
    { id: 4, name: 'Data Structures Project', subject: 'Computer Science', dueDate: '2023-10-25', status: 'Pending', score: null },
    { id: 5, name: 'Chemistry Quiz', subject: 'Chemistry', dueDate: '2023-10-10', status: 'Submitted', score: 78 },
  ]);
});

app.get('/api/student/performance', (req, res) => {
  res.json({
    marksTrend: [
      { month: 'Sep', score: 72 },
      { month: 'Oct', score: 75 },
      { month: 'Nov', score: 78 },
      { month: 'Dec', score: 82 },
      { month: 'Jan', score: 85 },
    ],
    subjectPerformance: [
      { subject: 'Math', score: 85, classAvg: 75 },
      { subject: 'Physics', score: 78, classAvg: 72 },
      { subject: 'English', score: 92, classAvg: 85 },
      { subject: 'History', score: 88, classAvg: 80 },
      { subject: 'CS', score: 95, classAvg: 82 },
    ],
    subjectTable: [
      { subject: 'Mathematics', marks: 85, grade: 'A', trend: 'up' },
      { subject: 'Physics', marks: 78, grade: 'B+', trend: 'down' },
      { subject: 'English Literature', marks: 92, grade: 'A+', trend: 'up' },
      { subject: 'History', marks: 88, grade: 'A', trend: 'flat' },
      { subject: 'Computer Science', marks: 95, grade: 'A+', trend: 'up' },
    ],
    overallAttendance: 92
  });
});

app.get('/api/student/notifications', (req, res) => {
  res.json([
    { id: 1, type: 'alert', title: 'Attendance Warning', message: 'Your attendance in Physics has dropped below 80%.', time: '2 hours ago' },
    { id: 2, type: 'success', title: 'Assignment Graded', message: 'Your Calculus Midterm has been graded. Score: 85%', time: '1 day ago' },
    { id: 3, type: 'info', title: 'New Course Material', message: 'Chapter 5 notes have been uploaded for Data Structures.', time: '2 days ago' },
    { id: 4, type: 'alert', title: 'Upcoming Deadline', message: 'Literature Essay is due tomorrow at 11:59 PM.', time: '3 days ago' },
    { id: 5, type: 'success', title: 'Success Score Improved', message: 'Your overall success score increased by 3 points this week!', time: '1 week ago' },
  ]);
});

// --- Teacher Endpoints ---
app.get('/api/teacher/analytics', (req, res) => {
  res.json({
    classAverage: [
      { subject: 'Algebra', score: 85 },
      { subject: 'Geometry', score: 78 },
      { subject: 'Calculus', score: 62 },
      { subject: 'Statistics', score: 88 },
    ],
    attendanceDist: [
      { name: '90-100%', value: 45 },
      { name: '80-89%', value: 30 },
      { name: '70-79%', value: 15 },
      { name: '<70%', value: 10 },
    ],
    riskDist: [
      { name: 'Low Risk', value: 65 },
      { name: 'Medium Risk', value: 25 },
      { name: 'High Risk', value: 10 },
    ],
    students: [
      { name: 'Alice Smith', attendance: 95, marks: 88, risk: 'Low Risk', completion: 100 },
      { name: 'Bob Johnson', attendance: 72, marks: 65, risk: 'Medium Risk', completion: 80 },
      { name: 'Charlie Brown', attendance: 60, marks: 55, risk: 'High Risk', completion: 50 },
      { name: 'Diana Prince', attendance: 98, marks: 95, risk: 'Low Risk', completion: 100 },
      { name: 'Evan Wright', attendance: 85, marks: 75, risk: 'Medium Risk', completion: 90 },
    ]
  });
});

// --- Parent Endpoints ---
app.get('/api/parent/progress', (req, res) => {
  res.json({
    successScore: 88,
    overallGrade: 'A-',
    marksTrend: [
      { month: 'Sep', score: 72 },
      { month: 'Oct', score: 75 },
      { month: 'Nov', score: 78 },
      { month: 'Dec', score: 82 },
      { month: 'Jan', score: 85 },
    ],
    subjectProgress: [
      { subject: 'Math', score: 85 },
      { subject: 'Physics', score: 78 },
      { subject: 'English', score: 92 },
      { subject: 'History', score: 88 },
      { subject: 'CS', score: 95 },
    ],
    assignments: [
      { id: 1, name: 'Calculus Midterm', subject: 'Mathematics', status: 'Submitted', score: 85 },
      { id: 2, name: 'Physics Lab Report', subject: 'Physics', status: 'Pending', score: null },
      { id: 3, name: 'Literature Essay', subject: 'English', status: 'Submitted', score: 92 },
    ]
  });
});

app.get('/api/parent/attendance', (req, res) => {
  res.json({
    overallAttendance: 90,
    attendanceHistory: [
      { month: 'Sep', attendance: 95 },
      { month: 'Oct', attendance: 92 },
      { month: 'Nov', attendance: 88 },
      { month: 'Dec', attendance: 85 },
      { month: 'Jan', attendance: 90 },
    ],
    recentRecords: [
      { date: '2023-10-15', status: 'Present', subject: 'Mathematics' },
      { date: '2023-10-15', status: 'Present', subject: 'Physics' },
      { date: '2023-10-14', status: 'Absent', subject: 'English' },
      { date: '2023-10-14', status: 'Present', subject: 'History' },
      { date: '2023-10-13', status: 'Late', subject: 'Computer Science' },
    ]
  });
});

app.get('/api/parent/meetings', (req, res) => {
  res.json([
    { id: 1, teacher: 'Mr. Anderson', subject: 'Calculus', date: '2023-10-20', time: '14:00', type: 'Video Call', status: 'Scheduled' },
    { id: 2, teacher: 'Ms. Davis', subject: 'Physics', date: '2023-10-22', time: '15:30', type: 'In-Person', status: 'Pending' },
    { id: 3, teacher: 'Mrs. Smith', subject: 'English', date: '2023-09-15', time: '10:00', type: 'Video Call', status: 'Completed' },
  ]);
});

// --- Admin Endpoints ---
let teachersData = [
  { id: 1, name: 'Dr. Alan Turing', teacher_id: 'T-001', department: 'Computer Science', email: 'alan.turing@studentintel.edu', phone: '555-0101', subjects: 'Data Structures, Algorithms', students: 120, rating: 4.8 },
  { id: 2, name: 'Prof. Marie Curie', teacher_id: 'T-002', department: 'Physics', email: 'marie.curie@studentintel.edu', phone: '555-0102', subjects: 'Quantum Mechanics, Thermodynamics', students: 85, rating: 4.9 },
  { id: 3, name: 'Dr. Richard Feynman', teacher_id: 'T-003', department: 'Physics', email: 'richard.feynman@studentintel.edu', phone: '555-0103', subjects: 'Electromagnetism', students: 150, rating: 4.7 },
  { id: 4, name: 'Prof. Ada Lovelace', teacher_id: 'T-004', department: 'Mathematics', email: 'ada.lovelace@studentintel.edu', phone: '555-0104', subjects: 'Calculus, Linear Algebra', students: 200, rating: 4.6 },
  { id: 5, name: 'Dr. Jane Goodall', teacher_id: 'T-005', department: 'Biology', email: 'jane.goodall@studentintel.edu', phone: '555-0105', subjects: 'Ecology, Zoology', students: 95, rating: 4.9 },
];

let alertLogs = [
  { id: 1, studentName: 'David Johnson', studentId: 'STU123', department: 'Computer Science', ssisScore: 55.8, teacherEmail: 'alan.turing@studentintel.edu', teacherName: 'Dr. Alan Turing', riskLevel: 'High Risk', status: 'Email Sent', timestamp: '10:42 AM' },
  { id: 2, studentName: 'Patricia Davis', studentId: 'STU124', department: 'Physics', ssisScore: 44.1, teacherEmail: 'marie.curie@studentintel.edu', teacherName: 'Prof. Marie Curie', riskLevel: 'High Risk', status: 'Email Sent', timestamp: '10:43 AM' }
];

app.get('/api/teacher/alerts', (req, res) => {
  res.json(alertLogs);
});

app.get('/api/admin/teachers', (req, res) => {
  res.json(teachersData);
});

app.post('/api/admin/teachers', (req, res) => {
  const newTeacher = { ...req.body, id: Date.now(), subjects: 'TBD', students: 0, rating: 0 };
  teachersData.push(newTeacher);
  res.json(newTeacher);
});

app.put('/api/admin/teachers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = teachersData.findIndex(t => t.id === id);
  if (index !== -1) {
    teachersData[index] = { ...teachersData[index], ...req.body };
    res.json(teachersData[index]);
  } else {
    res.status(404).json({ error: 'Teacher not found' });
  }
});

app.post('/api/send-alert', (req, res) => {
  const { studentName, studentId, department, ssisScore, teacherEmail } = req.body;
  
  const teacher = teachersData.find(t => t.email === teacherEmail);
  const teacherName = teacher ? teacher.name : 'Teacher';
  
  const newAlert = {
    id: Date.now(),
    studentName,
    studentId: studentId || 'N/A',
    department,
    ssisScore,
    teacherEmail,
    teacherName,
    riskLevel: 'High Risk',
    status: 'Email Sent',
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
  alertLogs.unshift(newAlert);

  console.log(`\n=== EMAIL ALERT SENT ===`);
  console.log(`To: ${teacherEmail}`);
  console.log(`Subject: High Risk Student Alert`);
  console.log(`Body:`);
  console.log(`A student in your department has been identified as HIGH RISK.`);
  console.log(`Student Name: ${studentName}`);
  console.log(`Student ID: ${studentId || 'N/A'}`);
  console.log(`Department: ${department}`);
  console.log(`SSIS Score: ${ssisScore}`);
  console.log(`Please review the student's academic performance and take necessary action.`);
  console.log(`========================\n`);
  res.json({ success: true, alert: newAlert });
});

app.get('/api/admin/departments', (req, res) => {
  res.json({
    departments: [
      { name: 'Computer Science', students: 450, avgScore: 82, highRisk: 15, mediumRisk: 30, lowRisk: 405 },
      { name: 'Mathematics', students: 320, avgScore: 78, highRisk: 25, mediumRisk: 45, lowRisk: 250 },
      { name: 'Physics', students: 280, avgScore: 75, highRisk: 30, mediumRisk: 50, lowRisk: 200 },
      { name: 'Biology', students: 350, avgScore: 85, highRisk: 10, mediumRisk: 20, lowRisk: 320 },
      { name: 'Chemistry', students: 290, avgScore: 80, highRisk: 20, mediumRisk: 35, lowRisk: 235 },
    ],
    riskDistribution: [
      { name: 'Computer Science', highRisk: 15, mediumRisk: 30, lowRisk: 405 },
      { name: 'Mathematics', highRisk: 25, mediumRisk: 45, lowRisk: 250 },
      { name: 'Physics', highRisk: 30, mediumRisk: 50, lowRisk: 200 },
      { name: 'Biology', highRisk: 10, mediumRisk: 20, lowRisk: 320 },
      { name: 'Chemistry', highRisk: 20, mediumRisk: 35, lowRisk: 235 },
    ]
  });
});

// --- Existing Endpoints ---
app.get('/api/students', (req, res) => {
  const students = db.prepare('SELECT * FROM students').all();
  res.json(students);
});

app.get('/api/dashboard/stats', (req, res) => {
  const students = db.prepare('SELECT * FROM students').all() as any[];
  
  const totalStudents = students.length;
  const avgSsis = students.reduce((acc, s) => acc + s.ssis_score, 0) / totalStudents;
  
  const highRisk = students.filter(s => s.risk_level === 'High Risk').length;
  const mediumRisk = students.filter(s => s.risk_level === 'Medium Risk').length;
  const highSuccess = students.filter(s => s.risk_level === 'Low Risk').length;
  
  res.json({
    overallScore: avgSsis.toFixed(1),
    highRisk,
    mediumRisk,
    highSuccess
  });
});

// Mock ML Endpoint for Risk Prediction
app.post('/api/predict-risk', (req, res) => {
  const { attendance_percentage, average_marks, assignment_completion_rate, participation_score } = req.body;
  
  // Simple heuristic to mock the Random Forest model
  const ssis = (0.30 * (attendance_percentage || 0)) + 
               (0.40 * (average_marks || 0)) + 
               (0.20 * (assignment_completion_rate || 0)) + 
               (0.10 * (participation_score || 0));
  
  let risk_level = 'High Risk';
  let confidence = 0.85;
  if (ssis >= 80) {
    risk_level = 'Low Risk';
    confidence = 0.92;
  } else if (ssis >= 60) {
    risk_level = 'Medium Risk';
    confidence = 0.78;
  }
  
  // 🔥 Send email if High Risk
  if (risk_level === 'High Risk') {
    try {
      resend.emails.send({
        from: "onboarding@resend.dev",
        to: "aivexus6@gmail.com",
        subject: "High Academic Risk Alert",
        html: "<h2>High Risk Detected</h2><p>Please meet your teacher immediately.</p>"
      });
    } catch (e) {
      console.error("Email sending failed:", e);
    }
  }

  res.json({
    risk_level,
    confidence: (confidence * 100).toFixed(1) + '%',
    ssis_score: ssis.toFixed(1),
    recommendations: risk_level === 'High Risk' 
      ? ['Schedule immediate tutoring', 'Review recent assignments', 'Parent-teacher meeting recommended']
      : risk_level === 'Medium Risk'
      ? ['Monitor attendance closely', 'Suggest peer study groups']
      : ['Encourage advanced coursework', 'Maintain current study habits']
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
