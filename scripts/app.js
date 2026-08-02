import { produtos } from "./produtos.js";
const listaProdutos = document.getElementById("lista-produtos");

function mostrarProdutos(lista){
    console.log("lista =", lista);
console.log("É array?", Array.isArray(lista));
listaProdutos.innerHTML = "";

lista.forEach(produto => {

    listaProdutos.innerHTML += `
        <div class="produto">

        <img src="imagens/${produto.pasta}/${produto.pasta}1.jpg"
     alt="${produto.nome}"
    
    onerror="
        if(this.src.endsWith('.jpg')){
            this.src='imagens/${produto.pasta}/${produto.pasta}1.jpeg';
        }else if(this.src.endsWith('.jpeg')){
            this.src='imagens/${produto.pasta}/${produto.pasta}1.png';
        }else{
            this.src='imagens/logo.png';
        }
    ">

            <h2>${produto.nome}</h2>

            <p><strong>
                R$ ${produto.preco.toFixed(2).replace(".", ",")}
            </strong></p>

            <p>
                ${produto.descricao}
            </p>

            <p>
                Estoque:
                <strong>${produto.estoque} unidade(s)</strong><br>

                Também produzimos sob encomenda
                com prazo de até ${produto.prazo} dias.
            </p>

            <button class="botao"
    onclick="adicionarCarrinho(${produto.id})">

    🛒 Adicionar ao carrinho

</button>

        
<a class="botao-detalhes"
   href="produtos/produto.html?id=${produto.id}">
   Ver detalhes
</a>
        </div>
    `;

});

}
console.log("tipo:", typeof produtos);
console.log("é array?", Array.isArray(produtos));
console.log(produtos);
mostrarProdutos(produtos);

document.getElementById("pesquisa").addEventListener("input", function(){

    const texto = this.value.toLowerCase();

    const filtrados = produtos.filter(produto =>

        produto.nome.toLowerCase().includes(texto) ||

        produto.descricao.toLowerCase().includes(texto)

    );

    document.getElementById("lista-produtos").innerHTML = "";

    mostrarProdutos(filtrados);

});
function filtrarCategoria(categoria) {

    if (categoria === "") {
        mostrarProdutos(produtos);
        return;
    }

    const filtrados = produtos.filter(produto =>
        produto.categoria === categoria
    );

    mostrarProdutos(filtrados);
}
function ordenarProdutos() {

    const tipo = document.getElementById("ordenacao").value;

    let lista = [...produtos];

    switch (tipo) {

        case "menor":
            lista.sort((a, b) => a.preco - b.preco);
            break;

        case "maior":
            lista.sort((a, b) => b.preco - a.preco);
            break;

        case "az":
            lista.sort((a, b) => a.nome.localeCompare(b.nome));
            break;

        case "za":
            lista.sort((a, b) => b.nome.localeCompare(a.nome));
            break;
    }

    mostrarProdutos(lista);
}