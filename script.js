// ====================================================================
// CONFIGURAÇÃO GERAL
// ====================================================================

// --- SPOTIFY CREDENCIAIS (CLIENT-SIDE) ---
// O Client Secret está incluído apenas para a função de pesquisa (getSpotifyTokenForSearch),
// o que é um risco de segurança, mas é o único caminho 100% frontend para pesquisa sem backend.
const CLIENT_ID = "1348b2d7b8d943049d718c622e6c9abc"; 
const CLIENT_SECRET = "0e4556954f554eec9561078c6254ef46"; 
const REDIRECT_URI = window.location.href.split('#')[0]; // URL atual do seu site
const SCOPES = 'streaming user-read-playback-state user-modify-playback-state';

let ACCESS_TOKEN = null;
let spotifyPlayer; // Variável global para o Player SDK

// ====================================================================
// FUNÇÕES DE INICIALIZAÇÃO E BACKGROUND
// ====================================================================

// Tela de abertura: esconde o texto de introdução após 1 segundo
window.onload = function () {
    aplicarBackgroundAleatorio(); 
    setTimeout(() => {
        const intro = document.getElementById('intro');
        if (intro) {
            intro.style.display = 'none';
        }
    }, 1000);
    checkSpotifyAuthentication(); // Checa se já existe um token no URL
};

// Configuração das mídias e suas probabilidades
let midiasComProbabilidades = [
    { src: 'IMG/A.gif', chance: 5 }, 
    { src: 'IMG/A1.mp4', chance: 40 },
    { src: 'IMG/A2.gif', chance: 15 },
    { src: 'IMG/A3.mp4', chance: 50 },
    { src: 'IMG/A4.gif', chance: 35 },
    { src: 'IMG/A5.gif', chance: 55 },
    { src: 'IMG/A6.gif', chance: 55 },
    { src: 'IMG/A7.gif', chance: 55 },
    { src: 'IMG/A8.gif', chance: 55 },
    { src: 'IMG/A9.gif', chance: 55 },
    { src: 'IMG/A10.gif', chance: 55 },
    { src: 'IMG/A11.gif', chance: 55 }     
];

// Aplica o background aleatório baseado na probabilidade
function aplicarBackgroundAleatorio() {
    let midias = [];
    midiasComProbabilidades.forEach(midia => {
        for (let i = 0; i < midia.chance; i++) {
            midias.push(midia.src);
        }
    });

    let randomMedia = midias[Math.floor(Math.random() * midias.length)];

    if (randomMedia) {
        let isVideo = randomMedia.includes('.mp4') || randomMedia.includes('.webm') || randomMedia.includes('.avi');

        if (isVideo) {
            let video = document.createElement('video');
            video.src = randomMedia;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;';
            document.body.appendChild(video);
        } else {
            document.body.style.backgroundImage = `url(${randomMedia})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
    }
}

// ====================================================================
// FUNÇÕES DE INTERFACE (MENU)
// ====================================================================

const menu = document.querySelector('.menu');
const spotifyPage = document.getElementById('spotify-page');

// Abre a página do Spotify ao clicar nos três pontos
if (menu) {
    menu.addEventListener('click', () => {
        if (spotifyPage) {
            spotifyPage.style.display = 'flex';
        }
    });
}

// Fecha a página do Spotify ao clicar fora do conteúdo
if (spotifyPage) {
    spotifyPage.addEventListener('click', (e) => {
        if (e.target === spotifyPage) {
            spotifyPage.style.display = 'none';
        }
    });
}

// ====================================================================
// AUTENTICAÇÃO SPOTIFY (Implicit Grant Flow)
// ====================================================================

// Inicia o processo de autenticação, redirecionando para o Spotify
function authenticateSpotify() {
    const authUrl = 'http://googleusercontent.com/spotify.com/8' +
        'client_id=' + CLIENT_ID +
        '&response_type=token' +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&scope=' + encodeURIComponent(SCOPES);
    
    window.location = authUrl;
}

// Checa o URL em busca de um token após o redirecionamento
function checkSpotifyAuthentication() {
    const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) => {
            if (item) {
                const parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});

    window.location.hash = ''; // Limpa o hash do URL

    if (hash.access_token) {
        ACCESS_TOKEN = hash.access_token;
        console.log("Token de Acesso obtido com sucesso. Duração:", hash.expires_in, "segundos.");
        // O player será inicializado quando o SDK estiver pronto
    } else {
        console.log("Token de Acesso não encontrado. Login necessário para tocar música.");
    }
}

// ====================================================================
// WEB PLAYBACK SDK E CONTROLE
// ====================================================================

// É acionado automaticamente quando o script do SDK carrega
window.onSpotifyWebPlaybackSDKReady = () => {
    if (!ACCESS_TOKEN) {
        // Se o token não foi carregado, exibe o botão de login
        showLoginRequired();
        return;
    }
    
    initializeSpotifyPlayer(ACCESS_TOKEN);
};

// Mostra o botão de login na área de resultados se o token não estiver disponível
function showLoginRequired() {
    const resultsContainer = document.getElementById('music-results');
    if (resultsContainer) {
         resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>O Spotify Premium é necessário e você precisa fazer login.</p>
                <button id="login-spotify-btn" style="padding: 10px 20px; cursor: pointer;">
                    Logar no Spotify
                </button>
            </div>
        `;
        document.getElementById('login-spotify-btn').onclick = authenticateSpotify;
    }
}

function initializeSpotifyPlayer(token) {
    spotifyPlayer = new Spotify.Player({
        name: 'Player do Canal (GitHub)',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
    });

    spotifyPlayer.connect().then(success => {
        if (success) {
            console.log('✅ Web Playback SDK conectado com sucesso!');
        }
    });

    spotifyPlayer.addListener('authentication_error', ({ message }) => { 
        console.error('Erro de Autenticação (Token Expirado):', message); 
        ACCESS_TOKEN = null;
        alert("Sessão do Spotify expirada. Faça login novamente.");
        showLoginRequired();
    });
    
    spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player está pronto. ID:', device_id);
    });
}

// Função para trocar a música usando o SDK
async function changeTrack(button, trackId) {
    if (!spotifyPlayer || !ACCESS_TOKEN) {
        alert("🚨 Faça login no Spotify antes de tentar tocar a música.");
        return;
    }

    button.disabled = true;

    try {
        await spotifyPlayer.connect(); 
        
        // Carrega a música e começa a tocar no player do navegador
        await spotifyPlayer.loadUri(`spotify:track:${trackId}`);
        await spotifyPlayer.resume(); 

        console.log(`Música ${trackId} carregada e tocando.`);
        button.innerText = "♪";
        button.classList.add('success');
        
    } catch (error) {
        console.error("Erro ao tocar a música via SDK:", error);
        button.innerText = "X";
        button.classList.add('error');
        alert("Erro ao tocar. Certifique-se de que o player está conectado.");
    } finally {
        setTimeout(() => {
            button.disabled = false;
            button.innerText = "+";
            button.classList.remove('success', 'error');
        }, 2000);
    }
}

// ====================================================================
// PESQUISA DE MÚSICAS
// ====================================================================

// Obter token de autenticação: prioriza o token de login, senão usa o Client Credentials
async function getSpotifyTokenForSearch() {
    if (ACCESS_TOKEN) {
        return ACCESS_TOKEN;
    }

    // ⚠️ ATENÇÃO: Se não há token de login, usa Client Credentials para pesquisa (expõe o Client Secret)
    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${auth}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) throw new Error("Erro ao obter token de pesquisa.");
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Falha ao obter o Token de Pesquisa:", error);
        return null;
    }
}

// Buscar músicas no Spotify
async function fetchSpotifyTracks(query) {
    const token = await getSpotifyTokenForSearch();
    if (!token) return [];

    try {
        const response = await fetch(
            `http://googleusercontent.com/spotify.com/9`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) throw new Error("Erro ao buscar músicas.");
        const data = await response.json();
        return data.tracks.items;
    } catch (error) {
        console.error("Falha ao buscar músicas do Spotify:", error);
        return [];
    }
}

// Exibir os resultados da pesquisa
function displayResults(tracks) {
    const resultsContainer = document.getElementById('music-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';

    if (tracks.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
        return;
    }

    tracks.forEach(track => {
        const musicDiv = document.createElement('div');
        musicDiv.className = 'music-item';

        const imageUrl = track.album.images.length > 0 ? track.album.images[0].url : 'placeholder.jpg';

        musicDiv.innerHTML = `
            <img src="${imageUrl}" alt="${track.name}">
            <div class="music-info">
                <h4>${track.name}</h4>
                <p>${track.artists.map(a => a.name).join(', ')}</p>
            </div>
            <button onclick="changeTrack(this, '${track.id}')">+</button> 
        `;
        resultsContainer.appendChild(musicDiv);
    });
}

// Evento de Pesquisa
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value;
    if (!query) return;

    const results = await fetchSpotifyTracks(query);
    displayResults(results);
});