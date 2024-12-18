from flask import Flask, request, jsonify, redirect
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os

app = Flask(__name__)

# Configurações do Spotify
client_id = '7f2cbc75628240c7ae420480f7e9a770'
client_secret = '4b01ef0ceccd46f4921f5a2c2abd792b'

# Substitua com o URL do Ngrok, por exemplo: http://abc123.ngrok.io/callback
redirect_uri = 'http://abc123.ngrok.io/callback'
scope = "user-modify-playback-state user-read-playback-state"

# Autenticação com Spotify
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=client_id,
                                               client_secret=client_secret,
                                               redirect_uri=redirect_uri,
                                               scope=scope))

@app.route('/')
def home():
    return "Servidor Flask está funcionando!"

# Rota para autenticação e redirecionamento
@app.route('/login')
def login():
    auth_url = sp.auth_manager.get_authorize_url()
    return redirect(auth_url)

@app.route('/callback')
def callback():
    # Esse código será chamado após o login do usuário
    sp.auth_manager.get_access_token(request.args['code'])
    return "Autenticação concluída com sucesso!"

# Rota para mudar a música no Spotify
@app.route('/play', methods=['POST'])
def play_music():
    data = request.get_json()
    track_id = data.get('trackId')
    
    if not track_id:
        return jsonify({'error': 'Track ID missing'}), 400

    try:
        # Toca a música com o ID fornecido
        sp.start_playback(uris=[f"spotify:track:{track_id}"])
        return jsonify({'message': 'Playback started'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Inicia o servidor Flask na porta 5000, acessível via qualquer IP
    app.run(host='0.0.0.0', port=5000, debug=True)
