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
    let randomChance = Math.floor(Math.random() * 101); // randomChance entre 0 e 100
    let cumulativeChance = 0; // Chance acumulada

    // Verifica qual imagem será selecionada com base nas chances
    for (let i = 0; i < imagens.length; i++) {
        cumulativeChance += imagens[i].chance;

        // Se o número aleatório for menor ou igual à chance acumulada, seleciona esta imagem
        if (randomChance < cumulativeChance) {
            document.body.style.backgroundImage = `url(${imagens[i].src})`;
            console.log(`Imagem selecionada: ${imagens[i].src} com chance de ${imagens[i].chance}%`);
            return; // Sai da função após definir o fundo
        }
    }

    // Caso o número aleatório não caia em nenhuma das chances acumuladas
    console.log("Nenhuma imagem foi selecionada, chances não atendidas.");
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

// Exibir a página do carrinho
document.getElementById("shopping-cart-btn").addEventListener("click", function() {
    document.getElementById("cart-page").style.display = 'flex';
});

// Fechar a página do carrinho
document.getElementById("back-button").addEventListener("click", function() {
    document.getElementById("cart-page").style.display = 'none';
});

// Adicionar link e imagem ao catálogo
document.getElementById("add-link-button").addEventListener("click", function() {
    const linkUrl = document.getElementById("link-input").value;
    const imageUrl = document.getElementById("image-input").value;

    if (linkUrl && imageUrl) {
        const ul = document.querySelector(".catalog-list");
        const li = document.createElement("li");

        // Cria a imagem
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Imagem do Link";
        img.style.width = "100%"; // Ajuste a largura da imagem

        // Cria o link
        const a = document.createElement("a");
        a.href = linkUrl;
        a.target = "_blank";
        a.textContent = linkUrl;

        // Adiciona a imagem e o link ao item da lista
        li.appendChild(img);
        li.appendChild(a);

        // Adiciona o item à lista
        ul.appendChild(li);

        // Limpa os campos de entrada
        document.getElementById("link-input").value = '';
        document.getElementById("image-input").value = '';
    } else {
        alert("Por favor, insira tanto a URL do link quanto a URL da imagem.");
    }
});
