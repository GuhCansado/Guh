// Função para mudar o fundo aleatoriamente
window.onload = function() {
    let imagens = ['IMG/imagem1.gif', 'IMG/imagem2.gif', 'IMG/imagem3.gif', 
        'IMG/imagem4.gif', 'IMG/imagem5.gif', 'IMG/imagem6.gif','IMG/imagem7.gif',
        'IMG/imagem7.gif','IMG/imagem8.gif','IMG/imagem9.gif','IMG/imagem10.gif',
        'IMG/imagem11.gif','IMG/imagem12.gif','IMG/imagem13.gif','IMG/imagem14.gif',
        'IMG/imagem15.gif','IMG/imagem16.gif',]; // Adicione o caminho das suas imagens aqui
    let randomImage = imagens[Math.floor(Math.random() * imagens.length)];
    document.body.style.backgroundImage = `url(${randomImage})`;
}

// Abrir a página Spotify
document.querySelector('.menu').addEventListener('click', function() {
    document.getElementById('spotify-page').style.display = 'flex';
});

// Fechar a página Spotify
document.getElementById('spotify-page').addEventListener('click', function(e) {
    if (e.target === document.getElementById('spotify-page')) {
        document.getElementById('spotify-page').style.display = 'none';
    }
});










// Variáveis globais
const clientId = '7f2cbc75628240c7ae420480f7e9a770';
const clientSecret = '4b01ef0ceccd46f4921f5a2c2abd792b';
let accessToken = '';
let currentTrackId = '';

// Variável para o tamanho máximo da playlist
const playlistSize = 10;
let currentPlaylistSize = 0;

// Função para obter o token de acesso
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    accessToken = data.access_token;
}

// Função para pesquisar músicas no Spotify
async function searchMusic(query) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    const data = await response.json();
    displayMusicList(data.tracks.items);
}

// Função para exibir a lista de músicas
function displayMusicList(tracks) {
    const musicListContainer = document.getElementById('music-list');
    musicListContainer.innerHTML = '';
    tracks.forEach(track => {
        const li = document.createElement('li');
        li.textContent = track.name;
        const addButton = document.createElement('button');
        addButton.textContent = 'Adicionar';
        addButton.onclick = () => addToPlaylist(track);
        li.appendChild(addButton);
        musicListContainer.appendChild(li);
    });
}

// Função para adicionar uma música à playlist
function addToPlaylist(track) {
    if (currentPlaylistSize >= playlistSize) {
        // Se a playlist estiver cheia, exibe uma mensagem
        document.getElementById('playlist-status').textContent = 'A playlist está cheia. Remova uma música para adicionar outra.';
        return;
    }

    // Se não estiver cheia, adiciona a música à playlist
    const playlistContainer = document.getElementById('playlist');
    const li = document.createElement('li');
    li.textContent = track.name;
    li.id = track.id;

    // Adicionar evento para remover da playlist
    li.onclick = () => {
        removeFromPlaylist(track.id);
    };
    playlistContainer.appendChild(li);

    // Atualiza o tamanho da playlist
    currentPlaylistSize++;

    // Atualiza a mensagem de status da playlist
    if (currentPlaylistSize === playlistSize) {
        document.getElementById('playlist-status').textContent = 'Playlist cheia!';
    } else {
        document.getElementById('playlist-status').textContent = '';
    }
}

// Função para remover música da playlist
function removeFromPlaylist(trackId) {
    const li = document.getElementById(trackId);
    li.remove();
    
    // Atualiza o tamanho da playlist
    currentPlaylistSize--;

    // Se a playlist não estiver cheia, limpa a mensagem de "cheia"
    if (currentPlaylistSize < playlistSize) {
        document.getElementById('playlist-status').textContent = '';
    }
}

// Função para exibir a música que está tocando no momento
async function displayCurrentTrack() {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        if (data.item) {
            const currentTrackContainer = document.getElementById('current-track-info');
            currentTrackContainer.innerHTML = `
                <p>${data.item.name} - ${data.item.artists[0].name}</p>
                <img src="${data.item.album.images[0].url}" alt="Cover" style="width: 100px;">
            `;
            currentTrackId = data.item.id;
        }
    } else {
        const currentTrackContainer = document.getElementById('current-track-info');
        currentTrackContainer.innerHTML = '<p>Nenhuma música tocando no momento.</p>';
    }
}

// Inicialização
window.onload = async () => {
    await getAccessToken();
    document.getElementById('search-button').onclick = () => {
        const query = document.getElementById('search-bar').value;
        searchMusic(query);
    };

    displayCurrentTrack();
    setInterval(displayCurrentTrack, 10000);  // Atualizar a música atual a cada 10 segundos
};
