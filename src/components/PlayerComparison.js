import React, { useState } from 'react';
import './PlayerComparison.css';

export default function PlayerComparison() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!player1.trim() || !player2.trim()) return;
    setLoading(true);
    try {
      const names = encodeURIComponent(JSON.stringify([player1.trim(), player2.trim()]));
      const res = await fetch(`http://127.0.0.1:8000/api/Recommend_player/?name=${names}`);
      if (!res.ok) throw new Error('Failed to fetch scores');
      const data = await res.json();
      // Expecting: { "Player1": { bat: X, ball: Y }, "Player2": { bat: X, ball: Y } }
      setResult(data);
    } catch (err) {
      setError('Could not fetch player scores.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-compare-container">
      <h3 className="compare-title">Player Comparison</h3>
      <form className="compare-form" onSubmit={handleCompare}>
        <input
          type="text"
          placeholder="Player 1 Name"
          value={player1}
          onChange={e => setPlayer1(e.target.value)}
          required
        />
        <span className="vs-label">vs</span>
        <input
          type="text"
          placeholder="Player 2 Name"
          value={player2}
          onChange={e => setPlayer2(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Comparing...' : 'Compare'}</button>
      </form>
      {error && <div className="login-error" style={{marginTop: '0.7rem'}}>{error}</div>}
      {loading && <div style={{color:'#2ED573',marginTop:'1rem'}}>Loading scores...</div>}
      {result && (
        <div className="compare-results">
          {Object.entries(result).map(([name, scores]) => (
            <div className="compare-card" key={name}>
              <div className="compare-player-name">{name}</div>
              <div className="compare-score-row">
                <span className="compare-label">🏏 Bat:</span>
                <span className="compare-score">{scores.bat}</span>
              </div>
              <div className="compare-score-row">
                <span className="compare-label">🔴 Ball:</span>
                <span className="compare-score">{scores.ball}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 