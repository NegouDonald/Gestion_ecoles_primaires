import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import DashboardLayout from './components/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';

import StudentList from './pages/students/StudentList';
import StudentCreate from './pages/students/StudentCreate';
import StudentDetail from './pages/students/StudentDetail';

import TeacherList from './pages/teachers/TeacherList';
import TeacherCreate from './pages/teachers/TeacherCreate';
import TeacherDetail from './pages/teachers/TeacherDetail';
import TeacherEdit from './pages/teachers/TeacherEdit';

import SubjectList from './pages/subjects/SubjectList';
import SubjectCreate from './pages/subjects/SubjectCreate';
import SubjectDetail from './pages/subjects/SubjectDetail';
import SubjectEdit from './pages/subjects/SubjectEdit';

import ClassList from './pages/classes/ClassList';
import ClassCreate from './pages/classes/ClassCreate';
import ClassDetail from './pages/classes/ClassDetail';
import ClassEdit from './pages/classes/ClassEdit';

import EquipmentList from './pages/equipment/EquipmentList';
import EquipmentCreate from './pages/equipment/EquipmentCreate';
import EquipmentDetail from './pages/equipment/EquipmentDetail';
import EquipmentEdit from './pages/equipment/EquipmentEdit';

import PurchaseList from './pages/purchases/PurchaseList';
import PurchaseCreate from './pages/purchases/PurchaseCreate';
import PurchaseDetail from './pages/purchases/PurchaseDetail';
import PurchaseEdit from './pages/purchases/PurchaseEdit';

import StaffList from './pages/staff/StaffList';
import StaffCreate from './pages/staff/StaffCreate';
import StaffDetail from './pages/staff/StaffDetail';
import StaffEdit from './pages/staff/StaffEdit';

import DisciplineList from './pages/discipline/DisciplineList';
import DisciplineCreate from './pages/discipline/DisciplineCreate';
import DisciplineDetail from './pages/discipline/DisciplineDetail';
import DisciplineEdit from './pages/discipline/DisciplineEdit';

import Notifications from './pages/notifications/Notifications';

import GradeList from './pages/grades/GradeList';
import GradeCreate from './pages/grades/GradeCreate';
import GradeEdit from './pages/grades/GradeEdit';
import ReportCard from './pages/grades/ReportCard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Students */}
          <Route path="/dashboard/students" element={<StudentList />} />
          <Route path="/dashboard/students/class/:classId" element={<StudentList />} />
          <Route path="/dashboard/students/create" element={<StudentCreate />} />
          <Route path="/dashboard/students/:id" element={<StudentDetail />} />

          {/* Teachers */}
          <Route path="/dashboard/teachers" element={<TeacherList />} />
          <Route path="/dashboard/teachers/create" element={<TeacherCreate />} />
          <Route path="/dashboard/teachers/:id" element={<TeacherDetail />} />
          <Route path="/dashboard/teachers/edit/:id" element={<TeacherEdit />} />

          {/* Subjects */}
          <Route path="/dashboard/subjects" element={<SubjectList />} />
          <Route path="/dashboard/subjects/create" element={<SubjectCreate />} />
          <Route path="/dashboard/subjects/:id" element={<SubjectDetail />} />
          <Route path="/dashboard/subjects/edit/:id" element={<SubjectEdit />} />

          {/* Classes */}
          <Route path="/dashboard/classes" element={<ClassList />} />
          <Route path="/dashboard/classes/create" element={<ClassCreate />} />
          <Route path="/dashboard/classes/:id" element={<ClassDetail />} />
          <Route path="/dashboard/classes/edit/:id" element={<ClassEdit />} />

          {/* Equipment */}
          <Route path="/dashboard/equipment" element={<EquipmentList />} />
          <Route path="/dashboard/equipment/create" element={<EquipmentCreate />} />
          <Route path="/dashboard/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/dashboard/equipment/edit/:id" element={<EquipmentEdit />} />

          {/* Purchases */}
          <Route path="/dashboard/purchases" element={<PurchaseList />} />
          <Route path="/dashboard/purchases/create" element={<PurchaseCreate />} />
          <Route path="/dashboard/purchases/:id" element={<PurchaseDetail />} />
          <Route path="/dashboard/purchases/edit/:id" element={<PurchaseEdit />} />

          {/* Staff */}
          <Route path="/dashboard/staff" element={<StaffList />} />
          <Route path="/dashboard/staff/create" element={<StaffCreate />} />
          <Route path="/dashboard/staff/:id" element={<StaffDetail />} />
          <Route path="/dashboard/staff/edit/:id" element={<StaffEdit />} />

          {/* Disciplines */}
          <Route path="/dashboard/disciplines" element={<DisciplineList />} />
          <Route path="/dashboard/disciplines/new" element={<DisciplineCreate />} />
          <Route path="/dashboard/disciplines/:id" element={<DisciplineDetail />} />
          <Route path="/dashboard/disciplines/:id/edit" element={<DisciplineEdit />} />

          {/* Grades */}
          <Route path="/dashboard/grades" element={<GradeList />} />
          <Route path="/dashboard/grades/entry" element={<GradeCreate />} />
          <Route path="/dashboard/grades/edit/:id" element={<GradeEdit />} />
          <Route path="/dashboard/grades/report/:studentId" element={<ReportCard />} />

          {/* Notifications */}
          <Route path="/dashboard/notifications" element={<Notifications />} />

          {/* Redirection et fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<div className="text-2xl font-bold text-center mt-8">Page non trouvée</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
