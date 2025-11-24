import * as XLSX from 'xlsx';

const API_BASE_URL = 'http://localhost:5001/api';

// Fetch data from backend API
export async function fetchData() {
  try {
    const response = await fetch(`${API_BASE_URL}/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      players: data.players || [],
      teams: data.teams || []
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { players: [], teams: [] };
  }
}

// Save data to backend API
export async function saveData(players, teams) {
  try {
    const response = await fetch(`${API_BASE_URL}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ players, teams }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

// Legacy Excel import function (kept for backward compatibility)
export function importFromExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const players = XLSX.utils.sheet_to_json(workbook.Sheets['Players'] || workbook.Sheets[workbook.SheetNames[0]]);
    const teams = XLSX.utils.sheet_to_json(workbook.Sheets['Teams'] || workbook.Sheets[workbook.SheetNames[1]]);
    callback({ players, teams });
  };
  reader.readAsArrayBuffer(file);
} 