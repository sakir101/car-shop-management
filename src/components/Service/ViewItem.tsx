import React from "react";
import { Card, Button, message } from "antd";
import ServiceDeleteModal from "./DeleteModal";

/**
 * ViewItem component displays a card with a title, code, and action buttons for viewing and deleting the item.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the item.
 * @param {string} props.code - The code of the item.
 * @param {Function} props.onView - The function to call when the view button is clicked.
 * @param {Function} props.onDelete - The function to call when the delete button is clicked, with the item's code as an argument.
 *
 * @returns {JSX.Element} The rendered ViewItem component.
 */
const ViewItem: React.FC<{
  title: string;
  code: string;
  onView: () => void;
  onDelete: (code: string) => void;
}> = ({ title, code, onView, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  return (
    <Card size="small">
      <div className="grid grid-cols-3 gap-2"> 
        <p>{title}</p>
        <p>
          <b>Code:</b> {code}
        </p>
        <div className="flex flex-row gap-2 justify-end">
          <Button type="primary" onClick={onView}>
            View
          </Button>
          {/* <Button type="primary" danger onClick={() => setIsDeleteModalOpen(true)}>
                        Delete
                    </Button> */}
        </div>
      </div>
      <ServiceDeleteModal
        serviceCode={code}
        isModalOpen={isDeleteModalOpen}
        handleOk={() => {
          setIsDeleteModalOpen(false);
          onDelete(code);
        }}
        handleCancel={() => setIsDeleteModalOpen(false)}
      />
    </Card>
  );
};

export default ViewItem;
