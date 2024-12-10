// Função para mudar o fundo aleatoriamente
window.onload = function() {
    let imagens = ['IMG/imagem1.gif', 'IMG/imagem2.gif', 'IMG/imagem3.gif', 'IMG/imagem4.gif', 'IMG/imagem5.gif', 'IMG/imagem6.gif','IMG/imagem7.gif','IMG/imagem8.gif',
                  'IMG/imagem9.gif','IMG/imagem10.gif','IMG/imagem11.gif','IMG/imagem12.gif','IMG/imagem13.gif','IMG/imagem14.gif','IMG/imagem15.gif',]; // Adicione o caminho das suas imagens aqui
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
