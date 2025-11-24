import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

function TeamDashboard() {
  return (
    <div className="team-dashboard">
      <h2>Team Dashboard</h2>
      <div className="team-controls">
        <section className="team-info">
          <h3>Team Information</h3>
          <div className="info-panel">
            <p>Team Name: Not Set</p>
            <p>Remaining Budget: ₹0</p>
            <p>Players in Squad: 0</p>
          </div>
        </section>
        <section className="bidding-panel">
          <h3>Active Auction</h3>
          <div className="auction-info">
            <p>Current Player: None</p>
            <p>Current Bid: ₹0</p>
            <button>Place Bid</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function MyTeam() {
  return (
    <div className="my-team">
      <h2>My Team</h2>
      <div className="team-details">
        <h3>Team Details</h3>
        <div className="team-stats">
          <p>Total Players: 0</p>
          <p>Total Spent: ₹0</p>
          <p>Remaining Budget: ₹0</p>
        </div>
        <div className="player-squad">
          <h3>Current Squad</h3>
          {/* Player list will go here */}
        </div>
      </div>
    </div>
  );
}

function AvailablePlayers() {
  return (
    <div className="available-players">
      <h2>Available Players</h2>
      <div className="player-filters">
        <button>All Players</button>
        <button>Batsmen</button>
        <button>Bowlers</button>
        <button>All-rounders</button>
      </div>
      <div className="player-list">
        <h3>Player List</h3>
        {/* Available players list will go here */}
      </div>
    </div>
  );
}

function BiddingHistory() {
  return (
    <div className="bidding-history">
      <h2>Bidding History</h2>
      <div className="history-filters">
        <button>All Bids</button>
        <button>Successful Bids</button>
        <button>Failed Bids</button>
      </div>
      <div className="bid-list">
        <h3>Recent Bids</h3>
        {/* Bidding history will go here */}
      </div>
    </div>
  );
}

function TeamOwnerView() {
  const navigate = useNavigate();

  return (
    <div className="team-owner-view">
      <nav className="nav-bar">
        <h2>Team Owner Panel</h2>
        <div className="nav-links">
          <Link to="/owner">Dashboard</Link>
          <Link to="/owner/team">My Team</Link>
          <Link to="/owner/players">Available Players</Link>
          <Link to="/owner/history">Bidding History</Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<TeamDashboard />} />
          <Route path="/team" element={<MyTeam />} />
          <Route path="/players" element={<AvailablePlayers />} />
          <Route path="/history" element={<BiddingHistory />} />
        </Routes>
      </main>
    </div>
  );
}

export default TeamOwnerView; 