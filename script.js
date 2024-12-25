// Tela de abertura: esconde o texto de introdução após 1 segundo
window.onload = function () {
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
    }, 1000);
};

// Configuração das mídias e suas probabilidades
let midiasComProbabilidades = [
    { src: 'IMG/A.gif', chance: 5 },   // 5% de chance
    { src: 'IMG/A1.mp4', chance: 40 }, // 40% de chance
    { src: 'IMG/A2.gif', chance: 15 }, // 15% de chance
    { src: 'IMG/A3.mp4', chance: 50 }, // 50% de chance
    { src: 'IMG/A4.gif', chance: 35 }, // 35% de chance
    { src: 'IMG/A5.gif', chance: 55 },  // 55% de chance
    { src: 'IMG/A6.gif', chance: 55 },
    { src: 'IMG/A7.gif', chance: 55 },
    { src: 'IMG/A8.gif', chance: 55 },
    { src: 'IMG/A9.gif', chance: 55 },
    { src: 'IMG/A10.gif', chance: 55 },
    { src: 'IMG/A11.gif', chance: 55 }           
];

// Expande o array com base nas chances
let midias = [];
midiasComProbabilidades.forEach(midia => {
    for (let i = 0; i < midia.chance; i++) {
        midias.push(midia.src); // Adiciona múltiplas vezes para ajustar a probabilidade
    }
});

// Seleciona uma mídia aleatória baseado na probabilidade
let randomMedia = midias[Math.floor(Math.random() * midias.length)];

// Aplica o background independentemente do formato
if (randomMedia) {
    let isVideo = randomMedia.includes('.mp4') || randomMedia.includes('.webm') || randomMedia.includes('.avi'); // Detecta se é vídeo

    if (isVideo) {
        // Caso seja vídeo
        let video = document.createElement('video');
        video.src = randomMedia;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover'; // Preenche a tela
        video.style.zIndex = '-1'; // Fica atrás do conteúdo
        document.body.appendChild(video);
    } else {
        // Caso seja imagem
        document.body.style.backgroundImage = `url(${randomMedia})`;
        document.body.style.backgroundSize = 'cover'; // Ajusta a mídia ao tamanho da tela
        document.body.style.backgroundPosition = 'center'; // Centraliza a mídia
        document.body.style.backgroundRepeat = 'no-repeat'; // Evita repetição
    }
}













// Esconde a tela de introdução após 1 segundo
window.onload = function () {
    setTimeout(() => {
        document.getElementById('intro').style.display = 'none';
    }, 1000);
};

// Seleciona o menu e a página do Spotify
const menu = document.querySelector('.menu');
const spotifyPage = document.getElementById('spotify-page');

// Abre a página do Spotify ao clicar nos três pontos
menu.addEventListener('click', () => {
    spotifyPage.style.display = 'flex'; // Mostra a página
});

// Fecha a página do Spotify ao clicar fora do conteúdo
spotifyPage.addEventListener('click', (e) => {
    if (e.target === spotifyPage) {
        spotifyPage.style.display = 'none'; // Esconde a página
    }
});


// Integração com o Spotify
const ngrokURL = "http://localhost:5000"; // Substitua pelo URL do seu Ngrok

// Pesquisar músicas no Spotify
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value;
    if (!query) return;

    const token = await getSpotifyToken();
    const results = await fetchSpotifyTracks(query, token);

    displayResults(results);
});

// Obter token de autenticação do Spotify
async function getSpotifyToken() {
    const clientId = "7f2cbc75628240c7ae420480f7e9a770"; // Substitua pelo seu Client ID
    const clientSecret = "4b01ef0ceccd46f4921f5a2c2abd792b"; // Substitua pelo seu Client Secret
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

// Buscar músicas usando a API do Spotify
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

// Exibir os resultados da pesquisa
function displayResults(tracks) {
    const resultsContainer = document.getElementById('music-results');
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores

    tracks.forEach(track => {
        const musicDiv = document.createElement('div');
        musicDiv.className = 'music-item';

        musicDiv.innerHTML = `
            <img src="${track.album.images[0].url}" alt="${track.name}">
            <div class="music-info">
                <h4>${track.name}</h4>
                <p>${track.artists[0].name}</p>
            </div>
            <button onclick="addToPlaylist(this, '${track.id}')">+</button>
        `;

        resultsContainer.appendChild(musicDiv);
    });
}

// Adicionar música à playlist no servidor Python com animação
async function addToPlaylist(button, trackId) {
    button.disabled = true; // Evita cliques repetidos

    try {
        const response = await fetch(`${ngrokURL}/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trackId })
        });

        if (response.ok) {
            button.innerText = "✓"; // Sucesso
            button.classList.add('success');
        } else {
            throw new Error("Erro ao adicionar música.");
        }
    } catch (error) {
        button.innerText = "X"; // Erro
        button.classList.add('error');
    } finally {
        setTimeout(() => {
            button.disabled = false; // Reabilita o botão após 2 segundos
            button.innerText = "+"; // Reseta para o estado inicial
            button.classList.remove('success', 'error');
        }, 2000);
    }
}
