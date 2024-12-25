// Tela de abertura
window.onload = function () {
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
    }, 1000);
};

// Fundo aleatório
// Definir as imagens e suas probabilidades
let imagensComProbabilidades = [
    { src: 'IMG/A.gif', chance: 5 },  // 50% de chance
    { src: 'IMG/A1.mp4', chance: 40 },  // 30% de chance
    { src: 'IMG/A2.gif', chance: 15 },  // 15% de chance
    { src: 'IMG/A3.mp4', chance: 50 },
    { src: 'IMG/A4.gif', chance: 35 },
    { src: 'IMG/A5.gif', chance: 55 },
    { src: 'IMG/A6.gif', chance: 31 },
    { src: 'IMG/A7.gif', chance: 14 },
    { src: 'IMG/A8.gif', chance: 53 },
    { src: 'IMG/A9.gif', chance: 22 },
    { src: 'IMG/A10.gif', chance: 37 },
    { src: 'IMG/A11.gif', chance: 2 }
];

// Criar um array expandido para simular probabilidades
let imagens = [];
imagensComProbabilidades.forEach(imagem => {
    for (let i = 0; i < imagem.chance; i++) {
        imagens.push(imagem.src);
    }
});

// Selecionar uma imagem aleatória baseada na probabilidade
let randomImage = imagens[Math.floor(Math.random() * imagens.length)];
document.body.style.backgroundImage = `url(${randomImage})`;







// Abrir a página Spotify
document.querySelector('.menu').addEventListener('click', function () {
    document.getElementById('spotify-page').style.display = 'flex';
});

// Fechar a página Spotify
document.getElementById('spotify-page').addEventListener('click', function (e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});



























const ngrokURL = "http://localhost:5000/"; // Substitua pelo URL do Ngrok

document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value;
    if (!query) return;

    const token = await getSpotifyToken();
    const results = await fetchSpotifyTracks(query, token);

    displayResults(results);
});

// Obter token do Spotify
async function getSpotifyToken() {
    const clientId = "7f2cbc75628240c7ae420480f7e9a770"; // Substitua
    const clientSecret = "4b01ef0ceccd46f4921f5a2c2abd792b"; // Substitua
    const auth = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${auth}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

// Buscar músicas no Spotify
async function fetchSpotifyTracks(query, token) {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();
    return data.tracks.items;
}

// Exibir resultados da pesquisa
function displayResults(tracks) {
    const resultsContainer = document.getElementById('music-results');
    resultsContainer.innerHTML = '';

    tracks.forEach(track => {
        const musicDiv = document.createElement('div');
        musicDiv.className = 'music-item';

        musicDiv.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}">
            <div class="music-info">
                <h4>${track.name}</h4>
                <p>${track.artists[0].name}</p>
            </div>
            <button onclick="addToPlaylist('${track.id}')">+</button>
        `;

        resultsContainer.appendChild(musicDiv);
    });
}

// Enviar música para o servidor
async function addToPlaylist(trackId) {
    const response = await fetch(`${ngrokURL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId })
    });

    if (response.ok) {
        console.log('Música adicionada com sucesso!');
    } else {
        console.error('Erro ao adicionar música.');
    }
}
