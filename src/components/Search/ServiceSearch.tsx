'use client';

import React, { useState, useEffect } from 'react';
import SearchInput from '@/components/Search/SearchInput';
import { useSearchServiceMutation } from '@/redux/api/serviceApi';

interface ServiceSearchProps {
    onChange?: (item: string) => void;
    onSelect?: (item: any) => void;
    onCreateNewItem: (item: any) => void;
}

/**
 * ServiceSearch component allows users to search for services by name.
 * It uses a search input field to capture user queries and displays the search results.
 * 
 * @component
 * @param {object} props - The properties object.
 * @param {function} props.onChange - Callback function to handle input changes.
 * @param {function} props.onSelect - Callback function to handle item selection.
 * @param {function} props.onCreateNewItem - Callback function to handle creation of a new item.
 * 
 * @returns {JSX.Element} The rendered ServiceSearch component.
 * 
 * @example
 * <ServiceSearch
 *   onChange={(query) => console.log(query)}
 *   onSelect={(item) => console.log(item)}
 *   onCreateNewItem={() => console.log('Create new item')}
 * />
 */
const ServiceSearch: React.FC<ServiceSearchProps> = ({ onChange, onSelect, onCreateNewItem }) => {
    const [searchService, { isLoading }] = useSearchServiceMutation();
    const [query, setQuery] = useState<string>('');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        if (query) {
            searchService(query)
                .unwrap()
                .then((response) => {
                    setData(response.data)
                })
                .catch((error) => console.error('Error:', error));
        }
    }, [query, searchService]);

    const handleInputChange = (item: string) => {
        setQuery(item);
        onChange?.(item);
    };

    const handleSelect = (item: any) => {
        onSelect?.(item);
    };

    return (
        <div>
            <SearchInput
                label="Enter Service Name"
                required={false}
                placeholder="Search for services"
                onSearchChange={handleInputChange}
                isDataLoading={isLoading}
                data={data}
                renderData={(item) => item?.title}
                onSelect={handleSelect}
                // onCreate={onCreateNewItem}
                isCreateDisabled={true}
            />
        </div>
    );
};

export default ServiceSearch;
