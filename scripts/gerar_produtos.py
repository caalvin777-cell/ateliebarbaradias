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

    produto = {
        "id": produto_id,
        "nome": str(linha["Nome do Produto"]).strip(),
        "categoria": str(linha["Categoria"]).strip(),
        "pasta": pasta,
        "imagem": f"imagens/{pasta}/{pasta}1.jpg",
        "preco": float(preco),
        "estoque": int(linha["Estoque"]),
        "prazo": int(linha["Prazo"]),
        "destaque": str(linha["Destaque (SIM/NÃO)"]).strip().upper(),
        "descricao": str(linha["Descrição"]).strip()
    }

produtos.append(produto)  # <-- Com recuo (alinhado com as linhas de cima)