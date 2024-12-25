from flask import Flask, request, jsonify
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)

# Credenciais do Spotify
sp = Spotify(auth_manager=SpotifyOAuth(
    client_id="7f2cbc75628240c7ae420480f7e9a770",
    client_secret="4b01ef0ceccd46f4921f5a2c2abd792b",
    redirect_uri="http://localhost:8888/callback",
    scope="user-modify-playback-state"
))

playlist = []  # Lista de músicas

@app.route('/add', methods=['POST'])
def add_to_playlist():
    data = request.json
    track_id = data.get('trackId')

    if not track_id:
        return jsonify({'error': 'Track ID é necessário'}), 400

    playlist.append(track_id)
    return jsonify({'message': 'Música adicionada com sucesso'}), 200

@app.route('/play', methods=['POST'])
def play_music():
    if not playlist:
        print("Sem música")
        return jsonify({'error': 'Nenhuma música na playlist'}), 400

    # Tocar a próxima música
    current_track = playlist.pop(0)
    sp.start_playback(uris=[f'spotify:track:{current_track}'])

    return jsonify({'message': 'Tocando música', 'track_id': current_track}), 200

if __name__ == '__main__':
    from pyngrok import ngrok
    public_url = ngrok.connect(5000)
    print(f"NGROK URL: {public_url}")
    app.run(port=5000)
