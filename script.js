

// Função para mudar o fundo aleatoriamente
window.onload = function() {
    let imagens = ['IMG/imagem1.gif']; // Adicione o caminho das suas imagens aqui
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









