// ====================================================================
// CONFIGURAÇÃO GERAL
// ====================================================================

// --- SPOTIFY CREDENCIAIS ---
const CLIENT_ID = "1348b2d7b8d943049d718c622e6c9abc"; 
const CLIENT_SECRET = "0e4556954f554eec9561078c6254ef46"; 

// OTIMIZAÇÃO: Garante o URL base https://guhcansado.github.io/Guh/ para o Spotify
const REDIRECT_URI = window.location.origin + window.location.pathname.replace('index.html', '');
const SCOPES = 'streaming user-read-playback-state user-modify-playback-state';

let ACCESS_TOKEN = null;
let spotifyPlayer; // Variável global para o Player SDK

// ====================================================================
// FUNÇÕES DE INICIALIZAÇÃO E BACKGROUND
// ====================================================================

window.onload = function () {
    aplicarBackgroundAleatorio(); 
    setTimeout(() => {
        const intro = document.getElementById('intro');
        if (intro) {
            intro.style.display = 'none';
        }
    }, 1000);
    checkSpotifyAuthentication(); 
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

if (menu) {
    menu.addEventListener('click', () => {
        if (spotifyPage) {
            spotifyPage.style.display = 'flex';
        }
    });
}

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

function authenticateSpotify() {
    // 🚨 CORREÇÃO: URL HTTPS
    const authUrl = 'http://googleusercontent.com/spotify.com/authorize?' +
        'client_id=' + CLIENT_ID +
        '&response_type=token' +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&scope=' + encodeURIComponent(SCOPES);
    
    window.location = authUrl;
}

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

    window.location.hash = '';

    if (hash.access_token) {
        ACCESS_TOKEN = hash.access_token;
        console.log("Token de Acesso obtido com sucesso. Duração:", hash.expires_in, "segundos.");
    } else {
        console.log("Token de Acesso não encontrado. Login necessário para tocar música.");
    }
}

// ====================================================================
// WEB PLAYBACK SDK E CONTROLE
// ====================================================================

window.onSpotifyWebPlaybackSDKReady = () => {
    if (!ACCESS_TOKEN) {
        showLoginRequired();
        return;
    }
    
    initializeSpotifyPlayer(ACCESS_TOKEN);
};

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
        const loginButton = document.getElementById('login-spotify-btn');
        if (loginButton) {
            loginButton.onclick = authenticateSpotify;
        }
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

async function changeTrack(button, trackId) {
    if (!spotifyPlayer || !ACCESS_TOKEN) {
        alert("🚨 Faça login no Spotify antes de tentar tocar a música.");
        return;
    }

    button.disabled = true;

    try {
        await spotifyPlayer.connect(); 
        
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

async function getSpotifyTokenForSearch() {
    if (ACCESS_TOKEN) {
        return ACCESS_TOKEN;
    }

    const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
    try {
        // 🚨 CORREÇÃO: URL HTTPS
        const response = await fetch('http://googleusercontent.com/spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${auth}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
             const errorData = await response.json();
             console.error("Erro de Autenticação na Pesquisa (401): CLIENT SECRET incorreto ou problema na API.");
             throw new Error(`Erro de autenticação: ${errorData.error_description || 'Verifique o Client Secret.'}`);
        }
        
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Falha ao obter o Token de Pesquisa:", error);
        return null;
    }
}

async function fetchSpotifyTracks(query) {
    const token = await getSpotifyTokenForSearch();
    if (!token) return [];

    try {
        // 🚨 CORREÇÃO: URL HTTPS
        const response = await fetch(
            `http://googleusercontent.com/spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro na API: ${response.status} - ${errorData.error.message || 'Desconhecido'}`);
        }
        
        const data = await response.json();
        return data.tracks && data.tracks.items ? data.tracks.items : []; 
        
    } catch (error) {
        console.error("Falha ao buscar músicas do Spotify:", error);
        return [];
    }
}

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

document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-bar').value;
    if (!query) return;

    const results = await fetchSpotifyTracks(query);
    displayResults(results);
});