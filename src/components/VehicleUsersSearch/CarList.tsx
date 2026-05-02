"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSelectedCar } from "@/redux/slice/CarSlice";

import { BsCheckSquareFill } from "react-icons/bs";
import { FaRegSquare } from "react-icons/fa";

interface Vehicle {
  id: string;
  numberPlate: string;
  model: string;
  color: string;
}

interface GroupedData {
  ownerId: string;
  owner: { name: string; contactNum: string };
  cars: Vehicle[];
}

const CarList = ({ groupedCars }: { groupedCars: GroupedData[] }) => {
  const dispatch = useAppDispatch();
  const selectedCar = useAppSelector((state) => state.carGroupInfo.selectedCar);

  const handleSelection = (
    vehicle: Vehicle,
    owner: { name: string; contactNum: string },
    ownerId: string
  ) => {
    if (selectedCar?.vehicle.id === vehicle.id) {
      // Clear the selected car
      dispatch(setSelectedCar(null));
    } else {
      // Set the selected car
      dispatch(
        setSelectedCar({
          vehicle,
          owner,
          ownerId,
        })
      );
    }
  };


  return (
    <div>
      <div className="related-header-top p-2">
        {/* Car Groups */}
        {groupedCars.length > 0 &&
          groupedCars.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className=" bg-[#FFFFFF] p-2 my-2 rounded  w-full"
            >
              <div className="mb-4">
                <div className="flex justify-between gap-2 mb-2">
                  <div>
                    <p >
                      Owner Name : {group.owner?.name}
                    </p>
                    <p >
                      Phone : {group.owner?.contactNum}
                    </p>
                  </div>
                </div>

                <ul >
                  {group.cars.map((vehicle, vehicleIndex) => (
                    <li
                      key={vehicleIndex}
                      className={`p-2 border border-solid space-y-1 border-gray-300 rounded list-none flex gap-3 items-start ${
                        selectedCar?.vehicle.id === vehicle.id
                          ? "bg-green-100"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="mt-1 text-xl cursor-pointer"
                          onClick={() =>
                            handleSelection(vehicle, group.owner, group.ownerId)
                          }
                        >
                          {selectedCar?.vehicle.id === vehicle.id ? (
                            <BsCheckSquareFill />
                          ) : (
                            <FaRegSquare />
                          )}
                        </div>
                        <div>
                          <p>
                            Number Plate : {vehicle.numberPlate}
                          </p>
                          <p>
                            Model :{vehicle.model}
                          </p>
                          <p>
                           Color : {vehicle.color}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
      {/* Selected Car Info */}
      
    </div>
  );
};

export default CarList;
