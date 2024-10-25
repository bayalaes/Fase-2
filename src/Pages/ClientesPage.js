import React from 'react';
import ClienteList from '../components/ClienteList';
import ClienteForm from '../components/ClienteForm';

const ClientesPage = () => {
  return (
    <div>
      <ClienteForm />
      <ClienteList />
    </div>
  );
};

export default ClientesPage;
