import React from "react";

const Card = ({ concern, onView }: { concern: any; onView: () => void }) => {
  return (
    <div className="bg-white shadow-md rounded-lg mb-6 overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center">
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-800">{concern.title}</h3>
          <p className="mt-2 text-gray-600 text-sm">{concern.description}</p>
        </div>
        <button
          onClick={onView}
          className="mt-4 sm:mt-0 sm:ml-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default Card;