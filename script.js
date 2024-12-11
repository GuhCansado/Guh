// Função para mudar o fundo aleatoriamente
window.onload = function() {
    let imagens = ['IMG/imagem1.gif', 'IMG/imagem2.gif', 'IMG/imagem3.gif', 'IMG/imagem4.gif', 'IMG/imagem5.gif', 'IMG/imagem6.gif',]; // Adicione o caminho das suas imagens aqui
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





// Configurações de autenticação
const CLIENT_ID = '7f2cbc75628240c7ae420480f7e9a770';
const CLIENT_SECRET = '4b01ef0ceccd46f4921f5a2c2abd792b';
const REDIRECT_URI = 'https://guhcansado.github.io/Guh/';  // Altere para a URL correta de redirecionamento
let accessToken = '';

// Função para obter o token de acesso
function getAccessToken() {
    // Se já tiver token de acesso, retorne-o
    if (accessToken) {
        return accessToken;
    }

    // Autenticação OAuth - você precisa substituir com seu processo de login do Spotify
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=playlist-modify-public user-library-read`;

    // Redireciona o usuário para autenticação
    window.location.href = authUrl;
}

// Função para configurar o token de acesso após autenticação
function setAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.slice(1));
    accessToken = params.get('access_token');
}

// Função para pesquisar músicas no Spotify
async function searchMusic(query) {
    const token = getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    return data.tracks.items;
}

// Função para adicionar música à playlist
async function addToPlaylist(trackId) {
    const token = getAccessToken();
    const playlistId = '1VrqWOBBiI1iAhPud0QX0y?si=ba0709f51f944253'; // Insira o ID da playlist

    const response = await fetch(`https://api.spotify.com/v1/players/playlists/${playlistId}/tracks?uris=spotify:track:${trackId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: [`spotify:track:${trackId}`] })
    });

    if (response.ok) {
        console.log('Música adicionada à playlist');
    } else {
        console.error('Erro ao adicionar música');
    }
}

// Função para exibir resultados da pesquisa
function displaySearchResults(musicList) {
    const musicListContainer = document.getElementById('music-list');
    musicListContainer.innerHTML = ''; // Limpa a lista antes de adicionar novas músicas

    musicList.forEach((track) => {
        const musicItem = document.createElement('div');
        musicItem.className = 'music-item';
        musicItem.innerHTML = `
            <span>${track.name} - ${track.artists.map(artist => artist.name).join(', ')}</span>
            <button onclick="addToPlaylist('${track.id}')">+</button>
        `;
        musicListContainer.appendChild(musicItem);
    });
}

// Função de manipulação da pesquisa
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value;
    if (query) {
        const musicList = await searchMusic(query);
        displaySearchResults(musicList);
    }
});

// Inicializar a página após redirecionamento de autenticação
window.addEventListener('load', () => {
    if (window.location.hash) {
        setAccessTokenFromUrl();
    }
});
