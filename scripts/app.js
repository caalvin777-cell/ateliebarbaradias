import { adicionarAoCarrinho } from "./carrinho.js?v=3";
import { produtos } from "./produtos.js";

const lista = document.getElementById("lista-produtos");

window.numeroWhatsApp = "5511982747585";

const filtroCategoria = document.getElementById("categoria");
const pesquisa = document.getElementById("pesquisa");

let pagina = 1;
const porPagina = 5;


// ======================================================
// CATEGORIAS
// ======================================================

const categorias = [
    ...new Set(produtos.map(p => p.categoria))
].sort();

categorias.forEach(categoria => {

    const option = document.createElement("option");

    option.value = categoria;
    option.textContent = categoria;

    filtroCategoria.appendChild(option);
});


// ======================================================
// MOSTRAR PRODUTOS
// ======================================================

function mostrarProdutos() {

    lista.innerHTML = "";

    const categoriaSelecionada =
        filtroCategoria.value;

    const textoPesquisa =
        pesquisa.value.toLowerCase().trim();


    let produtosFiltrados = produtos;


    // FILTRO POR CATEGORIA
    if (categoriaSelecionada !== "") {

        produtosFiltrados =
            produtosFiltrados.filter(
                p => p.categoria === categoriaSelecionada
            );
    }


    // PESQUISA
    if (textoPesquisa !== "") {

        produtosFiltrados =
            produtosFiltrados.filter(produto =>
                produto.nome
                    .toLowerCase()
                    .includes(textoPesquisa)
            );
    }


    // PAGINAÇÃO
    let paginaAtual;

if (categoriaSelecionada === "" && textoPesquisa === "") {

    // TODAS AS CATEGORIAS:
    // mostra todos os produtos em sequência
    paginaAtual = produtosFiltrados;

} else {

    // Categoria ou pesquisa:
    // mantém a paginação de 5 produtos
    const inicio =
        (pagina - 1) * porPagina;

    const fim =
        inicio + porPagina;

    paginaAtual =
        produtosFiltrados.slice(inicio, fim);
}


    // ==================================================
    // CARTÕES
    // ==================================================

    paginaAtual.forEach(produto => {

        const card =
            document.createElement("div");

        card.className =
            "card-produto";


        card.innerHTML = `

            <img
                class="foto-principal-card"
                src="imagens/${produto.pasta}/${produto.pasta}1.jpeg"
                onerror="this.onerror=null; this.src='imagens/${produto.pasta}/${produto.pasta}1.jpg';"
                alt="${produto.nome}"
            >

            <h3>
                ${produto.nome}
            </h3>

            <p class="descricao">
                ${produto.descricao}
            </p>

            <div class="preco">
                R$ ${Number(produto.preco).toFixed(2)}
            </div>

            <button
                class="btn-carrinho"
                type="button">

                🛒 ADICIONAR AO CARRINHO

            </button>

            <button
                class="btn-detalhes"
                type="button">

                📷 MAIS DETALHES

            </button>
        `;


        lista.appendChild(card);


        // ==================================================
        // BOTÃO CARRINHO
        // ==================================================

        card
            .querySelector(".btn-carrinho")
            .addEventListener("click", () => {

                adicionarAoCarrinho(produto);

            });


        // ==================================================
        // BOTÃO MAIS DETALHES
        // ==================================================

        card
            .querySelector(".btn-detalhes")
            .addEventListener("click", () => {

                abrirDetalhes(produto);

            });

    });


    if (categoriaSelecionada === "" && textoPesquisa === "") {

    const nav = document.getElementById("paginacao");

    if (nav) {
        nav.innerHTML = "";
    }

} else {

    desenharPaginacao(produtosFiltrados);
}
}


// ======================================================
// JANELA DE DETALHES
// ======================================================

function abrirDetalhes(produto) {

    // Remove janela anterior
    const janelaAnterior =
        document.getElementById("janelaDetalhes");

    if (janelaAnterior) {
        janelaAnterior.remove();
    }


    const janela =
        document.createElement("div");

    janela.id =
        "janelaDetalhes";

    janela.className =
        "janela-detalhes";


    janela.innerHTML = `

        <div class="conteudo-detalhes">

            <button
                class="fechar-detalhes"
                type="button">

                ×

            </button>


            <h2>
                ${produto.nome}
            </h2>


            <div class="foto-grande-container">

                <img
                    id="fotoGrandeDetalhes"
                    class="foto-grande-detalhes"
                    src="imagens/${produto.pasta}/${produto.pasta}1.jpeg"
                    onerror="this.onerror=null; this.src='imagens/${produto.pasta}/${produto.pasta}1.jpg';"
                    alt="${produto.nome}"
                >

            </div>


            <div
                class="miniaturas-detalhes"
                id="miniaturasDetalhes">

            </div>


            <p class="descricao-detalhes">
                ${produto.descricao}
            </p>


            <div class="preco-detalhes">
                R$ ${Number(produto.preco).toFixed(2)}
            </div>

        </div>
    `;


    document.body.appendChild(janela);


    // ==================================================
    // MINIATURAS
    // ==================================================

    const miniaturas =
        document.getElementById(
            "miniaturasDetalhes"
        );

    const fotoGrande =
        document.getElementById(
            "fotoGrandeDetalhes"
        );


    const quantidadeFotos =
    Number(produto.fotos) || 10;


for (
    let numero = 1;
    numero <= quantidadeFotos;
    numero++
) {

    const miniatura =
        document.createElement("img");


    miniatura.className =
        "miniatura-detalhes";


    miniatura.alt =
        `${produto.nome} - foto ${numero}`;


    miniatura.onload = function () {

        miniaturas.appendChild(miniatura);

    };


    miniatura.onerror = function () {

        if (!miniatura.dataset.tentouJpg) {

            miniatura.dataset.tentouJpg = "sim";

            miniatura.src =
                `imagens/${produto.pasta}/${produto.pasta}${numero}.jpg`;

        } else {

            miniatura.remove();

        }

    };


    miniatura.src =
        `imagens/${produto.pasta}/${produto.pasta}${numero}.jpeg`;


    miniatura.addEventListener(
        "click",
        () => {

            fotoGrande.src =
                miniatura.src;

        }
    );

}


    // ==================================================
    // FECHAR
    // ==================================================

    janela
        .querySelector(".fechar-detalhes")
        .addEventListener("click", () => {

            janela.remove();

        });


    // Clicar fora da janela também fecha
    janela.addEventListener(
        "click",
        evento => {

            if (
                evento.target === janela
            ) {

                janela.remove();

            }

        }
    );
}


// ======================================================
// PAGINAÇÃO
// ======================================================

function desenharPaginacao(listaFiltrada) {

    let nav =
        document.getElementById("paginacao");


    if (!nav) {

        nav =
            document.createElement("div");

        nav.id =
            "paginacao";

        lista.after(nav);
    }


    const totalPaginas =
        Math.ceil(
            listaFiltrada.length /
            porPagina
        );


    nav.innerHTML = "";


    if (totalPaginas <= 1) {
        return;
    }


    for (
        let i = 1;
        i <= totalPaginas;
        i++
    ) {

        const botao =
            document.createElement("button");


        botao.textContent =
            i;


        if (i === pagina) {
            botao.disabled = true;
        }


        botao.addEventListener(
            "click",
            () => {

                pagina = i;

                mostrarProdutos();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        nav.appendChild(botao);
    }
}


// ======================================================
// PESQUISA
// ======================================================

pesquisa.addEventListener(
    "input",
    () => {

        pagina = 1;

        mostrarProdutos();

    }
);


// ======================================================
// CATEGORIA
// ======================================================

filtroCategoria.addEventListener(
    "change",
    () => {

        pagina = 1;

        mostrarProdutos();

    }
);

// ======================================================
// ABRIR CARRINHO
// ======================================================

const btnCarrinho =
    document.getElementById("btnCarrinho");

if (btnCarrinho) {

    btnCarrinho.addEventListener("click", () => {

        if (window.abrirCarrinho) {
            window.abrirCarrinho();
        }

    });

}


// ======================================================
// INICIALIZA
// ======================================================

mostrarProdutos();
