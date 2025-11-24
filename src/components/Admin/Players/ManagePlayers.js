import React, { useState } from 'react';
import './ManagePlayers.css';
import PlayerCard from './PlayerCard';

function PlayerForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState(initialData || {
    player_name: '', role: '', team_name: '', batting_avg: '', batting_sr: '', batting_highest: '', matches: '', batting_innings: '', bowling_innings: '', overs_bowled: '', wickets: '', economy: '', bowling_avg: '', bowling_sr: '', five_wicket_hauls: '', ten_wicket_hauls: ''
  });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); onSave(form); };
  return (
    <form className="player-form" onSubmit={handleSubmit}>
      <input name="player_name" value={form.player_name} onChange={handleChange} placeholder="Name" required />
      <input name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
      <input name="team_name" value={form.team_name} onChange={handleChange} placeholder="Team" />
      <input name="batting_avg" value={form.batting_avg} onChange={handleChange} placeholder="Batting Avg" />
      <input name="batting_sr" value={form.batting_sr} onChange={handleChange} placeholder="Batting SR" />
      <input name="batting_highest" value={form.batting_highest} onChange={handleChange} placeholder="Highest Score" />
      <input name="matches" value={form.matches} onChange={handleChange} placeholder="Matches" />
      <input name="batting_innings" value={form.batting_innings} onChange={handleChange} placeholder="Batting Innings" />
      <input name="bowling_innings" value={form.bowling_innings} onChange={handleChange} placeholder="Bowling Innings" />
      <input name="overs_bowled" value={form.overs_bowled} onChange={handleChange} placeholder="Overs Bowled" />
      <input name="wickets" value={form.wickets} onChange={handleChange} placeholder="Wickets" />
      <input name="economy" value={form.economy} onChange={handleChange} placeholder="Economy" />
      <input name="bowling_avg" value={form.bowling_avg} onChange={handleChange} placeholder="Bowling Avg" />
      <input name="bowling_sr" value={form.bowling_sr} onChange={handleChange} placeholder="Bowling SR" />
      <input name="five_wicket_hauls" value={form.five_wicket_hauls} onChange={handleChange} placeholder="5W Hauls" />
      <input name="ten_wicket_hauls" value={form.ten_wicket_hauls} onChange={handleChange} placeholder="10W Hauls" />
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ManagePlayers({ players, addPlayer, updatePlayer, deletePlayer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [showDeleteIdx, setShowDeleteIdx] = useState(null);

  const filteredPlayers = players.filter(player =>
    player.player_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => { setEditIdx(null); setShowForm(true); };
  const handleEdit = idx => { setEditIdx(idx); setShowForm(true); };
  const handleDelete = idx => setShowDeleteIdx(idx);

  return (
    <div className="manage-players">
      <div className="player-controls">
        <input
          type="text"
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button onClick={handleAdd}>Add New Player</button>
      </div>
      <div className="player-list">
        <h3>Player List</h3>
        <div className="player-cards-container">
          {filteredPlayers.map((player, index) => (
            <div key={index} className="player-card-wrapper">
              <PlayerCard player={player} />
              <div className="player-actions">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
              {showDeleteIdx === index && (
                <div className="modal-overlay">
                  <div className="modal">
                    <p>Are you sure you want to delete this player?</p>
                    <button onClick={() => { deletePlayer(index); setShowDeleteIdx(null); }}>Yes</button>
                    <button onClick={() => setShowDeleteIdx(null)}>No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <PlayerForm
              initialData={editIdx !== null ? players[editIdx] : undefined}
              onSave={data => {
                if (editIdx !== null) updatePlayer(data, editIdx);
                else addPlayer(data);
                setShowForm(false);
                setEditIdx(null);
              }}
              onCancel={() => { setShowForm(false); setEditIdx(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePlayers; 