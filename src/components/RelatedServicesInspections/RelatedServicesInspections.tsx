import React, { useEffect } from "react";
import { ArrowUpOutlined, ArrowDownOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons";
import ViewTable from "../ViewItems/ViewTable";
import {
  useGetRelatedServicesAndInspectionsFromServiceQuery,
  useGetRelatedServicesAndInspectionsQuery,
} from "@/redux/api/estimateApi";

const RelatedServicesInspections = ({
  code,
  page,
}: {
  code: any;
  page?: string;
}) => {
  const [concernCode, setConcernCode] = React.useState("");
  const [serviceCode, setServiceCode] = React.useState("");
  const [relatedServices, setRelatedServices] = React.useState([]);
  const [relatedInspections, setRelatedInspections] = React.useState([]);
  const [relatedServicesCollapse, setRelatedServicesCollapse] =
    React.useState(true);
  const [relatedInspectionsCollapse, setRelatedInspectionsCollapse] =
    React.useState(true);

  useEffect(() => {
    if (code?.concernCode) {
      setConcernCode(code?.concernCode);
    }
    if (code?.serviceCode) {
      setServiceCode(code?.serviceCode);
    }
  }, [code, setConcernCode, setServiceCode]);

  const { data } = useGetRelatedServicesAndInspectionsQuery(
    { concernCode },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: serviceData } =
    useGetRelatedServicesAndInspectionsFromServiceQuery(
      { serviceCode },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    if (data?.services) {
      setRelatedServices(data?.services);
    }
    if (data?.inspections) {
      setRelatedInspections(data?.inspections);
    }
    if (serviceData?.services) {
      setRelatedServices(serviceData?.services);
    }
    if (serviceData?.inspections) {
      setRelatedInspections(serviceData?.inspections);
    }
  }, [data, serviceData]);

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
               Related Services
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
                  page={"related-services"}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div></div>
      )}
      {page !== "service-advisor" && relatedInspections.length ? (
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
              <p className="text-sm text-slate-900 mx-4">
               Related Inspections
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
                  page={"related-inspections"}
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

export default RelatedServicesInspections;
