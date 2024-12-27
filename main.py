from flask import Flask, request, jsonify
from flask_cors import CORS
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
import threading
import time

app = Flask(__name__)
CORS(app)

# Configuração do Spotify
sp = Spotify(auth_manager=SpotifyOAuth(
    client_id="7f2cbc75628240c7ae420480f7e9a770",
    client_secret="4b01ef0ceccd46f4921f5a2c2abd792b",
    redirect_uri="http://localhost:8888/callback",
    scope="user-modify-playback-state"
))

playlist = []  # Lista de músicas
current_track = None  # Música que está tocando agora


# Rota para adicionar uma música à fila
@app.route('/add', methods=['POST'])
def add_to_playlist():
    data = request.json
    track_id = data.get('trackId')

    if not track_id:
        return jsonify({'error': 'Track ID é necessário'}), 400

    playlist.append(track_id)
    return jsonify({'message': 'Música adicionada com sucesso', 'trackId': track_id}), 200


# Rota para obter o status atual
@app.route('/status', methods=['GET'])
def get_status():
    return jsonify({
        'current_track': current_track,
        'playlist': playlist
    })


# Função para tocar a próxima música na fila
def play_next_track():
    global current_track

    while True:
        if current_track is None and playlist:
            current_track = playlist.pop(0)
            try:
                sp.start_playback(uris=[f'spotify:track:{current_track}'])
                print(f"Tocando agora: {current_track}")
            except Exception as e:
                print(f"Erro ao tocar música: {e}")
                current_track = None
        time.sleep(1)


# Inicia a thread para tocar músicas automaticamente
def start_playback_thread():
    thread = threading.Thread(target=play_next_track, daemon=True)
    thread.start()


if __name__ == '__main__':
    start_playback_thread()
    app.run(port=5000)
