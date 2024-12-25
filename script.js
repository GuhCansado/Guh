// Função para mudar o fundo aleatoriamente
window.onload = function() {
    // Defina as imagens e suas respectivas chances de exibição
    let imagens = [
        {src: 'IMG/imagem1.gif', chance: 1},
        {src: 'IMG/imagem2.jpg', chance: 2},
        {src: 'IMG/imagem3.png', chance: 3},
        {src: 'IMG/imagem4.gif', chance: 4},
        {src: 'IMG/imagem5.png', chance: 5},
        {src: 'IMG/imagem6.gif', chance: 0},
        {src: 'IMG/imagem7.gif', chance: 6},
        {src: 'IMG/imagem8.gif', chance: 7},
        {src: 'IMG/imagem9.gif', chance: 8},
        {src: 'IMG/imagem10.gif', chance: 9},
        {src: 'IMG/imagem11.png', chance: 10},
        {src: 'IMG/imagem12.jpg', chance: 11},
        {src: 'IMG/imagem13.jpg', chance: 12},
        {src: 'IMG/imagem14.jpg', chance: 13}
    ];

    // Gera um número aleatório entre 0 e 100
    let randomChance = Math.floor(Math.random() * 101);
    let cumulativeChance = 0; 

    // Verifica qual imagem será selecionada com base nas chances
    for (let i = 0; i < imagens.length; i++) {
        cumulativeChance += imagens[i].chance;

        if (randomChance < cumulativeChance) {
            document.body.style.backgroundImage = `url(${imagens[i].src})`;
            console.log(`Imagem selecionada: ${imagens[i].src} com chance de ${imagens[i].chance}%`);
            return;
        }
    }
    console.log("Nenhuma imagem foi selecionada, chances não atendidas.");
    let randomImage = imagens[Math.floor(Math.random() * imagens.length)].src;
    document.body.style.backgroundImage = `url(${randomImage})`;
};

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

// Funções de pesquisa e interação com o Spotify
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
        const response = await fetch('http://xxxxxx.ngrok.io/play', {  // Substitua com o URL do Ngrok
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trackId: track.id, trackName: track.name })
        });

        if (response.ok) {
            connectionStatus.textContent = 'Música alterada com sucesso!';
       
