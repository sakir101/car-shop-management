// "use client";

// import { useState } from "react";
// import { Button, Card } from "antd";
// import Form from "@/components/Forms/Form";
// import FormInput from "@/components/Forms/FormInput";
// import FormTextArea from "@/components/Forms/FormTextArea";
// import SearchBar from "@/components/Common/SearchBar";

// export interface InspectionItem {
//   code: string;
//   name: string;
//   type: string;
// }

// interface InspectionFormProps {
//   onSearch: (query: string) => void;
//   data: InspectionItem[] | null;
//   searchLoading: boolean;
//   searchError: any;
//   selectedItems: InspectionItem[];
//   setSelectedItems: React.Dispatch<React.SetStateAction<InspectionItem[]>>;
//   onSubmit: (values: any, selectedItems: InspectionItem[]) => void;
//   isSubmitting: boolean;
//   formTitle: string;
// }

// const InspectionForm: React.FC<InspectionFormProps> = ({
//   onSearch,
//   data,
//   searchLoading,
//   searchError,
//   selectedItems,
//   setSelectedItems,
//   onSubmit,
//   isSubmitting,
//   formTitle,
// }) => {
//   const handleSelectItem = (item: InspectionItem) => {
//     if (!selectedItems.some((selected) => selected.code === item.code)) {
//       setSelectedItems((prev) => [...prev, item]);
//     }
//   };

//   const handleRemoveItem = (code: string) => {
//     setSelectedItems((prev) => prev.filter((item) => item.code !== code));
//   };

//   return (
//     <div className="w-[70%] mx-auto py-10">
//       <h1 className="mx-auto font-normal text-center text-gray-700 mb-5">
//         {formTitle}
//       </h1>
//       <Form submitHandler={(values) => onSubmit(values, selectedItems)} formKey="inspection-form">
//         {/* Main Form */}
//         <div className="p-8 border border-gray-300 rounded-md">
//           <div className="my-5">
//             <FormInput
//               name="title"
//               type="text"
//               size="large"
//               label="Title"
//               placeholder="Enter your title"
//               required
//             />
//           </div>
//           <div className="my-5">
//             <FormInput
//               name="code"
//               type="text"
//               size="large"
//               label="Code"
//               placeholder="Enter your code"
//               required
//             />
//           </div>
//           <div className="my-5">
//             <FormTextArea name="description" label="Description" required />
//           </div>
//         </div>

//         {/* Search Section */}
//         <div className="my-5">
//           <SearchBar
//             formKey="search-bar"
//             label="Add Inspection Items"
//             placeholder="Type to search..."
//             debounceTime={500}
//             onInputChange={onSearch}
//           />
//           {searchLoading && <p>Loading...</p>}
//           {searchError && <p className="text-red-500">Error fetching results.</p>}

//           {/* {searchResults && (
//             <ul className="mt-3 bg-white border rounded shadow">
//               {searchResults.map((item) => (
//                 <li
//                   key={item.code}
//                   className="p-2 cursor-pointer hover:bg-gray-200"
//                   onClick={() => handleSelectItem(item)}
//                 >
//                   {item.name}
//                 </li>
//               ))}
//             </ul>
//           )} */}
//           {/* Display search results */}
// {data ? (
//   <ul className="mt-3 bg-white border rounded shadow">
//     {Object.values(data as SearchResults)
//       .flat()
//       .map((item) => (
//         <li
//           key={item.code}
//           className="p-2 cursor-pointer hover:bg-gray-200"
//           onClick={() => handleSelectItem(item)}
//         >
//           {item.name}
//         </li>
//       ))}
//   </ul>
// ) : (
//   <p className="text-gray-500">No results found or an error occurred.</p>
// )}

//         </div>

//         {/* Selected Items Section */}
//         <div className="my-5">
//           <h3>Selected Items:</h3>
//           <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {selectedItems.map((item) => (
//               <Card
//                 key={item.code}
//                 title={item.name}
//                 extra={
//                   <Button
//                     type="link"
//                     danger
//                     onClick={() => handleRemoveItem(item.code)}
//                   >
//                     Remove
//                   </Button>
//                 }
//                 className="rounded border shadow-sm"
//               >
//                 <p>Code: {item.code}</p>
//                 <p>Type: {item.type}</p>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-center items-center mt-7">
//           <Button type="primary" className="bg-[#3bc990]" htmlType="submit" loading={isSubmitting}>
//             Submit
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default InspectionForm;
