import pandas as pd
import json

from pathlib import Path

ARQUIVO = Path(__file__).parent.parent / "dados" / "Dados.xlsx"
print(ARQUIVO)

df = pd.read_excel(ARQUIVO)
print(df.columns.tolist())
df.columns = df.columns.str.strip()
print(df.columns.tolist())
produtos = []

for _, linha in df.iterrows():

    preco = linha["Preço (R$)"]
    if pd.isna(preco):
        preco = 0

    produto = {
        "id": int(linha["ID"]),
        "nome": str(linha["Nome do Produto"]).strip(),
        "categoria": str(linha["Categoria"]).strip(),
        "pasta": str(linha["Pasta"]).strip(),
        "preco": float(preco),
        "estoque": int(linha["Estoque"]),
        "prazo": int(linha["Prazo"]),
        "destaque": str(linha["Destaque (SIM/NÃO)"]).strip().upper(),
        "descricao": str(linha["Descrição"]).strip()
    }

    produtos.append(produto)

saida = "const produtos = "
saida += json.dumps(produtos, ensure_ascii=False, indent=4)
saida += ";"

with open("scripts/produtos.js", "w", encoding="utf-8") as f:
    f.write(saida)

print("Arquivo produtos.js gerado com sucesso!")