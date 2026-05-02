
import { useRouter } from "next/navigation";
import { FiEye, FiTrash2 } from "react-icons/fi";

type TableActionButtonsProps = {
  viewHref: string;
  onDelete: () => void;
};

const TableActionButtons = ({
  viewHref,
  onDelete,
}: TableActionButtonsProps) => {
  const router =useRouter()
  const handleClick = () => {
    router.push(viewHref); 
  };
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
      <button
      onClick={handleClick}
      className="trow-view-button inline-flex items-center gap-1"
    >
      <FiEye className="text-sm" />
      View
    </button>

      <button
        onClick={onDelete}
        className="trow-delete-button"
      >
        <FiTrash2 className="text-sm" />
        Delete
      </button>
    </div>
  );
};

export default TableActionButtons;
