import React, { useState } from 'react';
import DashboardLayout from '../../src/dashboard/DashboardLayout';
import OverviewPage from '../dashboard/pages/OverviewPage';
import UsersPage from '../dashboard/pages/UsersPage';
import DoctorsPage from '../dashboard/pages/DoctorsPage';
import { PatientsPage, AppointmentsPage, SlotsPage, PaymentsPage, FindingsPage, TherapiesPage } from '../dashboard/pages/OtherPages';
import { getSession } from '../services/authService';

export default function Dashboard() {
  const { role } = getSession();
  const [activePage, setActivePage] = useState('overview');

  const pages = {
    overview:     <OverviewPage />,
    users:        <UsersPage />,
    doctors:      <DoctorsPage />,
    patients:     <PatientsPage />,
    appointments: <AppointmentsPage />,
    slots:        <SlotsPage />,
    payments:     <PaymentsPage />,
    findings:     <FindingsPage />,
    therapies:    <TherapiesPage />,
  };

  
  const roleAccess = {
    users:        ['Admin'],
    patients:     ['Admin','Doctor','Receptionist'],
    appointments: ['Admin','Doctor','Receptionist','Guardian'],
    payments:     ['Admin','Receptionist','Guardian'],
    findings:     ['Admin','Doctor','Guardian'],
  };

  function handleNavigate(page) {
    const allowed = roleAccess[page];
    if (!allowed || allowed.includes(role)) setActivePage(page);
  }

  return (
    <DashboardLayout activePage={activePage} onNavigate={handleNavigate}>
      {pages[activePage] || <OverviewPage />}
    </DashboardLayout>
  );
}
