import React, { useState, useEffect, useRef } from 'react';
import { fetchData, saveData } from '../../../utils/dataManager';
import PlayerCard from '../Players/PlayerCard';
import TeamSummaryCard from '../Common/TeamSummaryCard';
import PlayerComparison from '../../PlayerComparison';
import './ManageAuctions.css';

function getBidIncrement(currentBid) {
  if (currentBid < 100000) return 10000;
  if (currentBid < 500000) return 25000;
  return 50000;
}

function ManageAuctions() {
  // Data state
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auction state
  const [auctionActive, setAuctionActive] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bids, setBids] = useState({});
  const [lastBidTeam, setLastBidTeam] = useState(null);
  const [timer, setTimer] = useState(10);
  const timerRef = useRef();
  const [soldOrUnsoldView, setSoldOrUnsoldView] = useState('sold');

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchData();
      console.log('Loaded data:', data);
      
      // Ensure teams have proper IDs
      const teamsWithIds = (data.teams || []).map((team, index) => ({
        ...team,
        id: team.id || index + 1
      }));
      
      // Ensure players have proper IDs
      const playersWithIds = (data.players || []).map((player, index) => ({
        ...player,
        id: player.id || `player_${index + 1}`,
        // Ensure unique identifier
        uniqueId: player.id || `player_${index + 1}_${Date.now()}`
      }));
      
      console.log('Players with IDs:', playersWithIds.map(p => ({ 
        name: p.player_name || p.name, 
        id: p.id, 
        uniqueId: p.uniqueId 
      })));
      
      setPlayers(playersWithIds);
      setTeams(teamsWithIds);
      
      // Filter available players (those without team names)
      const available = playersWithIds.filter(player => 
        !player.team_name && !player.sold_to && !player.unsold
      );
      console.log('Available players:', available.length);
      console.log('Available player IDs:', available.map(p => p.id));
      setAvailablePlayers(available);
    } catch (err) {
      setError('Failed to load auction data');
      console.error('Error loading auction data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save updated data to backend
  const saveToBackend = async (updatedPlayers, updatedTeams) => {
    try {
      await saveData(updatedPlayers, updatedTeams);
    } catch (err) {
      console.error('Error saving auction data:', err);
      // You might want to show a user-friendly error message here
    }
  };

  // Check if team can afford the bid
  const canTeamAfford = (teamId, bidAmount) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return false;
    const currentBudget = team.budget || 10000000;
    return currentBudget >= bidAmount;
  };

  // Get the next bid amount
  const getNextBidAmount = () => {
    const maxBid = Math.max(0, ...Object.values(bids));
    const increment = getBidIncrement(maxBid);
    return maxBid + increment;
  };

  // Timer logic
  useEffect(() => {
    if (!auctionActive) return;
    
    // Check if we've processed all available players
    if (currentIdx >= availablePlayers.length) {
      console.log('All players processed, ending auction');
      setAuctionActive(false);
      return;
    }
    
    setTimer(10); // Reset to 10 seconds
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimerEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, [auctionActive, currentIdx, availablePlayers]);

  // Start auction
  const startAuction = () => {
    if (availablePlayers.length === 0) {
      alert('No available players for auction!');
      return;
    }
    setAuctionActive(true);
    setCurrentIdx(0);
    setBids({});
    setLastBidTeam(null);
    setTimer(10);
  };

  // Place a bid for a team
  const placeBid = (teamId) => {
    console.log('Placing bid for team:', teamId);
    const nextBidAmount = getNextBidAmount();
    
    // Check if team can afford the bid
    if (!canTeamAfford(teamId, nextBidAmount)) {
      alert(`Team ${teams.find(t => t.id === teamId)?.name} doesn't have enough budget for this bid!`);
      return;
    }

    setBids(prev => ({
      ...prev,
      [teamId]: nextBidAmount
    }));
    setLastBidTeam(teamId);
    setTimer(10);
    console.log('Bid placed successfully for team:', teamId, 'amount:', nextBidAmount);
  };

  // Handle timer end - automatically assign player if there are bids
  const handleTimerEnd = async () => {
    console.log('Timer ended. Current state:', {
      currentIdx,
      availablePlayersLength: availablePlayers.length,
      currentPlayer: availablePlayers[currentIdx],
      bids,
      lastBidTeam
    });
    
    if (!availablePlayers[currentIdx]) {
      console.log('No current player available');
      return;
    }
    
    const currentPlayer = availablePlayers[currentIdx];
    console.log('Timer ended for player:', currentPlayer.player_name || currentPlayer.name);
    console.log('Bids:', bids);
    console.log('Last bid team:', lastBidTeam);
    
    if (lastBidTeam && Object.keys(bids).length > 0) {
      // There are bids, assign player to highest bidder
      console.log('Assigning player to team:', lastBidTeam, 'for price:', bids[lastBidTeam]);
      await assignPlayerToTeam(currentPlayer, lastBidTeam, bids[lastBidTeam]);
    } else {
      // No bids, mark as unsold
      console.log('No bids, marking player as unsold');
      await markPlayerAsUnsold(currentPlayer);
    }
    
    // Move to next player
    setCurrentIdx(prev => prev + 1);
  };

  // Assign player to team
  const assignPlayerToTeam = async (player, teamId, soldPrice) => {
    console.log('Assigning player to team:', player.player_name, '->', teamId, 'for', soldPrice);
    console.log('Player details:', {
      id: player.id,
      uniqueId: player.uniqueId,
      name: player.player_name || player.name
    });
    
    const winningTeam = teams.find(t => t.id === teamId);
    if (!winningTeam) {
      console.error('Winning team not found:', teamId);
      console.log('Available teams:', teams);
      return;
    }
    
    console.log('Found winning team:', winningTeam);
    console.log('Player ID being updated:', player.id);
    
    // Update ONLY the specific player with sale information
    const updatedPlayers = players.map(p => {
      // Use both id and uniqueId for matching to be extra safe
      if (p.id === player.id || p.uniqueId === player.uniqueId) {
        console.log('Updating player:', p.player_name || p.name, 'with sale info');
        return {
          ...p,
          sold_for: soldPrice,
          sold_to: winningTeam.name,
          team_name: winningTeam.name,
          auction_status: 'sold'
        };
      }
      return p; // Keep other players unchanged
    });
    
    // Update team budget and player count
    const updatedTeams = teams.map(t => 
      t.id === teamId 
        ? { 
            ...t, 
            budget: (t.budget || 10000000) - soldPrice,
            players_count: (t.players_count || 0) + 1
          }
        : t
    );
    
    console.log('Updated players count:', updatedPlayers.length);
    console.log('Sold players count:', updatedPlayers.filter(p => p.auction_status === 'sold').length);
    
    setPlayers(updatedPlayers);
    setTeams(updatedTeams);
    
    // Save to backend
    await saveToBackend(updatedPlayers, updatedTeams);
    
    // Reset bidding state for next player
    setBids({});
    setLastBidTeam(null);
    
    console.log('Player assignment complete');
  };

  // Mark player as unsold
  const markPlayerAsUnsold = async (player) => {
    console.log('Marking player as unsold:', player.player_name);
    console.log('Player details:', {
      id: player.id,
      uniqueId: player.uniqueId,
      name: player.player_name || player.name
    });
    
    // Mark ONLY the specific player as unsold
    const updatedPlayers = players.map(p => {
      // Use both id and uniqueId for matching to be extra safe
      if (p.id === player.id || p.uniqueId === player.uniqueId) {
        console.log('Marking player as unsold:', p.player_name || p.name);
        return {
          ...p,
          sold_for: null,
          sold_to: null,
          team_name: null,
          auction_status: 'unsold'
        };
      }
      return p; // Keep other players unchanged
    });
    
    console.log('Updated players count:', updatedPlayers.length);
    console.log('Unsold players count:', updatedPlayers.filter(p => p.auction_status === 'unsold').length);
    
    setPlayers(updatedPlayers);
    
    // Save to backend
    await saveToBackend(updatedPlayers, teams);
    
    // Reset bidding state for next player
    setBids({});
    setLastBidTeam(null);
    
    console.log('Player marked as unsold complete');
  };

  // Manual finalize bid (for admin control)
  const finalizeBid = async () => {
    console.log('Manual finalize bid called');
    console.log('Current state:', {
      lastBidTeam,
      currentIdx,
      currentPlayer: availablePlayers[currentIdx],
      bids
    });
    
    if (!lastBidTeam || !availablePlayers[currentIdx]) {
      console.log('Cannot finalize: No bid or no current player');
      return;
    }
    
    const currentPlayer = availablePlayers[currentIdx];
    console.log('Finalizing bid for player:', currentPlayer.player_name || currentPlayer.name);
    
    // Call assignPlayerToTeam which will handle the player assignment
    await assignPlayerToTeam(currentPlayer, lastBidTeam, bids[lastBidTeam]);
    
    // Move to next player manually since we're not using the timer
    setCurrentIdx(prev => prev + 1);
    console.log('Manual finalize bid completed, moved to next player');
  };

  // Refresh data
  const refreshData = () => {
    loadData();
  };

  const currentPlayer = availablePlayers[currentIdx];
  const nextBidAmount = getNextBidAmount();

  // Sold and unsold players for right column
  const soldPlayers = players.filter(p => p.auction_status === 'sold');
  const unsoldPlayers = players.filter(p => p.auction_status === 'unsold');

  // Helper to count roles for a team
  const getRoleCounts = (team) => {
    const teamPlayers = players.filter(p => p.team_name === team.name);
    let batsman = 0, bowler = 0, allrounder = 0;
    teamPlayers.forEach(p => {
      if (!p.role) return;
      const role = p.role.toLowerCase();
      if (role.includes('batsman')) batsman++;
      else if (role.includes('bowler')) bowler++;
      else if (role.includes('all')) allrounder++;
    });
    return { batsman, bowler, allrounder };
  };

  if (loading) {
  return (
      <div className="auction-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading auction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auction-container">
        <div className="error-container">
          <h2>Error Loading Auction Data</h2>
          <p>{error}</p>
          <button onClick={refreshData} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="auction-3col-layout">
        {/* Left: Available Players or Team Bids */}
        <aside className="auction-col auction-available">
          {auctionActive && currentPlayer ? (
            <div className="bidding-section">
              <h3>Team Bids</h3>
              <div className="teams-row">
                {teams.map(team => {
                  const currentBid = bids[team.id] || 0;
                  const canAfford = canTeamAfford(team.id, nextBidAmount);
                  const isHighestBidder = lastBidTeam === team.id;
                  return (
                    <div className={`team-bid-card${isHighestBidder ? ' highest-bidder' : ''}`} key={team.id}>
                      <h4>{team.name}</h4>
                      <div className="team-info">
                        <p>Budget: ₹{(team.budget || 10000000).toLocaleString()}</p>
                        <p>Players: {team.players_count || 0}</p>
                      </div>
                      <div className="bid-info">
                        <div>Current Bid: ₹{currentBid}</div>
                        <button 
                          onClick={() => placeBid(team.id)}
                          disabled={!auctionActive || !canAfford}
                          className={`bid-btn${!canAfford ? ' disabled' : ''}`}
                          title={!canAfford ? `Insufficient budget. Need ₹${nextBidAmount.toLocaleString()}` : ''}
                        >
                          {!canAfford ? 'Insufficient Budget' : `Bid +₹${getBidIncrement(Math.max(0, ...Object.values(bids)))}`}
                        </button>
                        {isHighestBidder && <div className="highest-bid-indicator">🏆 Highest Bid</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="auction-col-header">
                <h3>Available Players <span>({availablePlayers.length})</span></h3>
                <button onClick={refreshData} className="refresh-btn">🔄</button>
              </div>
              <div className="auction-player-list">
                {availablePlayers.map((p, idx) => (
                  <div key={p.id} className={`auction-player-list-item${idx === currentIdx && auctionActive ? ' current' : ''}`}>
                    <span>{p.player_name} <span className="role">({p.role})</span></span>
                    {p.auction_status === 'unsold' && <span className="unsold-label">Unsold</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Center: Auction Main */}
        <main className="auction-col auction-center">
          <div className="auction-center-content">
            <div className="auction-header-row">
              <h2>Cricket Auction</h2>
              <div className="auction-controls">
                <button 
                  onClick={startAuction} 
                  disabled={auctionActive || availablePlayers.length === 0}
                  className="start-btn"
                >
                  {auctionActive ? 'Auction in Progress' : 'Start Auction'}
                </button>
                {auctionActive && (
                  <button 
                    onClick={() => setAuctionActive(false)} 
                    className="stop-btn"
                  >
                    Stop Auction
                  </button>
                )}
              </div>
            </div>

            {auctionActive && currentPlayer && (
              <div className="auction-playercard-animate">
                <PlayerCard player={currentPlayer} />
                <div className="auction-timer-outer">
                  <div className="auction-timer-label">Time left:</div>
                  <div className="auction-timer-bar">
                    <div className="auction-timer-bar-inner" style={{ width: `${(timer/10)*100}%` }} />
                  </div>
                  <span className={`auction-timer-num${timer <= 3 ? ' timer-warning' : ''}`}>{timer}s</span>
                </div>
                <div className="auction-actions">
                  <button 
                    className="finalize-btn" 
                    onClick={finalizeBid} 
                    disabled={!lastBidTeam || !currentPlayer || Object.keys(bids).length === 0}
                    title={!lastBidTeam ? 'No bids placed yet' : !currentPlayer ? 'No current player' : 'Finalize current bid'}
                  >
                    {!lastBidTeam ? 'No Bids to Finalize' : 
                     !currentPlayer ? 'No Current Player' : 
                     `Finalize Bid (₹${bids[lastBidTeam] || 0})`}
                  </button>
                </div>
              </div>
            )}

            {auctionActive && !currentPlayer && availablePlayers.length === 0 && (
              <div className="auction-complete">
                <h2>🎉 Auction Complete!</h2>
                <p>All available players have been auctioned.</p>
                <button onClick={() => setAuctionActive(false)}>Close Auction</button>
              </div>
            )}

            {auctionActive && availablePlayers.length > 0 && !currentPlayer && (
              <div className="auction-loading">
                <div className="loading-spinner"></div>
                <p>Loading next player...</p>
              </div>
            )}

            {!auctionActive && (
              <div className="auction-info">
                <h3>Auction Information</h3>
                <div className="info-grid">
                  <div className="info-card">
                    <h4>Available Players</h4>
                    <p>{availablePlayers.length}</p>
                  </div>
                  <div className="info-card">
                    <h4>Total Teams</h4>
                    <p>{teams.length}</p>
                  </div>
                  <div className="info-card">
                    <h4>Sold Players</h4>
                    <p>{players.filter(p => p.auction_status === 'sold').length}</p>
                  </div>
                  <div className="info-card">
                    <h4>Unsold Players</h4>
                    <p>{players.filter(p => p.auction_status === 'unsold').length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Team Summary Section */}
        <section className="auction-col auction-team-summary">
          <div className="auction-col-header">
            <h3>Team Summary</h3>
          </div>
          <div className={`team-summary-scroll${auctionActive && lastBidTeam ? ' single-team' : ''}`}>
            {auctionActive && lastBidTeam ? (
              teams.filter(t => t.id === lastBidTeam).map(team => {
                const { batsman, bowler, allrounder } = getRoleCounts(team);
                return <TeamSummaryCard key={team.id} team={team} batsmanCount={batsman} bowlerCount={bowler} allRounderCount={allrounder} />;
              })
            ) : (
              teams.map(team => {
                const { batsman, bowler, allrounder } = getRoleCounts(team);
                return <TeamSummaryCard key={team.id} team={team} batsmanCount={batsman} bowlerCount={bowler} allRounderCount={allrounder} />;
              })
            )}
          </div>
        </section>

        {/* Right: Sold/Unsold Players */}
        <aside className="auction-col auction-sold">
          <div className="auction-col-header">
            <div className="sold-unsold-toggle">
              <button 
                className={soldOrUnsoldView === 'sold' ? 'active' : ''}
                onClick={() => setSoldOrUnsoldView('sold')}
              >
                Sold Players <span>({soldPlayers.length})</span>
              </button>
              <button 
                className={soldOrUnsoldView === 'unsold' ? 'active' : ''}
                onClick={() => setSoldOrUnsoldView('unsold')}
              >
                Unsold Players <span>({unsoldPlayers.length})</span>
              </button>
            </div>
          </div>
          <div className="auction-sold-list">
            {soldOrUnsoldView === 'sold' ? (
              soldPlayers.length === 0 ? <div className="no-sold">No players sold yet</div> :
              soldPlayers.map((p, idx) => (
                <div key={p.id} className="auction-sold-card-animate">
                  <PlayerCard player={p} />
                  <div className="sold-badge">SOLD<br/>₹{p.sold_for} <span className="sold-team">({p.sold_to})</span></div>
                </div>
              ))
            ) : (
              unsoldPlayers.length === 0 ? <div className="no-sold">No unsold players</div> :
              unsoldPlayers.map((p, idx) => (
                <div key={p.id} className="auction-sold-card-animate">
                  <PlayerCard player={p} />
                  <div className="sold-badge unsold">UNSOLD</div>
                </div>
              ))
            )}
        </div>
        </aside>
      </div>
      <PlayerComparison />
    </>
  );
}

export default ManageAuctions; 