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
