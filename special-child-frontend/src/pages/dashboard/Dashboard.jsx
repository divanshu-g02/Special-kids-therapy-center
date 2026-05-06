// src/pages/dashboard/Dashboard.jsx
import { useState } from 'react';
import { getSession } from '../../services/authService';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

// Admin
import AdminOverview     from './admin/AdminOverview';
import AdminUsers        from './admin/AdminUsers';
import AdminDoctors      from './admin/AdminDoctors';
import AdminPatients     from './admin/AdminPatients';
import AdminAppointments from './admin/AdminAppointments';
import AdminSlots        from './admin/AdminSlots';
import AdminPayments     from './admin/AdminPayments';
import AdminFindings     from './admin/AdminFindings';
import AdminTherapies    from './admin/AdminTherapies';

// Doctor
import DoctorOverview     from './doctor/DoctorOverview';
import DoctorAppointments from './doctor/DoctorAppointments';
import DoctorPatients     from './doctor/DoctorPatients';
import DoctorSlots        from './doctor/DoctorSlots';
import DoctorFindings     from './doctor/DoctorFindings';

// Receptionist
import ReceptionistOverview      from './receptionist/ReceptionistOverview';
import ReceptionistPatients      from './receptionist/ReceptionistPatients';
import ReceptionistAppointments  from './receptionist/ReceptionistAppointments';
import ReceptionistSlots         from './receptionist/ReceptionistSlots';
import ReceptionistPayments      from './receptionist/ReceptionistPayments';

// Patient / Guardian
import PatientOverview      from './patient/PatientOverview';
import PatientSlots         from './patient/PatientSlots';
import PatientAppointments  from './patient/PatientAppointments';
import PatientPayments      from './patient/PatientPayments';
import PatientReports       from './patient/PatientReports';

const PAGES_BY_ROLE = {
  Admin: {
    overview:     <AdminOverview />,
    users:        <AdminUsers />,
    doctors:      <AdminDoctors />,
    patients:     <AdminPatients />,
    appointments: <AdminAppointments />,
    therapies:    <AdminTherapies />,
    slots:        <AdminSlots />,
    payments:     <AdminPayments />,
    findings:     <AdminFindings />,
  },
  Doctor: {
    overview:     <DoctorOverview />,
    appointments: <DoctorAppointments />,
    patients:     <DoctorPatients />,
    slots:        <DoctorSlots />,
    findings:     <DoctorFindings />,
  },
  Receptionist: {
    overview:     <ReceptionistOverview />,
    patients:     <ReceptionistPatients />,
    appointments: <ReceptionistAppointments />,
    slots:        <ReceptionistSlots />,
    payments:     <ReceptionistPayments />,
  },
  Patient: {
    overview:     <PatientOverview />,
    slots:        <PatientSlots />,
    appointments: <PatientAppointments />,
    payments:     <PatientPayments />,
    reports:      <PatientReports />,
  },
  Guardian: {
    overview:     <PatientOverview />,
    slots:        <PatientSlots />,
    appointments: <PatientAppointments />,
    findings:     <PatientReports />,
    payments:     <PatientPayments />,
  },
};

export default function Dashboard() {
  const { role } = getSession();
  const [activePage, setActivePage] = useState('overview');

  const pages = PAGES_BY_ROLE[role] || PAGES_BY_ROLE.Patient;

  function handleNavigate(page) {
    if (pages[page]) setActivePage(page);
  }

  return (
    <DashboardLayout activePage={activePage} onNavigate={handleNavigate}>
      {pages[activePage] || pages.overview}
    </DashboardLayout>
  );
}