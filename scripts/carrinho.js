import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    doc
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
let carrinho = [];

function abrirCarrinho() {
    document.getElementById("painel-carrinho").style.display = "block";
    atualizarCarrinho();
}

function fecharCarrinho() {
    document.getElementById("painel-carrinho").style.display = "none";
}

function adicionarCarrinho(id) {

    const produto = produtos.find(p => p.id === id);

    const item = carrinho.find(p => p.id === id);

if (item) {
    item.quantidade++;
} else {
    carrinho.push({
        ...produto,
        quantidade: 1
    });
}

    atualizarCarrinho();

    abrirCarrinho();
}

function atualizarCarrinho() {

    const lista = document.getElementById("itens-carrinho");

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach(produto => {

        total += produto.preco * produto.quantidade;

    lista.innerHTML += `
    <hr>
<div class="item-carrinho">

<img
    src="./imagens/${produto.pasta}/${produto.pasta}1.jpg"
    class="foto-carrinho"
    alt="${produto.nome}"
    onerror="
        if(this.src.endsWith('.jpg')){
            this.src='./imagens/${produto.pasta}/${produto.pasta}1.jpeg';
        }else if(this.src.endsWith('.jpeg')){
            this.src='./imagens/${produto.pasta}/${produto.pasta}1.png';
        }else{
            this.src='./imagens/logo.png';
        }
    ">

<h4>${produto.nome}</h4>

<p>
R$ ${produto.preco.toFixed(2).replace(".", ",")}
</p>

<div class="controles">

<button onclick="diminuirQuantidade(${produto.id})">−</button>

<span>${produto.quantidade}</span>

<button onclick="aumentarQuantidade(${produto.id})">+</button>

</div>

<p>

Subtotal:
<strong>

R$ ${(produto.preco * produto.quantidade)
.toFixed(2)
.replace(".", ",")}

</strong>

</p>

<button
onclick="removerProduto(${produto.id})"
class="botao-remover">

🗑 Remover

</button>

</div>
`;

    });

    document.getElementById("contador-carrinho").innerText =
        `(${carrinho.length})`;

    document.getElementById("total-carrinho").innerText =
        `R$ ${total.toFixed(2).replace(".", ",")}`;
        atualizarLinkWhatsapp();
}
function atualizarLinkWhatsapp(){

    let mensagem = "Olá!\n\nGostaria de comprar:\n\n";

    carrinho.forEach(produto => {

        mensagem +=
            "• " + produto.nome +
            " (" + produto.quantidade + " unidade(s))\n" +
            "R$ " +
            (produto.preco * produto.quantidade)
                .toFixed(2)
                .replace(".", ",") +
            "\n\n";

    });

    mensagem +=
        "Total: " +
        document.getElementById("total-carrinho").innerText;

    document.getElementById("finalizar-whatsapp").href =
        "https://wa.me/5511982747585?text=" +
        encodeURIComponent(mensagem);

}
function removerProduto(id){

    carrinho = carrinho.filter(produto => produto.id !== id);

    atualizarCarrinho();

}
function aumentarQuantidade(id){

    const item = carrinho.find(produto => produto.id === id);

    if(item){
        item.quantidade++;
    }

    atualizarCarrinho();

}

function diminuirQuantidade(id){

    const item = carrinho.find(produto => produto.id === id);

    if(!item) return;

    item.quantidade--;

    if(item.quantidade <= 0){
        removerProduto(id);
        return;
    }

    atualizarCarrinho();

}

function calcularFrete(){

    const tipoEntrega =
        document.querySelector('input[name="tipo-entrega"]:checked').value;

    if(tipoEntrega === "retirada"){

        document.getElementById("resultado-frete").innerHTML =
            "📍 Retirada no Ateliê<br><strong>Frete: Grátis</strong>";

        return;
    }

    document.getElementById("resultado-frete").innerHTML =
        "🔍 Calculando frete pelos Correios...";

}

// COLE AQUI
document.querySelectorAll('input[name="tipo-entrega"]').forEach(opcao => {

    opcao.addEventListener("change", function(){

        const cep = document.getElementById("cep");

        if(this.value === "retirada"){

            cep.disabled = true;
            cep.value = "";

            document.getElementById("resultado-frete").innerHTML =
                "📍 Retirada no Ateliê<br><strong>Frete Grátis</strong>";

        }else{

            cep.disabled = false;

            document.getElementById("resultado-frete").innerHTML = "";

        }

    });

});

document.getElementById("cep").disabled = true;

document.getElementById("resultado-frete").innerHTML =
    "📍 Retirada no Ateliê<br><strong>Frete Grátis</strong>";
window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;
window.adicionarCarrinho = adicionarCarrinho;
window.aumentarQuantidade = aumentarQuantidade;
window.diminuirQuantidade = diminuirQuantidade;
window.removerProduto = removerProduto;
window.calcularFrete = calcularFrete;
window.atualizarLinkWhatsapp = atualizarLinkWhatsapp;