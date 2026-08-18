const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const produto = produtos.find(p => p.id === id);

if (!produto) {
    document.getElementById("produto").innerHTML =
        "<h2>Produto não encontrado.</h2>";
} else {

    // Foto principal 
    let fotoPrincipal = `../imagens/${produto.pasta}/${produto.pasta}1.jpg`;

    // Miniaturas
    let miniaturas = "";

    // Loop que tenta carregar até 20 fotos
    for (let i = 1; i <= 20; i++) {
        miniaturas += `
            <img
                class="miniatura ${i==1 ? 'ativa' : ''}"
                src="../imagens/${produto.pasta}/${produto.pasta}${i}.jpg"
                width="80"
                style="margin:5px;cursor:pointer;border-radius:8px"
                onclick="trocarFoto(this)"
                onerror="
                    if(this.src.includes('.jpg')){
                        this.src='../imagens/${produto.pasta}/${produto.pasta}${i}.jpeg';
                    }else if(this.src.includes('.jpeg')){
                        this.src='../imagens/${produto.pasta}/${produto.pasta}${i}.png';
                    }else{
                        this.style.display='none';
                    }
                "
            >
        `;
    }

    // Inserindo na tela (O erro do "<img <img" foi corrigido abaixo e a lógica de onerror melhorada)
    document.getElementById("produto").innerHTML = `
        <div style="text-align:center">

            <h1>${produto.nome}</h1>

            <img
                id="foto-principal"
                class="foto-grande"
                src="${fotoPrincipal}"
                width="420"
                style="border-radius:12px"
                onclick="abrirZoom()"
                onerror="
                    if(this.src.includes('.jpg')){
                        this.src='../imagens/${produto.pasta}/${produto.pasta}1.jpeg';
                    }else if(this.src.includes('.jpeg')){
                        this.src='../imagens/${produto.pasta}/${produto.pasta}1.png';
                    }else{
                        this.src='../imagens/logo.png';
                    }
                "
            >

            <br><br>

            <div class="galeria-miniaturas">
                ${miniaturas}
            </div>
            
            <div id="zoom-overlay" onclick="fecharZoom()">
                <img id="zoom-img">
            </div>

            <h2>
                R$ ${produto.preco.toFixed(2).replace(".", ",")}
            </h2>

            <p>${produto.descricao}</p>

            <p><strong>Estoque:</strong> ${produto.estoque}</p>

            <p><strong>Prazo:</strong> ${produto.prazo} dias</p>

            <a class="botao"
               href="https://wa.me/5511982747585?text=${encodeURIComponent("Olá, gostaria de comprar " + produto.nome)}"
               target="_blank">
               Comprar pelo WhatsApp
            </a>

        </div>
    `;
}

function trocarFoto(img) {
    document.getElementById("foto-principal").src = img.src;

    document.querySelectorAll(".miniatura").forEach(foto => {
        foto.classList.remove("ativa");
    });

    img.classList.add("ativa");
}

function abrirZoom() {
    const overlay = document.getElementById("zoom-overlay");
    const img = document.getElementById("zoom-img");
    const principal = document.getElementById("foto-principal");

    img.src = principal.src;
    overlay.style.display = "flex";
}

function fecharZoom() {
    document.getElementById("zoom-overlay").style.display = "none";
}