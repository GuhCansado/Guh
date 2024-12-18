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










const clientId = '7f2cbc75628240c7ae420480f7e9a770';
const clientSecret = '4b01ef0ceccd46f4921f5a2c2abd792b';
let accessToken = '';
let connectionStatus = document.getElementById('connection-status');

// Função para obter o token de acesso do Spotify
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

// Função para pesquisar músicas
async function searchMusic(query) {
    if (!accessToken) {
        await getAccessToken();
    }

    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=6`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    displayMusicList(data.tracks.items);
}

// Função para exibir os resultados da pesquisa
function displayMusicList(tracks) {
    const musicListContainer = document.getElementById('music-list');
    musicListContainer.innerHTML = '';

    tracks.forEach(track => {
        const musicItem = document.createElement('div');
        musicItem.classList.add('music-item');
        musicItem.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}">
            <div class="music-info">
                <p>${track.name}</p>
                <p>${track.artists.map(artist => artist.name).join(', ')}</p>
                <button class="add-button" data-track-id="${track.id}">Adicionar</button>
            </div>
        `;
        
        // Adiciona o evento de clicar no botão de adicionar
        musicItem.querySelector('.add-button').addEventListener('click', () => addMusic(track));

        musicListContainer.appendChild(musicItem);
    });
}

// Função para adicionar a música e interagir com o servidor Python
async function addMusic(track) {
    try {
        const response = await fetch('http://localhost:5000/play', {  // Supondo que o servidor Python esteja na porta 5000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trackId: track.id, trackName: track.name })
        });

        if (response.ok) {
            connectionStatus.textContent = 'Música alterada com sucesso!';
        } else {
            connectionStatus.textContent = 'Erro ao comunicar com o servidor.';
        }
    } catch (error) {
        connectionStatus.textContent = 'Sem conexão';
    }
}

// Inicialização
window.onload = () => {
    getAccessToken();
    
    document.getElementById('search-button').onclick = () => {
        const query = document.getElementById('search-bar').value;
        searchMusic(query);
    };
};
