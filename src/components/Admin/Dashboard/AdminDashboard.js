import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../Common/DashboardCard';
import './AdminDashboard.css';

function AdminDashboard() {
  const dashboardItems = [
    {
      icon: "👥",
      title: "Player Management",
      description: "Add, edit, and manage player profiles",
      linkTo: "/admin/players",
      linkText: "Manage Players"
    },
    {
      icon: "🏏",
      title: "Team Management",
      description: "Create and manage team rosters",
      linkTo: "/admin/teams",
      linkText: "Manage Teams"
    },
    {
      icon: "💰",
      title: "Auction Control",
      description: "Start and manage player auctions",
      linkTo: "/admin/auction",
      linkText: "Control Auction"
    },
    {
      icon: "📊",
      title: "Statistics",
      description: "View league statistics and reports",
      linkTo: "/admin/stats",
      linkText: "View Stats"
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to CoPart Cricket League</h1>
        <p className="subtitle">Admin Control Center</p>
      </div>
      
      <div className="dashboard-grid">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            linkTo={item.linkTo}
            linkText={item.linkText}
          />
        ))}
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <h4>Total Players</h4>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h4>Active Teams</h4>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h4>Upcoming Auctions</h4>
          <p className="stat-number">0</p>
        </div>
        <div className="stat-card">
          <h4>Total Budget</h4>
          <p className="stat-number">₹0</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 