import React, { useState } from 'react';
import './ManageTeams.css';
import PlayerCard from '../Players/PlayerCard';

const statLabels = [
  { key: 'matches', label: 'Matches' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
  { key: 'tie', label: 'Tie' },
  { key: 'drawn', label: 'Drawn' },
  { key: 'nr', label: 'NR' },
  { key: 'winPct', label: 'Win', isPercent: true },
  { key: 'tossWon', label: 'Toss Won' },
  { key: 'batFirst', label: 'Bat First' },
  { key: 'fieldFirst', label: 'Field First' }
];

function TeamForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || {
    name: '', matches: '', won: '', lost: '', tie: '', drawn: '', nr: '', winPct: '', tossWon: '', batFirst: '', fieldFirst: ''
  });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); onSave(form); };
  return (
    <form className="team-form" onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Team Name" required />
      <input name="matches" value={form.matches} onChange={handleChange} placeholder="Matches" />
      <input name="won" value={form.won} onChange={handleChange} placeholder="Won" />
      <input name="lost" value={form.lost} onChange={handleChange} placeholder="Lost" />
      <input name="tie" value={form.tie} onChange={handleChange} placeholder="Tie" />
      <input name="drawn" value={form.drawn} onChange={handleChange} placeholder="Drawn" />
      <input name="nr" value={form.nr} onChange={handleChange} placeholder="NR" />
      <input name="winPct" value={form.winPct} onChange={handleChange} placeholder="Win %" />
      <input name="tossWon" value={form.tossWon} onChange={handleChange} placeholder="Toss Won" />
      <input name="batFirst" value={form.batFirst} onChange={handleChange} placeholder="Bat First" />
      <input name="fieldFirst" value={form.fieldFirst} onChange={handleChange} placeholder="Field First" />
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ManageTeams({ teams, addTeam, updateTeam, deleteTeam, players }) {
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [showDeleteIdx, setShowDeleteIdx] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const statRows = [
    statLabels.slice(0, 5),
    statLabels.slice(5)
  ];

  const handleAdd = () => { setEditIdx(null); setShowForm(true); };
  const handleEdit = idx => { setEditIdx(idx); setShowForm(true); };
  const handleDelete = idx => setShowDeleteIdx(idx);
  const handleViewMembers = (team) => { setSelectedTeam(team); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedTeam(null); };

  const mockPlayers = [
    { id: 1, name: 'John Doe', role: 'Batsman', soldFor: null },
    { id: 2, name: 'Jane Smith', role: 'Bowler', soldFor: 120000 },
    { id: 3, name: 'Mike Lee', role: 'All Rounder', soldFor: null },
    // ...
  ];

  const mockTeams = [
    { id: 1, name: 'Men In Blu' },
    { id: 2, name: 'Game Changers' },
    { id: 3, name: 'Copart Champs' },
    { id: 4, name: 'That One Last BID' },
    { id: 5, name: 'Bravehearts' },
    { id: 6, name: 'Eagle Chargers' },
  ];

  return (
    <div className="manage-teams">
      <div className="team-controls" style={{ marginBottom: '1.5rem' }}>
        <button onClick={handleAdd}>Add New Team</button>
      </div>
      <div className="teams-grid">
        {teams.map((team, idx) => (
          <div className="team-card" key={idx}>
            <div className="team-card-header">{team.name}</div>
            <div className="team-card-body">
              <div className="team-stats-horizontal">
                {statRows.map((row, i) => (
                  <div className="team-stat-row" key={i}>
                    {row.map((stat) => (
                      <div className="team-stat-tile" key={stat.key}>
                        <div className="team-stat-value">
                          {stat.isPercent ? `${team[stat.key] || team.stats?.[stat.key] || ''}%` : (team[stat.key] || team.stats?.[stat.key] || '')}
                        </div>
                        <div className="team-stat-label">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="team-actions">
                <button onClick={() => handleEdit(idx)}>Edit</button>
                <button onClick={() => handleDelete(idx)}>Delete</button>
                <button onClick={() => handleViewMembers(team)}>View Members</button>
              </div>
              {showDeleteIdx === idx && (
                <div className="modal-overlay">
                  <div className="modal">
                    <p>Are you sure you want to delete this team?</p>
                    <button onClick={() => { deleteTeam(idx); setShowDeleteIdx(null); }}>Yes</button>
                    <button onClick={() => setShowDeleteIdx(null)}>No</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <TeamForm
              initialData={editIdx !== null ? teams[editIdx] : undefined}
              onSave={data => {
                if (editIdx !== null) updateTeam(data, editIdx);
                else addTeam(data);
                setShowForm(false);
                setEditIdx(null);
              }}
              onCancel={() => { setShowForm(false); setEditIdx(null); }}
            />
          </div>
        </div>
      )}
      {showModal && selectedTeam && (
        <div className="team-modal-overlay">
          <div className="team-modal">
            <div className="modal-header">
              <h3>{selectedTeam.name} - Players</h3>
              <button className="close-modal-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-players-list">
              {players.filter(p => {
                const teamName = (p.team_name || '').replace(/\u00A0/g, ' ');
                const selectedName = (selectedTeam.name || '').replace(/\u00A0/g, ' ');
                return teamName === selectedName;
              }).map((player, idx) => (
                <PlayerCard key={idx} player={player} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTeams; 