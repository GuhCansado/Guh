from flask import Flask, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import threading

app = Flask(__name__)

# Configurações do Spotify
SPOTIPY_CLIENT_ID = 'seu_client_id'
SPOTIPY_CLIENT_SECRET = 'seu_client_secret'
SPOTIPY_REDIRECT_URI = 'http://localhost:5000/callback'
SPOTIPY_SCOPE = 'playlist-modify-public'

# Autenticação no Spotify
sp_oauth = SpotifyOAuth(SPOTIPY_CLIENT_ID, SPOTIPY_CLIENT_SECRET, SPOTIPY_REDIRECT_URI, scope=SPOTIPY_SCOPE)
sp = spotipy.Spotify(auth_manager=sp_oauth)

# Playlist ID (substitua pelo ID da sua playlist)
PLAYLIST_ID = 'd8e6683e0e47469e'

# Lista de músicas a serem adicionadas
playlist_queue = []
lock = threading.Lock()

@app.route('/add', methods=['POST'])
def add_to_playlist():
    data = request.json
    track_id = data.get('trackId')
    
    with lock:
        playlist_queue.append(track_id)
    
    return jsonify({"status": "success", "trackId": track_id})

@app.route('/status', methods=['GET'])
def get_status():
    with lock:
        return jsonify({"playlist": playlist_queue})

def process_queue():
    while True:
        with lock:
            if playlist_queue:
                track_id = playlist_queue.pop(0)
                try:
                    sp.playlist_add_items(PLAYLIST_ID, [track_id])
                    print(f"Track {track_id} added to playlist.")
                except Exception as e:
                    print(f"Error adding track {track_id}: {e}")

if __name__ == '__main__':
    # Inicia a thread para processar a fila de músicas
    threading.Thread(target=process_queue, daemon=True).start()
    
    # Inicia o servidor Flask
    app.run(debug=True)