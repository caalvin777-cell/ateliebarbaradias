from openpyxl import load_workbook
from pathlib import Path
import pandas as pd
import json

BASE = Path(__file__).parent

ARQUIVO_XLSX = BASE.parent / "dados" / "Dados.xlsx"
ARQUIVO_JS = BASE.parent / "scripts" / "produtos.js"

df = pd.read_excel(ARQUIVO_XLSX)
df.columns = df.columns.str.strip()

produtos = []

for _, linha in df.iterrows():

    # Pula apenas se a linha estiver totalmente vazia
    if pd.isna(linha.iloc[0]):
        continue

    # Pega o ID de forma segura convertendo para int ou ignorando se não for número
    try:
        produto_id = int(linha["ID"])
    except (ValueError, TypeError):
        continue

    preco = linha["Preço (R$)"]
    if pd.isna(preco):
        preco = 0

    pasta = str(linha["Pasta"]).strip()

    # Descobre automaticamente se a primeira foto é .jpg ou .jpeg
    extensao = "jpg"
    if (BASE.parent / "imagens" / pasta / f"{pasta}1.jpeg").exists():
        extensao = "jpeg"

    produto = {
        "id": produto_id,
        "nome": str(linha["Nome do Produto"]).strip(),
        "categoria": str(linha["Categoria"]).strip(),
        "pasta": pasta,
        "imagem": f"imagens/{pasta}/{pasta}1.{extensao}",
        "preco": float(preco),
        "estoque": int(linha["Estoque"]),
        "prazo": int(linha["Prazo"]),
        "destaque": str(linha["Destaque (SIM/NÃO)"]).strip().upper(),
        "descricao": str(linha["Descrição"]).strip()
    }

    produtos.append(produto)

saida = "export const produtos = "
saida += json.dumps(produtos, ensure_ascii=False, indent=4)
saida += ";"

with open(ARQUIVO_JS, "w", encoding="utf-8") as f:
    f.write(saida)

print(f"{len(produtos)} produtos exportados com sucesso.")
print(f"Arquivo criado: {ARQUIVO_JS}")
print("\n===================================")
print("Atualização concluída com sucesso!")
print("===================================")