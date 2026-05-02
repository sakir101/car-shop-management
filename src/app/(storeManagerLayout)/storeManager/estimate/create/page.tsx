'use client'
import EstimateCreate from '@/components/Estimate/EstimateCreate';
import React from 'react';

const page = () => {
  return (
    <div>
      <EstimateCreate createType ={'Estimate'}></EstimateCreate>
    </div>
  );
};

export default page;