import React from "react";
import { Handle, Position } from "reactflow";

export const CustomNode = ({ data }) => {
  return (
    <div className="p-2 rounded-md border shadow-md bg-white text-sm text-center">
      {/* Handles for connecting */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />

      <div>{data.label}</div>

      <div className="mt-2 flex justify-center gap-2">
        <button
          onClick={data.onEdit}
          className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
        >
          Edit``
        </button>
        <button
          onClick={data.onDelete}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

