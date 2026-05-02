import React from 'react';
import { Modal } from 'antd';

interface ServiceDeleteModalProps {
    serviceCode: string;
    isModalOpen: boolean;
    handleOk: (serviceCode: string) => void;
    handleCancel: () => void;
}

/**
 * ServiceDeleteModal component renders a modal dialog for confirming the deletion of a service.
 *
 * @param {string} serviceCode - The code of the service to be deleted.
 * @param {boolean} isModalOpen - A boolean indicating whether the modal is open or not.
 * @param {function} handleOk - A callback function to be called when the "Ok" button is clicked, with the service code as an argument.
 * @param {function} handleCancel - A callback function to be called when the "Cancel" button is clicked.
 *
 * @returns {JSX.Element} The rendered modal component.
 */
const ServiceDeleteModal: React.FC<ServiceDeleteModalProps> = ({ serviceCode, isModalOpen, handleOk, handleCancel }) => (
    <Modal centered title="Delete Service" open={isModalOpen} onOk={() => handleOk(serviceCode)} onCancel={handleCancel}>
        <p>Are you sure you want to delete this service?</p>
    </Modal>
);

export default ServiceDeleteModal;
