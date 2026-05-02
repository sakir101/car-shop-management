import EstimateCreate from '@/components/Estimate/EstimateCreate';
import React from 'react';

const page = () => {
    return (
        <div>
            <EstimateCreate createType="WorkOrder" />
        </div>
    );
};

export default page;