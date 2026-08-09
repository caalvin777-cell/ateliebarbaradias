let carrinho = [];

let frete = 0;
let tipoEntrega = "frete";


// ======================================================
// ADICIONAR PRODUTO AO CARRINHO
// ======================================================

function adicionarAoCarrinho(produto) {

    const item = carrinho.find(p => p.id === produto.id);

    if (item) {

        item.quantidade++;

    } else {

        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}


// ======================================================
// AUMENTAR QUANTIDADE
// ======================================================

function aumentarQuantidade(id) {

    const item = carrinho.find(p => p.id === id);

    if (item) {
        item.quantidade++;
    }

    atualizarCarrinho();
}


// ======================================================
// DIMINUIR QUANTIDADE
// ======================================================

function diminuirQuantidade(id) {

    const item = carrinho.find(p => p.id === id);

    if (!item) return;

    item.quantidade--;

    if (item.quantidade <= 0) {

        carrinho = carrinho.filter(p => p.id !== id);
    }

    atualizarCarrinho();
}


// ======================================================
// ATUALIZAR CARRINHO
// ======================================================

function atualizarCarrinho() {

    const contador = document.getElementById("contadorCarrinho");
    const areaCarrinho = document.getElementById("carrinho");

    if (!contador || !areaCarrinho) {
        return;
    }

    const totalItens = carrinho.reduce(
        (total, produto) => total + produto.quantidade,
        0
    );

    contador.textContent = totalItens;


    // Carrinho vazio
    if (carrinho.length === 0) {

        areaCarrinho.innerHTML = `
            <h2>Seu carrinho está vazio</h2>
        `;

        return;
    }


    let total = 0;

    let html = `
        <h2>Seu Carrinho</h2>

        <label for="cepDestino">
            CEP de entrega:
        </label>

        <input
            type="text"
            id="cepDestino"
            placeholder="00000-000"
            maxlength="9"
        >

        <button
            class="btn-calcular-frete"
            onclick="calcularFrete()">

            CALCULAR FRETE

        </button>

        <button
            class="btn-retirada"
            onclick="retiradaGratis()">

            RETIRADA GRÁTIS NO LOCAL

        </button>
    `;


    // ==================================================
    // PRODUTOS DO CARRINHO
    // ==================================================

    carrinho.forEach(produto => {

        const subtotal =
            Number(produto.preco) * produto.quantidade;

        total += subtotal;

        html += `
            <div class="item-carrinho">

                <img
                    src="imagens/${produto.pasta}/${produto.pasta}1.jpeg"
                    class="foto-carrinho"
                    onerror="this.onerror=null; this.src='imagens/${produto.pasta}/${produto.pasta}1.jpg';"
                >

                <strong>
                    ${produto.nome}
                </strong>

                <p>
                    R$ ${Number(produto.preco).toFixed(2)}
                </p>

                <div class="quantidade">

                    <button
                        onclick="diminuirQuantidade(${produto.id})">

                        −

                    </button>

                    <span>
                        ${produto.quantidade}
                    </span>

                    <button
                        onclick="aumentarQuantidade(${produto.id})">

                        +

                    </button>

                </div>

                <p>
                    Subtotal:
                    R$ ${subtotal.toFixed(2)}
                </p>

            </div>
        `;
    });


    // ==================================================
    // ENTREGA E TOTAL
    // ==================================================

    html += `

        <hr>

        <p>
            <strong>Entrega:</strong>

            ${
                tipoEntrega === "retirada"
                    ? "Retirada grátis no local"
                    : "Informe seu CEP e calcule o frete"
            }
        </p>

        <p>
            <strong>Frete estimado:</strong>
            R$ ${frete.toFixed(2)}
        </p>

        <p class="aviso-frete">
            Valor estimado. O valor final será confirmado
            no momento da postagem.
        </p>

        <h3>
            Total:
            R$ ${(total + frete).toFixed(2)}
        </h3>

        <button
            class="btn-finalizar-whatsapp"
            onclick="finalizarCompraWhatsApp()">

            FINALIZAR COMPRA PELO WHATSAPP

        </button>
    `;


    areaCarrinho.innerHTML = html;
}


// ======================================================
// FINALIZAR COMPRA PELO WHATSAPP
// ======================================================

function finalizarCompraWhatsApp() {

    let mensagem =
        "Olá! Gostaria de fazer esta compra:\n\n";

    let total = 0;


    carrinho.forEach(produto => {

        const subtotal =
            Number(produto.preco) * produto.quantidade;

        total += subtotal;

        mensagem +=
            `${produto.nome} - ` +
            `${produto.quantidade} unidade(s) - ` +
            `R$ ${subtotal.toFixed(2)}\n`;
    });


    mensagem +=
        `\nEntrega: ${
            tipoEntrega === "retirada"
                ? "Retirada grátis no local"
                : "Entrega pelo Correio"
        }`;


    mensagem +=
        `\nFrete estimado: R$ ${frete.toFixed(2)}`;


    mensagem +=
        `\nTotal: R$ ${(total + frete).toFixed(2)}`;


    const url =
        "https://wa.me/5511982747585?text=" +
        encodeURIComponent(mensagem);


    window.open(url, "_blank");
}


// ======================================================
// RETIRADA GRÁTIS
// ======================================================

function retiradaGratis() {

    frete = 0;

    tipoEntrega = "retirada";

    atualizarCarrinho();
}


// ======================================================
// CALCULAR FRETE ESTIMADO
// ======================================================

function calcularFrete() {

    const campoCEP =
        document.getElementById("cepDestino");

    if (!campoCEP) {
        return;
    }


    const cepNumeros =
        campoCEP.value.replace(/\D/g, "");


    // Verifica CEP
    if (cepNumeros.length !== 8) {

        alert("Digite um CEP válido.");

        return;
    }


    tipoEntrega = "frete";


    // ==================================================
    // CALCULA O PESO TOTAL
    // ==================================================

    let pesoTotal = 0;


    carrinho.forEach(produto => {

        /*
         * O sistema aceita:
         *
         * peso em kg
         * ou
         * peso em gramas
         *
         * Exemplo:
         * 0.500 = 500 gramas
         * 500 = 500 gramas
         */

        let peso =
            Number(produto.peso);


        // Se não houver peso cadastrado,
        // considera 1 kg para evitar frete R$ 0,00.
        if (!peso || peso <= 0) {

            peso = 1;

        }


        // Se estiver em gramas,
        // converte para kg.
        if (peso > 10) {

            peso = peso / 1000;

        }


        pesoTotal +=
            peso * produto.quantidade;
    });


    // Peso mínimo considerado
    if (pesoTotal < 0.3) {

        pesoTotal = 0.3;
    }


    // ==================================================
    // FRETE ESTIMADO
    // ==================================================

    /*
     * Estimativa PAC.
     *
     * Origem:
     * 03085-030
     *
     * Sem cobrança de mão própria.
     *
     * Os valores são ESTIMADOS e não representam
     * uma cotação oficial em tempo real dos Correios.
     */


    if (pesoTotal <= 0.3) {

        frete = 20.00;

    }

    else if (pesoTotal <= 0.6) {

        frete = 24.00;

    }

    else if (pesoTotal <= 1.0) {

        frete = 29.80;

    }

    else if (pesoTotal <= 2.0) {

        frete = 39.80;

    }

    else if (pesoTotal <= 3.0) {

        frete = 49.80;

    }

    else if (pesoTotal <= 5.0) {

        frete = 59.80;

    }

    else if (pesoTotal <= 10.0) {

        frete = 79.80;

    }

    else {

        frete = 99.80;
    }


    // Atualiza o carrinho
    atualizarCarrinho();
}


// ======================================================
// DISPONIBILIZA AS FUNÇÕES PARA O HTML
// ======================================================

window.adicionarAoCarrinho =
    adicionarAoCarrinho;

window.aumentarQuantidade =
    aumentarQuantidade;

window.diminuirQuantidade =
    diminuirQuantidade;

window.finalizarCompraWhatsApp =
    finalizarCompraWhatsApp;

window.retiradaGratis =
    retiradaGratis;

window.calcularFrete =
    calcularFrete;


// ======================================================
// INICIALIZA O CARRINHO
// ======================================================

atualizarCarrinho();


// ======================================================
// EXPORTA AS FUNÇÕES
// ======================================================

export {

    adicionarAoCarrinho,

    aumentarQuantidade,

    diminuirQuantidade,

    finalizarCompraWhatsApp,

    retiradaGratis,

    calcularFrete
};