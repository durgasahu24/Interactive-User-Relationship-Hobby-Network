import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Graph } from '../components/Graph';
import { UserForm } from '../components/UserForm';

export const Home = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-2 flex flex-col mt-8">
        <UserForm />
        <div className="flex-1 mt-14">
          <Graph />
        </div>
      </div>
    </div>
  );
};
