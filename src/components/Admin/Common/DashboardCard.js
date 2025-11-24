import React from 'react';
import './DashboardCard.css';
import { Link } from 'react-router-dom';

function DashboardCard({ icon, title, description, linkTo, linkText }) {
  return (
    <div className="dashboard-card">
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={linkTo} className="card-link">{linkText}</Link>
    </div>
  );
}

export default DashboardCard; 