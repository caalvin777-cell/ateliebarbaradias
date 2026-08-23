import { adicionarAoCarrinho } from "./carrinho.js?v=3";
import { produtos } from "./produtos.js";

const lista = document.getElementById("lista-produtos");
const filtroCategoria = document.getElementById("categoria");
const pesquisa = document.getElementById("pesquisa");

window.numeroWhatsApp = "5511982747585";

// ======================================================
// CATEGORIAS (COM VERIFICAÇÃO DE SEGURANÇA)
// ======================================================

if (filtroCategoria && Array.isArray(produtos)) {
    const categorias = [
        ...new Set(produtos.map(p => p.categoria).filter(Boolean))
    ].sort();

    categorias.forEach(categoria => {
        const option = document.createElement("option");
        option.value = categoria;
        option.textContent = categoria;
        filtroCategoria.appendChild(option);
    });
}

// ======================================================
// MOSTRAR PRODUTOS (LISTAGEM CONTÍNUA - SEM PAGINAÇÃO)
// ======================================================

function mostrarProdutos() {
    if (!lista) return;
    lista.innerHTML = "";

    const categoriaSelecionada = filtroCategoria ? filtroCategoria.value : "";
    const textoPesquisa = pesquisa ? pesquisa.value.toLowerCase().trim() : "";

    let produtosFiltrados = produtos || [];

    if (categoriaSelecionada !== "") {
        produtosFiltrados = produtosFiltrados.filter(
            p => p.categoria === categoriaSelecionada
        );
    }

    if (textoPesquisa !== "") {
        produtosFiltrados = produtosFiltrados.filter(produto =>
            produto.nome && produto.nome.toLowerCase().includes(textoPesquisa)
        );
    }

    // Exibe todos os produtos encontrados em sequência contínua
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
                        this.src = this.src.replace(/\\.(jpg|jpeg|png|webp)$/i, '.jpeg');
                    } else if(this.dataset.ext === 'jpeg') {
                        this.dataset.ext = 'png';
                        this.src = this.src.replace(/\\.(jpg|jpeg|png|webp)$/i, '.png');
                    } else if(this.dataset.ext === 'png') {
                        this.dataset.ext = 'webp';
                        this.src = this.src.replace(/\\.(jpg|jpeg|png|webp)$/i, '.webp');
                    } else {
                        this.src = 'imagens/logo.png';
                    }
                "
                alt="${produto.nome}"
            >
            <h3>${produto.nome}</h3>
            <p class="descricao">${produto.descricao || ''}</p>
            <div class="preco">
                R$ ${Number(produto.preco || 0).toFixed(2)}
            </div>
            <button class="btn-carrinho" type="button">
                🛒 ADICIONAR AO CARRINHO
            </button>
            <button class="btn-detalhes" type="button">
                📷 MAIS DETALHES
            </button>
        `;

        lista.appendChild(card);

        const btnCarrinho = card.querySelector(".btn-carrinho");
        if (btnCarrinho) {
            btnCarrinho.addEventListener("click", () => adicionarAoCarrinho(produto));
        }

        const btnDetalhes = card.querySelector(".btn-detalhes");
        if (btnDetalhes) {
            btnDetalhes.addEventListener("click", () => abrirDetalhes(produto));
        }
    });

    // Remove permanentemente qualquer elemento de paginação
    const nav = document.getElementById("paginacao");
    if (nav) nav.remove();
}

// ======================================================
// JANELA DE DETALHES (MODAL COM MINIATURAS CORRIGIDAS)
// ======================================================

function abrirDetalhes(produto) {
    const janelaAnterior = document.getElementById("janelaDetalhes");
    if (janelaAnterior) janelaAnterior.remove();

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
                            this.src = this.src.replace(/\\.(jpg|jpeg|png|webp)$/i, '.jpeg');
                        } else if(this.dataset.ext === 'jpeg') {
                            this.dataset.ext = 'png';
                            this.src = this.src.replace(/\\.(jpg|jpeg|png|webp)$/i, '.png');
                        } else {
                            this.src = 'imagens/logo.png';
                        }
                    "
                    alt="${produto.nome}"
                >
            </div>
            <div class="miniaturas-detalhes" id="miniaturasDetalhes"></div>
            <p class="descricao-detalhes">${produto.descricao || ''}</p>
            <div class="preco-detalhes">
                R$ ${Number(produto.preco || 0).toFixed(2)}
            </div>
        </div>
    `;

    document.body.appendChild(janela);

    const miniaturas = document.getElementById("miniaturasDetalhes");
    const fotoGrande = document.getElementById("fotoGrandeDetalhes");

    // Carrega dinamicamente as fotos da pasta do produto
    if (miniaturas && produto.pasta) {
        const maxFotos = produto.fotos || 5; 

        for (let numero = 1; numero <= maxFotos; numero++) {
            const miniatura = document.createElement("img");
            miniatura.className = "miniatura-detalhes";
            miniatura.alt = `${produto.nome} - foto ${numero}`;

            const caminhoBase = `imagens/${produto.pasta}/${produto.pasta}${numero}`;

            miniatura.onerror = function () {
                if (!this.dataset.tentouJpeg) {
                    this.dataset.tentouJpeg = "sim";
                    this.src = `${caminhoBase}.jpeg`;
                } else if (!this.dataset.tentouPng) {
                    this.dataset.tentouPng = "sim";
                    this.src = `${caminhoBase}.png`;
                } else {
                    // Se a foto número N não existir na pasta, remove do modal
                    this.remove();
                }
            };

            miniatura.src = `${caminhoBase}.jpg`;
            miniaturas.appendChild(miniatura);

            miniatura.addEventListener("click", () => {
                if (fotoGrande) fotoGrande.src = miniatura.src;
            });
        }
    }

    const btnFechar = janela.querySelector(".fechar-detalhes");
    if (btnFechar) {
        btnFechar.addEventListener("click", () => janela.remove());
    }

    janela.addEventListener("click", evento => {
        if (evento.target === janela) janela.remove();
    });
}

// ======================================================
// EVENT LISTENERS E INICIALIZAÇÃO
// ======================================================

if (pesquisa) {
    pesquisa.addEventListener("input", mostrarProdutos);
}

if (filtroCategoria) {
    filtroCategoria.addEventListener("change", mostrarProdutos);
}

const btnCarrinho = document.getElementById("btnCarrinho");
if (btnCarrinho) {
    btnCarrinho.addEventListener("click", () => {
        if (window.abrirCarrinho) window.abrirCarrinho();
    });
}

// Executa a listagem inicial
mostrarProdutos();