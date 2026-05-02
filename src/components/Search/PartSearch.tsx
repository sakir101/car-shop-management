'use client';

import React, { useState, useEffect } from 'react';
import SearchInput from '@/components/Search/SearchInput';
import { useSearchPartsMutation } from '@/redux/api/serviceApi';
import CreatePartModal from './CreatePartModal';

interface PartSearchProps {
    onChange?: (item: string) => void;
    onSelect?: (item: any) => void;
    onCreateNewItem?: (item: any) => void;
}

/**
 * PartSearch component allows users to search for parts, select a part from the search results,
 * and create a new part if it doesn't exist.
 *
 * @component
 * @param {Object} props - The props for the PartSearch component.
 * @param {function} props.onChange - Callback function to handle input change in the search field.
 * @param {function} props.onSelect - Callback function to handle selection of a part from the search results.
 * @param {function} props.onCreateNewItem - Callback function to handle creation of a new part.
 *
 * @returns {JSX.Element} The rendered PartSearch component.
 *
 * @example
 * <PartSearch
 *   onChange={(query) => console.log(query)}
 *   onSelect={(part) => console.log(part)}
 *   onCreateNewItem={(newPart) => console.log(newPart)}
 * />
 */
const PartSearch: React.FC<PartSearchProps> = ({ onChange, onSelect, onCreateNewItem }) => {
    const [searchParts, { isLoading: isSearPartsLoading }] = useSearchPartsMutation();
    const [query, setQuery] = useState<string>('');
    const [data, setData] = useState<any[]>([]);
    const [newPartName, setNewPartName] = useState<string>('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (query) {
            searchParts(query)
                .unwrap()
                .then((response) => setData(response.data))
                .catch((error) => console.error('Error:', error));
        }
    }, [query, searchParts]);

    const handleInputChange = (item: string) => {
        setQuery(item);
        onChange?.(item);
    };

    const handleSelect = (item: any) => {
        const formattedPart = {
            partId: item.partId,
            name: item.name,
            unit: 1,
            unitPrice: item.unitPrice
        };
        onSelect?.(formattedPart);
        setData([]);
    };

    // const formDataHandler = (item: any) => {
    //     item.unitPrice = Number.parseFloat(item.unitPrice);
    //     item.installationHours = Number.parseFloat(item.installationHours);
    //     CreatePart(item).unwrap()
    //     .then((response) => {
    //         onCreateNewItem(response.data);
    //         handleOk();
    //     })
    //     .catch((error) => console.error('Error:', error));
    //     console.log("Part creating", item);
    // }

    const handleCreatePart = (part: any) => {
        onCreateNewItem?.({
            partId: part.partId,
            name: part.name,
            unit: part.unit,
            unitPrice: part.unitPrice
        });
    };

    return (
        <div>
            <SearchInput
                label="Enter Part Name"
                required={false}
                placeholder="Search for parts"
                onSearchChange={handleInputChange}
                isDataLoading={isSearPartsLoading}
                data={data}
                renderData={(item) => item?.name}
                onSelect={handleSelect}
                onCreate={(value) => {
                    setNewPartName(value);
                    showModal();
                }}
            />
            <CreatePartModal
                partName={newPartName}
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                onCreatePart={handleCreatePart}
            />
        </div>
    );
};

export default PartSearch;
