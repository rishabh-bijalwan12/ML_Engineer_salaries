import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function SecondTable() {
  const location = useLocation();
  const { year, jobTitleCounts } = location.state;

  const jobTitleCountArray = Object.entries(jobTitleCounts).map(([jobTitle, count]) => ({
    jobTitle,
    count
  }));

  const [data, setData] = useState([]);

  useEffect(() => {
    setData(jobTitleCountArray);
  }, []);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const compareValues = (a, b) => {
    if (!sortBy) return 0;
    if (a[sortBy] < b[sortBy]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  };

  const sortedData = [...data].sort(compareValues);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = sortedData.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 1));
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const sortingIndicator = (columnKey) => {
    if (sortBy === columnKey) {
      return sortOrder === 'asc' ? ' 🔼' : ' 🔽';
    }
    return '';
  };

  return (
    <>
      <h1 className="text-5xl mt-4 text-center text-red-900 mb-8 font-bold">
        Various Job Details for {year}
      </h1>
      <div style={{ height: "450px" }} className="max-w-7xl mx-auto overflow-y-auto border border-gray-300 rounded-lg shadow-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-6 border-b border-gray-200 cursor-pointer text-left" onClick={() => handleSort('jobTitle')}>
                Job Title{sortingIndicator('jobTitle')}
              </th>
              <th className="py-3 px-6 border-b border-gray-200 cursor-pointer text-right" onClick={() => handleSort('count')}>
                No of Times Appeared{sortingIndicator('count')}
              </th>
            </tr>
          </thead>
          <tbody className='font-semibold'>
            {currentData.map((item, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}>
                <td className="py-3 px-6 border-b border-gray-200 text-left">{item.jobTitle}</td>
                <td className="py-3 px-6 border-b border-gray-200 text-right">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm" onClick={handleFirstPage} disabled={currentPage === 1}>First</button>
        <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
        <span className="mx-2">Page {currentPage} of {totalPages}</span>
        <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm" onClick={handleLastPage} disabled={currentPage === totalPages}>Last</button>
      </div>
    </>
  );
}

export default SecondTable;
