import React, { useState, useEffect } from 'react';
import dataFile from './csvjson.json';
import Chartline from './components/chart';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const [data, setData] = useState(dataFile);
  const [yearlyAverageSalaries, setYearlyAverageSalaries] = useState({});
  const [yearlyEntityCounts, setYearlyEntityCounts] = useState({});
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const calculateJobTitleCounts = (year) => {
    const jobTitleCounts = {};
    data.forEach((item) => {
      if (String(item.work_year) === String(year)) {
        if (jobTitleCounts[item.job_title]) {
          jobTitleCounts[item.job_title]++;
        } else {
          jobTitleCounts[item.job_title] = 1;
        }
      }
    });
    return jobTitleCounts;
  };

  const goToSecondTable = (year) => {
    const jobTitleCounts = calculateJobTitleCounts(year);
    navigate('/secondtable', { state: { year: year, jobTitleCounts: jobTitleCounts } });
  };

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

  useEffect(() => {
    const averageSalaries = {};
    const entityCounts = {};

    data.forEach((item) => {
      if (averageSalaries[item.work_year]) {
        averageSalaries[item.work_year].total += item.salary_in_usd;
        averageSalaries[item.work_year].count++;
      } else {
        averageSalaries[item.work_year] = { total: item.salary_in_usd, count: 1 };
      }

      if (entityCounts[item.work_year]) {
        entityCounts[item.work_year]++;
      } else {
        entityCounts[item.work_year] = 1;
      }
    });

    for (let year in averageSalaries) {
      averageSalaries[year] = averageSalaries[year].total / averageSalaries[year].count;
    }

    setYearlyAverageSalaries(averageSalaries);
    setYearlyEntityCounts(entityCounts);
  }, [data]);

  return (
    <div className='container mx-auto p-4 bg-gray-'>
      <div className='text-center mb-6'>
        <h1 className='text-4xl mb-4 text-red-900 font-bold'>
          Analyse ML Jobs Data Of Various Years Through Various Methods
        </h1>
        <div className='w-1/2 border-2 border-red-900 border-dotted mx-auto'></div>
      </div>
      <div className="max-w-7xl mx-auto mb-8">
        <div className='text-center mb-5'>
          <h1 className='text-5xl'>MAIN TABLE</h1>
        </div>
        <div className="overflow-x-auto mb-8">
          <table className="border-2 border-black w-full bg-white mb-2 shadow-md rounded-lg">
            <thead className="bg-black text-white">
              <tr>
                <th className="cursor-pointer py-3 px-2 md:px-6 border-b border-gray-200 text-left" onClick={() => handleSort('work_year')}>
                  Year {sortBy === 'work_year' && (sortOrder === 'asc' ? '⬆️' : '⬇️')}
                </th>
                <th className="cursor-pointer py-3 px-2 md:px-6 border-b border-gray-200 text-center" onClick={() => handleSort('total_jobs')}>
                  Total Jobs {sortBy === 'total_jobs' && (sortOrder === 'asc' ? '⬆️' : '⬇️')}
                </th>
                <th className="cursor-pointer py-3 px-2 md:px-6 border-b border-gray-200 text-center" onClick={() => handleSort('average_salary')}>
                  Average Salary {sortBy === 'average_salary' && (sortOrder === 'asc' ? '⬆️' : '⬇️')}
                </th>
                <th className="py-3 px-2 md:px-6 border-b border-gray-200 text-right">See Data</th>
              </tr>
            </thead>
            <tbody className='font-semibold'>
              {Object.keys(yearlyEntityCounts)
                .sort((a, b) => compareValues({ work_year: a, total_jobs: yearlyEntityCounts[a], average_salary: yearlyAverageSalaries[a] }, { work_year: b, total_jobs: yearlyEntityCounts[b], average_salary: yearlyAverageSalaries[b] }))
                .map((year, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}>
                    <td className="py-4 px-2 md:px-6 border-b border-gray-200 text-left">{year}</td>
                    <td className="py-4 px-2 md:px-6 border-b border-gray-200 text-center">{yearlyEntityCounts[year]}</td>
                    <td className="py-4 px-2 md:px-6 border-b border-gray-200 text-center">
                      {yearlyAverageSalaries[year] ? yearlyAverageSalaries[year].toFixed(2) : 'N/A'}
                    </td>
                    <td className="py-4 px-2 md:px-6 border-b border-gray-200 text-right">
                      <button
                        onClick={() => goToSecondTable(year)}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
                      >
                        See Data
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='w-full border-2 border-black border-dotted mb-4'></div>
        <div className='w-full border-2 border-black border-dotted mb-4'></div>
        <div className='w-full border-2 border-black border-dotted mb-4'></div>
      </div>
      <div className="max-w-7xl mx-auto mb-8">
        <div className='text-center mb-4'>
          <h1 className='text-5xl'>Analyse Data Through Line Graphs</h1>
        </div>
        <div className='flex justify-center'>
          <div className='w-full xl:w-2/3  rounded-lg p-4'>
            <Chartline data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

