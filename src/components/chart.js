import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Chartline = ({ data }) => {
  const averageSalaryChartRef = useRef(null);
  const totalJobsChartRef = useRef(null);
  const averageSalaryChartInstance = useRef(null);
  const totalJobsChartInstance = useRef(null);

  useEffect(() => {
    if (averageSalaryChartInstance.current) {
      averageSalaryChartInstance.current.destroy();
    }
    if (totalJobsChartInstance.current) {
      totalJobsChartInstance.current.destroy();
    }
    renderCharts();
  }, [data]);

  const renderCharts = () => {
    const filteredData = data.filter(item => item.work_year >= 2020 && item.work_year <= 2024);

    const yearlyStats = filteredData.reduce((acc, curr) => {
      const year = curr.work_year;
      const salary = curr.salary_in_usd;
      acc[year] = acc[year] || { totalSalary: 0, totalJobs: 0 };
      acc[year].totalSalary += salary;
      acc[year].totalJobs++;
      return acc;
    }, {});

    const years = Object.keys(yearlyStats);
    const averageSalaries = years.map(year => (yearlyStats[year].totalSalary / yearlyStats[year].totalJobs).toFixed(2));
    const totalJobs = years.map(year => yearlyStats[year].totalJobs);

    renderAverageSalaryChart(years, averageSalaries);
    renderTotalJobsChart(years, totalJobs);
  };

  const renderAverageSalaryChart = (years, averageSalaries) => {
    const ctx = averageSalaryChartRef.current.getContext('2d');
    averageSalaryChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Average Salary',
            data: averageSalaries,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                weight: 'bold'
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  };

  const renderTotalJobsChart = (years, totalJobs) => {
    const ctx = totalJobsChartRef.current.getContext('2d');
    totalJobsChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Total Jobs',
            data: totalJobs,
            borderColor: 'red',
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                weight: 'bold'
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    });
  };

  return (
    <div className="mt-8 bg-blue">
      <div className="w-full bg-white shadow-md rounded-lg p-4 mb-8 border-2 border-black">
        <canvas ref={averageSalaryChartRef} id="averageSalaryChart" width="400" height="200"></canvas>
      </div>
      <div className="w-full bg-white shadow-md rounded-lg p-4 border-2 border-black">
        <canvas ref={totalJobsChartRef} id="totalJobsChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default Chartline;
