import { adicionarAoCarrinho } from "./carrinho.js?v=3";
import { produtos } from "./produtos.js";

const lista = document.getElementById("lista-produtos");

window.numeroWhatsApp = "5511982747585";

const filtroCategoria = document.getElementById("categoria");
const pesquisa = document.getElementById("pesquisa");

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
// MOSTRAR PRODUTOS (LISTAGEM CONTÍNUA - SEM PAGINAÇÃO)
// ======================================================

function mostrarProdutos() {
    lista.innerHTML = "";

    const categoriaSelecionada = filtroCategoria.value;
    const textoPesquisa = pesquisa.value.toLowerCase().trim();

    let produtosFiltrados = produtos;

    if (categoriaSelecionada !== "") {
        produtosFiltrados = produtosFiltrados.filter(
            p => p.categoria === categoriaSelecionada
        );
    }

    if (textoPesquisa !== "") {
        produtosFiltrados = produtosFiltrados.filter(produto =>
            produto.nome.toLowerCase().includes(textoPesquisa)
        );
    }

    // Exibe todos os produtos encontrados de uma vez só em sequência
    produtosFiltrados.forEach(produto => {
        const card = document.createElement("div");
        card.className = "card-produto";

        card.innerHTML = `
            <img
                class="foto-principal-card"
                src="${produto.imagem}"
                onerror="
                    if(!this.dataset.ext || this.dataset.ext === 'jpg') {
                        this.dataset.ext = 'jpeg';
                        this.src = this.src.replace(/\.(jpg|jpeg|png|webp)$/i, '.jpeg');
                    } else if(this.dataset.ext === 'jpeg') {
                        this.dataset.ext = 'png';
                        this.src = this.src.replace(/\.(jpg|jpeg|png|webp)$/i, '.png');
                    } else if(this.dataset.ext === 'png') {
                        this.dataset.ext = 'webp';
                        this.src = this.src.replace(/\.(jpg|jpeg|png|webp)$/i, '.webp');
                    } else {
                        this.src = 'imagens/logo.png';
                    }
                "
                alt="${produto.nome}"
            >
            <h3>${produto.nome}</h3>
            <p class="descricao">${produto.descricao}</p>
            <div class="preco">
                R$ ${Number(produto.preco).toFixed(2)}
            </div>
            <button class="btn-carrinho" type="button">
                🛒 ADICIONAR AO CARRINHO
            </button>
            <button class="btn-detalhes" type="button">
                📷 MAIS DETALHES
            </button>
        `;

        lista.appendChild(card);

        card.querySelector(".btn-carrinho").addEventListener("click", () => {
            adicionarAoCarrinho(produto);
        });

        card.querySelector(".btn-detalhes").addEventListener("click", () => {
            abrirDetalhes(produto);
        });
    });

    // Remove permanentemente qualquer elemento de paginação da tela
    const nav = document.getElementById("paginacao");
    if (nav) {
        nav.remove();
    }
}

// ======================================================
// JANELA DE DETALHES (MODAL)
// ======================================================

function abrirDetalhes(produto) {
    const janelaAnterior = document.getElementById("janelaDetalhes");
    if (janelaAnterior) {
        janelaAnterior.remove();
    }

    const janela = document.createElement("div");
    janela.id = "janelaDetalhes";
    janela.className = "janela-detalhes";

    janela.innerHTML = `
        <div class="conteudo-detalhes">
            <button class="fechar-detalhes" type="button">×</button>
            <h2>${produto.nome}</h2>
            <div class="foto-grande-container">
                <img
                    id="fotoGrandeDetalhes"
                    class="foto-grande-detalhes"
                    src="${produto.imagem}"
                    onerror="
                        if(!this.dataset.ext || this.dataset.ext === 'jpg') {
                            this.dataset.ext = 'jpeg';
                            this.src = this.src.replace(/\.(jpg|jpeg|png|webp)$/i, '.jpeg');
                        } else if(this.dataset.ext === 'jpeg') {
                            this.dataset.ext = 'png';
                            this.src = this.src.replace(/\.(jpg|jpeg|png|webp)$/i, '.png');
                        } else {
                            this.src = 'imagens/logo.png';
                        }
                    "
                    alt="${produto.nome}"
                >
            </div>
            <div class="miniaturas-detalhes" id="miniaturasDetalhes"></div>
            <p class="descricao-detalhes">${produto.descricao}</p>
            <div class="preco-detalhes">
                R$ ${Number(produto.preco).toFixed(2)}
            </div>
        </div>
    `;

    document.body.appendChild(janela);

    const miniaturas = document.getElementById("miniaturasDetalhes");
    const fotoGrande = document.getElementById("fotoGrandeDetalhes");
    
    const quantidadeFotos = 1;

    for (let numero = 1; numero <= quantidadeFotos; numero++) {
        const miniatura = document.createElement("img");
        miniatura.className = "miniatura-detalhes";
        miniatura.alt = produto.nome;
        miniatura.src = produto.imagem;

        miniatura.onerror = function () {
            this.src = 'imagens/logo.png';
        };

        miniaturas.appendChild(miniatura);

        miniatura.addEventListener("click", () => {
            fotoGrande.src = miniatura.src;
        });
    }

    janela.querySelector(".fechar-detalhes").addEventListener("click", () => {
        janela.remove();
    });

    janela.addEventListener("click", evento => {
        if (evento.target === janela) {
            janela.remove();
        }
    });
}

// Listeners de filtro e pesquisa
pesquisa.addEventListener("input", () => { mostrarProdutos(); });
filtroCategoria.addEventListener("change", () => { mostrarProdutos(); });

const btnCarrinho = document.getElementById("btnCarrinho");
if (btnCarrinho) {
    btnCarrinho.addEventListener("click", () => {
        if (window.abrirCarrinho) window.abrirCarrinho();
    });
}

mostrarProdutos();