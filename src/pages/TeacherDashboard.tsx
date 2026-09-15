import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Users, AlertTriangle, BookOpen, Activity, BrainCircuit, Mail, X, FileText, Download, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function TeacherDashboard() {
  const { user } = useAuth();
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Record<number, any>>({});
  const [loadingPrediction, setLoadingPrediction] = useState<number | null>(null);
  const [alertLogs, setAlertLogs] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  
  const [teacherDept, setTeacherDept] = useState<string>('Computer Science');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isWeeklyEmailModalOpen, setIsWeeklyEmailModalOpen] = useState(false);
  const [weeklyAlertLogs, setWeeklyAlertLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/teachers')
      .then(res => res.json())
      .then(teachers => {
        const teacher = teachers.find((t: any) => t.email === user?.email);
        if (teacher) {
          setTeacherDept(teacher.department);
        }
      });

    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setAllStudents(data);
      });
      
    fetch('/api/teacher/alerts')
      .then(res => res.json())
      .then(data => setAlertLogs(data));
      
    // Mock weekly alert logs
    setWeeklyAlertLogs([
      { id: 1, reportDate: new Date().toLocaleDateString(), department: teacherDept, highRiskCount: 3, status: 'Generated' },
      { id: 2, reportDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), department: teacherDept, highRiskCount: 2, status: 'Generated' }
    ]);
  }, [user, teacherDept]);

  const deptStudents = allStudents.filter(s => s.department === teacherDept);
  const highRiskStudents = deptStudents.filter(s => s.risk_level === 'High Risk');
  const mediumRiskStudents = deptStudents.filter(s => s.risk_level === 'Medium Risk');
  const lowRiskStudents = deptStudents.filter(s => s.risk_level === 'Low Risk');
  
  const students = deptStudents.filter((s: any) => s.risk_level !== 'Low Risk').slice(0, 5);

  const downloadCSV = () => {
    const headers = ['Student Name', 'Student ID', 'SSIS Score', 'Risk Level'];
    const rows = deptStudents.map(s => [s.name, s.studentId || 'N/A', s.ssis_score, s.risk_level]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'weekly-risk-report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const reportDate = new Date().toLocaleDateString();
    
    doc.setFontSize(18);
    doc.text('Student Intel – Weekly Academic Risk Report', 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Department Name: ${teacherDept}`, 14, 32);
    doc.text(`Report Date: ${reportDate}`, 14, 40);
    
    const tableData = deptStudents.map(s => [
      s.name,
      s.studentId || 'N/A',
      s.ssis_score.toString(),
      s.risk_level
    ]);
    
    autoTable(doc, {
      startY: 50,
      head: [['Student Name', 'Student ID', 'SSIS Score', 'Risk Level']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      didParseCell: function(data: any) {
        if (data.section === 'body' && data.column.index === 3) {
          if (data.cell.raw === 'High Risk') {
            data.cell.styles.textColor = [239, 68, 68]; // red-500
          } else if (data.cell.raw === 'Medium Risk') {
            data.cell.styles.textColor = [249, 115, 22]; // orange-500
          } else {
            data.cell.styles.textColor = [16, 185, 129]; // emerald-500
          }
        }
      }
    });
    
    doc.save('weekly-risk-report.pdf');
  };

  const runPrediction = async (student: any) => {
    setLoadingPrediction(student.id);
    try {
      const res = await fetch('/api/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_percentage: student.attendance_percentage,
          average_marks: student.average_marks,
          assignment_completion_rate: student.assignment_completion_rate,
          participation_score: student.participation_score
        })
      });
      const data = await res.json();
      setPredictions(prev => ({ ...prev, [student.id]: data }));
    } catch (error) {
      console.error("Failed to run prediction", error);
    } finally {
      setLoadingPrediction(null);
    }
  };

  const classPerformance = [
    { topic: 'Algebra', score: 85 },
    { topic: 'Geometry', score: 78 },
    { topic: 'Calculus', score: 62 },
    { topic: 'Statistics', score: 88 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Teacher Dashboard</h1>
        <p className="text-slate-400">Class performance analytics and student risk alerts.</p>
      </div>

      {highRiskStudents.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-red-500 font-semibold text-lg mb-1">High Risk Alert</h3>
            <p className="text-red-400/90">
              ⚠ Weekly Alert: {highRiskStudents.length} {highRiskStudents.length === 1 ? 'student' : 'students'} in your department {highRiskStudents.length === 1 ? 'is' : 'are'} currently classified as High Risk.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Students" value={allStudents.length.toString()} icon={Users} color="text-indigo-400" />
        <MetricCard title="At-Risk Students" value={allStudents.filter(s => s.risk_level !== 'Low Risk').length.toString()} icon={AlertTriangle} color="text-red-400" />
        <MetricCard title="Avg Class Score" value="76%" icon={Activity} color="text-emerald-400" />
        <MetricCard title="Assignments Pending" value="15" icon={BookOpen} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Risk Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400">Department</p>
                  <p className="text-lg font-semibold text-white">{teacherDept}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400">Report Date</p>
                  <p className="text-lg font-semibold text-white">{new Date().toLocaleDateString()}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <p className="text-sm text-slate-400">Total Students</p>
                  <p className="text-lg font-semibold text-white">{deptStudents.length}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <p className="text-sm text-red-400">High Risk</p>
                  <p className="text-xl font-bold text-red-500">{highRiskStudents.length}</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
                  <p className="text-sm text-orange-400">Medium Risk</p>
                  <p className="text-xl font-bold text-orange-500">{mediumRiskStudents.length}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                  <p className="text-sm text-emerald-400">Low Risk</p>
                  <p className="text-xl font-bold text-emerald-500">{lowRiskStudents.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-6 text-sm">
                <span className="text-slate-400">Email Status:</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  Generated <span className="text-emerald-500">✔</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <FileText className="w-4 h-4" />
                  View Report
                </button>
                <button onClick={() => setIsWeeklyEmailModalOpen(true)} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <Mail className="w-4 h-4" />
                  View Email
                </button>
                <button onClick={downloadPDF} className="flex items-center gap-2 border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button onClick={downloadCSV} className="flex items-center gap-2 border border-slate-700 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <FileSpreadsheet className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Class Performance by Topic</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformance}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="topic" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} 
                    cursor={{fill: '#1e293b', opacity: 0.4}} 
                  />
                  <Bar dataKey="score" fill="url(#colorScore)" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weak Students List & AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Student Name</th>
                      <th className="px-4 py-3">Risk Level</th>
                      <th className="px-4 py-3">AI Prediction</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-800/50 hover:shadow-[inset_4px_0_0_0_rgba(99,102,241,1)] transition-all duration-200">
                        <td className="px-4 py-3 font-medium text-slate-200">
                          <div className="flex items-center gap-2">
                            {student.name}
                            {student.risk_level === 'High Risk' && (
                              <AlertTriangle className="w-4 h-4 text-red-500" title="High Risk Student" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.risk_level === 'High Risk' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {student.risk_level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {predictions[student.id] ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-indigo-400 font-medium">Score: {predictions[student.id].ssis_score}</span>
                              <span className="text-xs text-slate-400">Conf: {predictions[student.id].confidence}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Not run</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => runPrediction(student)}
                            disabled={loadingPrediction === student.id}
                            className="flex items-center gap-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                          >
                            <BrainCircuit className="w-4 h-4" />
                            {loadingPrediction === student.id ? 'Predicting...' : 'Run AI'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High Risk Alert Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Student Name</th>
                      <th className="px-4 py-3">Student ID</th>
                      <th className="px-4 py-3">SSIS</th>
                      <th className="px-4 py-3">Risk Level</th>
                      <th className="px-4 py-3">Alert Status</th>
                      <th className="px-4 py-3">Email Preview</th>
                      <th className="px-4 py-3 rounded-tr-lg">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alertLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50 hover:shadow-[inset_4px_0_0_0_rgba(99,102,241,1)] transition-all duration-200">
                        <td className="px-4 py-3 font-medium text-slate-200">{log.studentName}</td>
                        <td className="px-4 py-3 text-slate-400">{log.studentId}</td>
                        <td className="px-4 py-3 text-slate-300 font-medium">{log.ssisScore}</td>
                        <td className="px-4 py-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            {log.riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                            <Mail className="w-3 h-3" />
                            {log.status}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {log.status === 'Email Sent' && (
                            <button 
                              onClick={() => {
                                setSelectedAlert(log);
                                setIsEmailModalOpen(true);
                              }}
                              className="text-indigo-400 hover:text-indigo-300 transition-colors text-xs font-medium flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              View Email
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{log.timestamp}</td>
                      </tr>
                    ))}
                    {alertLogs.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          No alerts triggered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-orange-500/30 bg-orange-950/10">
            <CardHeader>
              <CardTitle className="text-orange-100">Topic Difficulty Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
                <h4 className="text-sm font-semibold mb-1 text-orange-400">Calculus Alert</h4>
                <p className="text-xs text-slate-300">70% of students scored low in Calculus — revisit topic before the next assessment.</p>
              </div>
            </CardContent>
          </Card>
          
          {Object.keys(predictions).length > 0 && (
            <Card className="border-indigo-500/30 bg-indigo-950/10">
              <CardHeader>
                <CardTitle className="text-indigo-100">Latest AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.values(predictions).slice(-2).map((pred: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg border border-indigo-500/30 bg-indigo-500/5">
                    <h4 className="text-sm font-semibold mb-1 text-indigo-400">Risk: {pred.risk_level}</h4>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {pred.recommendations?.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {isEmailModalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                Email Preview
              </h2>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-[#0b1220] p-4 rounded-lg border border-slate-800 space-y-2 text-sm">
                <div className="flex"><span className="text-slate-500 w-16">To:</span> <span className="text-slate-300">{selectedAlert.teacherEmail}</span></div>
                <div className="flex"><span className="text-slate-500 w-16">From:</span> <a href="mailto:alerts@studentintel.ai" className="text-indigo-400 hover:underline">alerts@studentintel.ai</a></div>
                <div className="flex"><span className="text-slate-500 w-16">Subject:</span> <span className="text-red-400 font-medium">URGENT: High Academic Risk Alert – {selectedAlert.studentName} ({selectedAlert.studentId})</span></div>
              </div>
              
              <div className="bg-[#0b1220] p-6 rounded-lg border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
{`Dear ${selectedAlert.teacherName},

The Student Intel system has detected that one of your students has been classified as HIGH RISK based on academic performance indicators.

Student Details:

Student Name: ${selectedAlert.studentName}
Student ID: ${selectedAlert.studentId}
Department: ${selectedAlert.department}
SSIS Score: ${selectedAlert.ssisScore}

Risk Level: HIGH RISK

Recommendation:
Please review the student's academic progress and provide academic support if necessary.

— Student Intel Early Warning System`}
              </div>
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button onClick={() => setIsEmailModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Weekly Academic Risk Report
              </h2>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Student Name</th>
                      <th className="px-4 py-3">Student ID</th>
                      <th className="px-4 py-3">SSIS Score</th>
                      <th className="px-4 py-3 rounded-tr-lg">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptStudents.map((student) => (
                      <tr key={student.id} className={`border-b border-slate-800 hover:bg-slate-800/30 transition-colors ${student.risk_level === 'High Risk' ? 'bg-red-500/10' : ''}`}>
                        <td className={`px-4 py-3 font-medium ${student.risk_level === 'High Risk' ? 'text-red-400' : 'text-slate-200'}`}>{student.name}</td>
                        <td className={`px-4 py-3 ${student.risk_level === 'High Risk' ? 'text-red-400/80' : 'text-slate-400'}`}>{student.studentId || 'N/A'}</td>
                        <td className={`px-4 py-3 font-medium ${student.risk_level === 'High Risk' ? 'text-red-400' : 'text-slate-300'}`}>{student.ssis_score}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.risk_level === 'High Risk' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                            student.risk_level === 'Medium Risk' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {student.risk_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end shrink-0">
              <button onClick={() => setIsReportModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isWeeklyEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                Weekly Summary Email Preview
              </h2>
              <button onClick={() => setIsWeeklyEmailModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-[#0b1220] p-4 rounded-lg border border-slate-800 space-y-2 text-sm">
                <div className="flex"><span className="text-slate-500 w-16">To:</span> <span className="text-slate-300">{user?.email || 'teacher@studentintel.edu'}</span></div>
                <div className="flex"><span className="text-slate-500 w-16">From:</span> <a href="mailto:reports@studentintel.ai" className="text-indigo-400 hover:underline">reports@studentintel.ai</a></div>
                <div className="flex"><span className="text-slate-500 w-16">Subject:</span> <span className="text-white font-medium">Weekly Student Risk Summary</span></div>
              </div>
              
              <div className="bg-[#0b1220] p-6 rounded-lg border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
{`Dear Professor,

Here is your weekly academic risk summary generated by the Student Intel Early Warning System.

Department: ${teacherDept}
Total Students: ${deptStudents.length}
High Risk Students: ${highRiskStudents.length}
Medium Risk Students: ${mediumRiskStudents.length}
Low Risk Students: ${lowRiskStudents.length}

Students requiring immediate attention:

${highRiskStudents.map(s => `• ${s.name} – ${s.ssis_score}`).join('\n')}

Recommendation:
Please review the academic progress of high-risk students and consider scheduling academic support or mentoring sessions.

— Student Intel AI Academic Monitoring System`}
              </div>
            </div>
            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button onClick={() => setIsWeeklyEmailModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="relative overflow-hidden group hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] bg-slate-900/50 border-slate-800">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardContent className="p-6 flex flex-col gap-4 relative z-10">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">{title}</p>
          <div className={`p-2 rounded-lg bg-slate-800/50 ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
      </CardContent>
    </Card>
  );
}
