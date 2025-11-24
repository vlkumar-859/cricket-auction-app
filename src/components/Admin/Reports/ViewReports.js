import React from 'react';
import './ViewReports.css';

function ViewReports() {
  return (
    <div className="view-reports">
      <h2>View Reports</h2>
      <div className="report-filters">
        <select>
          <option value="">Select Report Type</option>
          <option value="auction">Auction Reports</option>
          <option value="team">Team Reports</option>
          <option value="player">Player Reports</option>
        </select>
        <input type="date" placeholder="Start Date" />
        <input type="date" placeholder="End Date" />
        <button>Generate Report</button>
      </div>
      <div className="report-content">
        <h3>Report Results</h3>
        {/* Report content will go here */}
      </div>
    </div>
  );
}

export default ViewReports; 