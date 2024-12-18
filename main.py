from flask import Flask, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)

# Configurações do Spotify
client_id = '7f2cbc75628240c7ae420480f7e9a770'
client_secret = '4b01ef0ceccd46f4921f5a2c2abd792b'
redirect_uri = 'http://localhost:5000/callback'
scope = "user-modify-playback-state user-read-playback-state"

# Autenticação
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=client_id,
                                               client_secret=client_secret,
                                               redirect_uri=redirect_uri,
                                               scope=scope))

# Rota para mudar a música no Spotify
@app.route('/play', methods=['POST'])
def play_music():
    data = request.get_json()
    track_id = data.get('trackId')
    
    if not track_id:
        return jsonify({'error': 'Track ID missing'}), 400

    try:
        sp.start_playback(uris=[f"spotify:track:{track_id}"])
        return jsonify({'message': 'Playback started'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
