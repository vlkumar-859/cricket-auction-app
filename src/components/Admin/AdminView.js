import React, { useEffect, useState } from 'react';
import './AdminView.css';
import AdminDashboard from './Dashboard/AdminDashboard';
import ManagePlayers from './Players/ManagePlayers';
import ManageTeams from './Teams/ManageTeams';
import ManageAuctions from './Auctions/ManageAuctions';
import ViewReports from './Reports/ViewReports';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchData, saveData } from '../../utils/dataManager';

function Logo() {
  const navigate = useNavigate();
  return (
    <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>
      <div className="logo">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" stroke="#FF6B6B" strokeWidth="2"/>
          <path d="M20 8L28 20L20 32L12 20L20 8Z" fill="#FF6B6B"/>
        </svg>
      </div>
      <div className="logo-text">
        <h1>CoPart Cricket League</h1>
      </div>
    </div>
  );
}

function AdminView() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [componentLoading, setComponentLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when navigating to Teams or Players sections
  useEffect(() => {
    if (location.pathname === '/admin/teams' || location.pathname === '/admin/players') {
      console.log('Refreshing data for:', location.pathname);
      setComponentLoading(true);
      loadData().finally(() => setComponentLoading(false));
    }
  }, [location.pathname]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData();
      setPlayers(data.players);
      setTeams(data.teams);
      console.log('Data refreshed from backend');
    } catch (err) {
      setError('Failed to load data from server');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveDataToServer = async (newPlayers, newTeams) => {
    try {
      await saveData(newPlayers, newTeams);
    } catch (err) {
      console.error('Error saving data:', err);
      // You might want to show a user-friendly error message here
    }
  };

  // CRUD handlers for players
  const addPlayer = async (player) => {
    const newPlayers = [...players, player];
    setPlayers(newPlayers);
    await saveDataToServer(newPlayers, teams);
  };

  const updatePlayer = async (updated, idx) => {
    const newPlayers = players.map((p, i) => i === idx ? updated : p);
    setPlayers(newPlayers);
    await saveDataToServer(newPlayers, teams);
  };

  const deletePlayer = async (idx) => {
    const newPlayers = players.filter((_, i) => i !== idx);
    setPlayers(newPlayers);
    await saveDataToServer(newPlayers, teams);
  };

  // CRUD handlers for teams
  const addTeam = async (team) => {
    const newTeams = [...teams, team];
    setTeams(newTeams);
    await saveDataToServer(players, newTeams);
  };

  const updateTeam = async (updated, idx) => {
    const newTeams = teams.map((t, i) => i === idx ? updated : t);
    setTeams(newTeams);
    await saveDataToServer(players, newTeams);
  };

  const deleteTeam = async (idx) => {
    const newTeams = teams.filter((_, i) => i !== idx);
    setTeams(newTeams);
    await saveDataToServer(players, newTeams);
  };

  const isActive = (path) => location.pathname === path;

  // Show full loading only on initial load
  if (loading && !componentLoading) {
    return (
      <div className="admin-view">
        <div className="loading-container">
          <div className="cricket-loading-animation">
            <div className="batsman">
              <div className="bat"></div>
              <div className="player-body"></div>
            </div>
            <div className="ball"></div>
            <div className="stumps"></div>
          </div>
          <p>Loading Cricket Auction System...</p>
        </div>
      </div>
    );
  }

  // Show error only on initial load
  if (error && !componentLoading) {
    return (
      <div className="admin-view">
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-view">
      <header className="admin-header">
        <Logo />
        <nav className="main-nav">
          <Link 
            to="/admin/players" 
            className={`nav-item ${isActive('/admin/players') ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            Players
          </Link>
          <Link 
            to="/admin/teams" 
            className={`nav-item ${isActive('/admin/teams') ? 'active' : ''}`}
          >
            <span className="nav-icon">🏏</span>
            Teams
          </Link>
          <Link 
            to="/admin/auction" 
            className={`nav-item ${isActive('/admin/auction') ? 'active' : ''}`}
          >
            <span className="nav-icon">💰</span>
            Auction
          </Link>
          <Link 
            to="/admin/reports" 
            className={`nav-item ${isActive('/admin/reports') ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Reports
          </Link>
          <button 
            onClick={() => {
              setComponentLoading(true);
              loadData().finally(() => setComponentLoading(false));
            }} 
            className={`refresh-nav-btn ${componentLoading ? 'loading' : ''}`}
            disabled={componentLoading}
            title="Refresh data from backend"
          >
            {componentLoading ? '🔄' : '🔄'} Refresh
          </button>
        </nav>
      </header>
      <main className="main-content">
        {componentLoading && (
          <div className="component-loading-overlay">
            <div className="cricket-loading-animation">
              <div className="batsman">
                <div className="bat"></div>
                <div className="player-body"></div>
              </div>
              <div className="ball"></div>
              <div className="stumps"></div>
            </div>
            <p>Loading latest data...</p>
          </div>
        )}
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/players" element={<ManagePlayers players={players} addPlayer={addPlayer} updatePlayer={updatePlayer} deletePlayer={deletePlayer} />} />
          <Route path="/teams" element={<ManageTeams teams={teams} addTeam={addTeam} updateTeam={updateTeam} deleteTeam={deleteTeam} players={players} />} />
          <Route path="/auction" element={<ManageAuctions />} />
          <Route path="/reports" element={<ViewReports />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminView; 