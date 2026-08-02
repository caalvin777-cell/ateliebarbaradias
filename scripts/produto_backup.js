const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const produto = produtos.find(p => p.id === id);

if (!produto) {
    document.getElementById("produto").innerHTML =
        "<h2>Produto não encontrado.</h2>";
} else {
    document.getElementById("produto").innerHTML = `
        <h1>${produto.nome}</h1>

        <img
            src="../imagens/${produto.pasta}/${produto.pasta}1.jpg"
            width="350"
            onerror="this.src='../imagens/${produto.pasta}/${produto.pasta}1.jpeg'">

        <h2>R$ ${produto.preco.toFixed(2).replace('.', ',')}</h2>

        <p>${produto.descricao}</p>

        <p><strong>Estoque:</strong> ${produto.estoque}</p>

        <p><strong>Prazo:</strong> ${produto.prazo} dias</p>
    `;
}