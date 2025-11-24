from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

EXCEL_PATH = os.path.join(os.path.dirname(__file__), 'cricket-data.xlsx')

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        players = pd.read_excel(EXCEL_PATH, sheet_name='Players').fillna('')
        teams = pd.read_excel(EXCEL_PATH, sheet_name='Teams').fillna('')
        return jsonify({
            'players': players.to_dict(orient='records'),
            'teams': teams.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data', methods=['POST'])
def save_data():
    data = request.get_json()
    players = pd.DataFrame(data.get('players', []))
    teams = pd.DataFrame(data.get('teams', []))
    with pd.ExcelWriter(EXCEL_PATH, engine='openpyxl', mode='w') as writer:
        players.to_excel(writer, sheet_name='Players', index=False)
        teams.to_excel(writer, sheet_name='Teams', index=False)
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
