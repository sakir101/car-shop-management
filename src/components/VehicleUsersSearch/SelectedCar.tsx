import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSelectedCar } from '@/redux/slice/CarSlice';
import React from 'react';
import { CloseCircleFilled } from "@ant-design/icons";
const SelectedCar = () => {
    const dispatch = useAppDispatch();
      const selectedCar = useAppSelector((state) => state.carGroupInfo.selectedCar);
      const handleClear = () => {
    dispatch(setSelectedCar(null)); // Clear the selection
  };
    return (
        <div>
            {selectedCar && (
        <div className="related-header-background">
          <div className="related-header-top">
            <h4 className="text-md  text-black">
              Customer Car Information
            </h4>
          </div>
          <div className="p-2 ">
            <div className="relative p-2 bg-[#FFFFFF]  rounded border-solid border-[1px] border-orange-300 shadow-sm w-full">
                 <div>
                   <p>
                    Owner Name : {selectedCar.owner.name}
                  </p>
                  <p>
                  Phone : {selectedCar.owner.contactNum}
                  </p>
                <p>
                 Number Plate :
                  {selectedCar.vehicle.numberPlate}
                </p>
                <p>
                  Model :{selectedCar.vehicle.model}
                </p>
                <p>
                Color :{selectedCar.vehicle.color}
                </p>
                 </div>
                 <div className='absolute top-0 right-0 p-1'>
                  <p
                    onClick={handleClear}
                    className="text-rose-600 text-[22px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              </div>
                
            </div>
          </div>
      )}
        </div>
    );
};

export default SelectedCar;