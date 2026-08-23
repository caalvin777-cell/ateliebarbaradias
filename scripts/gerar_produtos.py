from pathlib import Path
import json
import pandas as pd

# Caminhos do projeto
BASE = Path(__file__).parent
ARQUIVO_EXCEL = BASE / "dados" / "Dados.xlsx"
ARQUIVO_SAIDA = BASE / "scripts" / "produtos.js"

print("Lendo planilha:", ARQUIVO_EXCEL)
# Lê a planilha
df = pd.read_excel(ARQUIVO_EXCEL)

print(f"Planilha carregada com {len(df)} produtos.")
print(df.columns.tolist())