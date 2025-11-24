import React from 'react';
import './TeamSummaryCard.css';

const TeamSummaryCard = ({ team, batsmanCount, bowlerCount, allRounderCount }) => {
  return (
    <div className="team-summary-card">
      <h4 className="team-name">{team.name}</h4>
      <div className="team-wallet">Wallet Left: <span>₹{(team.budget || 0).toLocaleString()}</span></div>
      <div className="team-role-counts">
        <span className="role-batsman">Bat: <b>{batsmanCount}</b></span>
        <span className="role-bowler">Bowl: <b>{bowlerCount}</b></span>
        <span className="role-allrounder">Both: <b>{allRounderCount}</b></span>
      </div>
    </div>
  );
};

export default TeamSummaryCard; 