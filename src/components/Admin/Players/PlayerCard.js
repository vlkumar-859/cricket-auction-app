import React from 'react';
import './PlayerCard.css';

function getRoleIcon(role) {
  if (role.toLowerCase().includes('all rounder')) return '🏏⚾';
  if (role.toLowerCase().includes('batsman')) return '🏏';
  if (role.toLowerCase().includes('bowler')) return '⚾';
  if (role.toLowerCase().includes('wicket keeper')) return '🧤';
  return '';
}

function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <div className="player-header">
        <div className="player-title-row">
          <h2>{player.player_name}</h2>
          <span className="player-role-icon">{getRoleIcon(player.role)}</span>
        </div>
        <div className="player-meta">
          <span className="player-role">{player.role}</span>
          <span className="player-team">{player.team_name}</span>
        </div>
      </div>
      <div className="batting-section stat-section">
        <h4>Batting Stats</h4>
        <div className="stat-row">
          <div><span>Innings</span><strong>{player.batting_innings}</strong></div>
          <div><span>Avg</span><strong>{player.batting_avg}</strong></div>
          <div><span>SR</span><strong>{player.batting_sr}</strong></div>
          <div><span>Highest</span><strong>{player.batting_highest}</strong></div>
        </div>
      </div>
      <div className="bowling-section stat-section">
        <h4>Bowling Stats</h4>
        <div className="stat-row">
          <div><span>Innings</span><strong>{player.bowling_innings}</strong></div>
          <div><span>Overs</span><strong>{player.overs_bowled}</strong></div>
          <div><span>Wickets</span><strong>{player.wickets}</strong></div>
          <div><span>Eco</span><strong>{player.economy}</strong></div>
          <div><span>Avg</span><strong>{player.bowling_avg}</strong></div>
          <div><span>SR</span><strong>{player.bowling_sr}</strong></div>
          <div><span>10W</span><strong>{player.ten_wicket_hauls}</strong></div>
          <div><span>5W</span><strong>{player.five_wicket_hauls}</strong></div>
        </div>
      </div>
      <div className="general-section">
        <span>Matches: <strong>{player.matches}</strong></span>
      </div>
    </div>
  );
}

export default PlayerCard; 