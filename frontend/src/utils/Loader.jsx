import React from 'react';

function Loader() {
  return ( 
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent"></div>
    </div>
  );
}

export default Loader;
