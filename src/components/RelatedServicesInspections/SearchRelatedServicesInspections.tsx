import React, { useEffect } from "react";
import { ArrowUpOutlined, ArrowDownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import ViewTable from "../ViewItems/ViewTable";
import {
  useGetRelatedServicesAndInspectionsFromServiceQuery,
  useGetRelatedServicesAndInspectionsQuery,
} from "@/redux/api/estimateApi";
import { useAppSelector } from "@/redux/hooks";

const SearchRelatedServicesInspections = ({
  code,
  page,
}: {
  code: any;
  page?: string;
}) => {
  const [concernCode, setConcernCode] = React.useState("");
  const [serviceCode, setServiceCode] = React.useState("");
  const [type, setType] = React.useState("");
  const [relatedServices, setRelatedServices] = React.useState([]);
  const [relatedInspections, setRelatedInspections] = React.useState([]);
  const [relatedServicesCollapse, setRelatedServicesCollapse] =
    React.useState(true);
  const [relatedInspectionsCollapse, setRelatedInspectionsCollapse] =
    React.useState(true);

  const { searchRelatedService, searchRelatedInspection } = useAppSelector(
    (state) => state.estimateItemShow
  );

  useEffect(() => {
    if (code?.concernCode) {
      setConcernCode(code?.concernCode);
      setType("Concern");
    }
    if (code?.serviceCode) {
      setServiceCode(code?.serviceCode);
      setType("Service");
    }
  }, [code, setConcernCode, setServiceCode]);

  useEffect(() => {
    let filteredInspections: any = [];

    if (type === "Concern" && concernCode) {
      filteredInspections = searchRelatedInspection.filter(
        (item) =>
          item.parentCode === concernCode && item.parentType === "Concern"
      );
    } else if (type === "Service" && serviceCode) {
      filteredInspections = searchRelatedInspection.filter(
        (item) =>
          item.parentCode === serviceCode && item.parentType === "Service"
      );
    }

    setRelatedInspections(filteredInspections);
  }, [type, concernCode, serviceCode, searchRelatedInspection]);

  useEffect(() => {
    let filteredServices: any = [];

    if (type === "Concern" && concernCode) {
      filteredServices = searchRelatedService.filter(
        (item) =>
          item.parentCode === concernCode && item.parentType === "Concern"
      );
    } else if (type === "Service" && serviceCode) {
      filteredServices = searchRelatedService.filter(
        (item) =>
          item.parentCode === serviceCode && item.parentType === "Service"
      );
    }

    setRelatedServices(filteredServices);

    // // Show filtered services only for SR-CARSRV001
    // const debugServices = searchRelatedService.filter(
    //   (item) =>
    //     item.parentCode === "SR-CARSRV001" && item.parentType === "Service"
    // );
  }, [type, concernCode, serviceCode, searchRelatedService]);

  return (
    <div>
      {relatedServices.length ? (
        <div
          className="p-2 rounded border border-gray-200 border-solid my-1"
        >
          <div className="flex items-center">
            <div>
              <button
                type="button"
                className=" bg-transparent cursor-pointer rounded-md  hover:text-black text-sm border-none"
                onClick={() =>
                  setRelatedServicesCollapse(!relatedServicesCollapse)
                }
              >
                {relatedServicesCollapse ? (
                  <MenuOutlined />
                ) : (
                  <CloseOutlined />
                )}
              </button>
            </div>
            <div>
              <p className="text-sm text-slate-800 mx-3">
                Show Related Services
              </p>
            </div>
          </div>
          {relatedServicesCollapse ? (
            <div></div>
          ) : (
            <div>
              {relatedServices.length && (
                <ViewTable
                  ItemArray={relatedServices}
                  page={"related-services-search"}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
      {relatedInspections.length ? (
        <div
          className="p-2 rounded border border-gray-200 border-solid my-1"
        >
          <div className="flex items-center">
            <div>
              <button
                type="button"
                className=" bg-transparent cursor-pointer rounded-md  hover:text-black text-sm border-none"
                onClick={() =>
                  setRelatedInspectionsCollapse(!relatedInspectionsCollapse)
                }
              >
                {relatedInspectionsCollapse ? (
                  <MenuOutlined />
                ) : (
                  <CloseOutlined />
                )}
              </button>
            </div>
            <div>
              <p className="text-sm  text-black mx-1">
                Show Related Inspections
              </p>
            </div>
          </div>
          {relatedInspectionsCollapse ? (
            <div></div>
          ) : (
            <div>
              {relatedInspections.length && (
                <ViewTable
                  ItemArray={relatedInspections}
                  page={"related-inspections-search"}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SearchRelatedServicesInspections;
