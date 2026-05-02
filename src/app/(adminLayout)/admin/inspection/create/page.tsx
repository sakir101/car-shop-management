"use client";
import { useEffect, useState } from "react";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import { Button, Card, message } from "antd";
import { CheckCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  useSearchInspectionItemsQuery,
  useCreateInspectionMutation,
} from "@/redux/api/inspectionApi";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import SearchAssignInspectionShow from "@/components/SearchAssignItemShow/SearchAssignInspectionShow";
import SearchAssignServiceShow from "@/components/SearchAssignItemShow/SearchAssignServiceShow";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import {
  removeAllInspectionGeneralItems,
  removeAllInspectionTireItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { removeAllAppointmentState } from "@/redux/slice/appointmentSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { inspection } from "@/schemas/inspection";
interface InspectionItem {
  code: string;
  name: string;
  type: string;
}

const InspectionCreate = () => {
  const query: Record<string, any> = {};
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { selectedStages, selectedTypes } =
      useAppSelector((state) => state.selection);
      
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
    dispatch(removeSearchItemShow());
    dispatch(clearAllSelection());
    dispatch(removeAllAppointmentState());
  }, [dispatch]);

  query["searchTerm"] = searchTerm;

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  const { data, isLoading, refetch } = useSearchInspectionItemsQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const inspectionItem: any = data|| [];
   const { inspectionGeneralItemState, inspectiontireItemState } =
    useAppSelector((state) => state.searchItemShow);

  const [sortedInspectionItem, setSortedInspectionItem] = useState<any>([]);
  const [showAdded,setShowAdded]=useState<boolean>(true)
  
  // first time come undifiend that's why use this
  useEffect(() => {
    if (inspectionItem) {
      setSortedInspectionItem(inspectionItem?.data);
    }
  }, [inspectionItem]);
  
  //sort added inspectionItem
    const handleAddedGeneralTireItemFilter = () => {
    const filteredGeneralItem = inspectionItem?.data?.filter((stateItem: any) =>
      inspectionGeneralItemState.some(generalItem => generalItem.generalCode === stateItem.code)
    );
    const filteredTireItem = inspectionItem?.data?.filter((stateItem: any) =>
      inspectiontireItemState.some(tireItem => tireItem.tireCode === stateItem.code)
    );
    setSortedInspectionItem([...(filteredGeneralItem || []), ...(filteredTireItem || [])]);
  
    setShowAdded(false)
  };

  
  // set all inspectionItem in box
  const handleAllInspectionItem = () => {
    setSortedInspectionItem(inspectionItem?.data)
    setShowAdded(true)
  };
  

  const [createInspection, { isLoading: isSubmitting, isSuccess, isError }] =
    useCreateInspectionMutation();
 

  const handleSubmit = async (values: any) => {
    const { code, ...others } = values;
    const formattedValue = {
      code: `IS-${values.code}`,
      ...others,
    };
    const data = {
      ...formattedValue,
      items: [...inspectionGeneralItemState, ...inspectiontireItemState],
    };

    try {
      createInspection({ data: data })
        .unwrap()
        .then(() => {
          message.success("Inspection created successfully");
          dispatch(removeAllInspectionTireItems());
          dispatch(removeAllInspectionGeneralItems());
          dispatch(clearAllSelection());
          dispatch(setResetStatus(true));
          localStorage.setItem("searchValue_mainSearch", "");
        })
        .catch((err) => {
          console.error("Failed to create inspection", err);
          message.error(err.data.message || "Failed to create inspection");
          dispatch(clearResetStatus());
        });
    } catch (error) {
      throw error;
    }
  };
  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  return (
    <div className="page-container">
  <div  className="create-title-submit ">
   <h2 className="page-container">Create inspection</h2>
  </div>
      <Form  className="pt-16" submitHandler={handleSubmit}  resolver={yupResolver(inspection)} formKey="create-item-general">
        {/* Main Form */}
        <div
          
          className="create-container"
        >
          <div className="flex justify-between gap-2">
            <div  className="w-full">
            <FormInput
              name="title"
              type="text"
              size="middle"
              label="Title"
              placeholder="Enter title"
              required
            />
          </div>
          <div className="w-full" >
            <FormInput
              name="code"
              type="text"
              size="middle"
              label="Code"
              placeholder="Enter code"
              required
            />
          </div>
          </div>
          <div>
            <FormTextArea name="description" placeholder="Enter Description" label="Description" required />
          </div>
        </div>

        {/* Search Section */}

        <div className="mt-3">
          <div>
            <label htmlFor="">Search for Inspection Item</label>
          </div>
          <div className="flex items-center gap-1">
            <SearchInput
              placeholder="Search..."
              size="large"
              resetFilters={resetFilters}
            />
             {showAdded?
             <Button
             className=" rounded py-[15px]"
             type="default"
             size="small"
             icon={<CheckCircleOutlined />}
             onClick={handleAddedGeneralTireItemFilter}
           >
             Added
           </Button>: <Button
           className=" rounded py-[15px]"
             type="default"
             size="small"
             icon={<UnorderedListOutlined />}
             onClick={handleAllInspectionItem}
           >
             All
           </Button>}
          </div>
        </div>
        <SearchItemShow
          data={sortedInspectionItem}
          page={"inspection-item"}
          type={true}
        />

        <SearchAssignInspectionShow
          title={`Inspection general Item`}
          style={false}
        />
        <SearchAssignServiceShow title={`Inspection Tire Item`} style={false} />

        {/* Submit Button */}
        <div className="create-submit-button">
          <Button className="bg-neutral-800 font-bold hover:bg-neutral-700 text-white mt-2" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InspectionCreate;
