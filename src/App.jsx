import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './Layout';
import Dashboard from './Pages/Dashboard';
import Invoices from './Pages/Invoices';
import DeliveryNotes from './Pages/DeliveryNotes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Layout currentPageName="Dashboard">
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/invoices"
            element={
              <Layout currentPageName="Invoices">
                <Invoices />
              </Layout>
            }
          />
          <Route
            path="/delivery-notes"
            element={
              <Layout currentPageName="DeliveryNotes">
                <DeliveryNotes />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
