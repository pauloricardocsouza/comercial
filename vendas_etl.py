# -*- coding: utf-8 -*-
"""
vendas_etl.py · R2 Soluções · Comercial GPC

Lê todos os CSVs de uma pasta de entrada (formato WinThor de vendas) e gera
o arquivo vendas.json consumido pelo dashboard em comercial.solucoesr2.com.br

Uso:
    python vendas_etl.py [pasta_input] [pasta_output]
    
    Padrão:
        pasta_input  = ./vendas_input
        pasta_output = ./
        saída        = ./vendas.json

Estrutura esperada dos CSVs (33 colunas):
    COD_FILIAL;DT_FATURAMENTO;COD_SUPERVISOR;DESC_SUPERVISOR;COD_RCA;RCA;
    TIPO_TRANSACAO;COD_PRODUTO;DESC_PRODUTO;EMBALAGEM;
    QT_CLIENTES_POSIT;QT_NFS;QT_CLIENTES_SUPERVISOR;QT_NFS_SUPERVISOR;
    VL_VENDA_FATURADA;QT_VENDA;VL_DEVOLUCAO;QT_DEVOLUCAO;
    VL_CMV;VL_CMV_DEVOLUCAO;VL_VENDA_LIQUIDA;VL_LUCRO;PERC_LUCRO;PRECO_MEDIO;
    COD_DEPARTAMENTO;DESC_DEPARTAMENTO;COD_SECAO;DESC_SECAO;
    COD_CATEGORIA;DESC_CATEGORIA;DT_CADASTRO_ITEM;COD_FORNECEDOR;DESC_FORNECEDOR

Encoding: ISO-8859-1 (latin-1)  ·  Separator: ;  ·  Decimal: vírgula
"""

import sys
import json
from pathlib import Path
from datetime import datetime
import pandas as pd
import numpy as np


# ============================================================
# MAPEAMENTOS DE NEGÓCIO
# ============================================================
# (COD_FILIAL, COD_SUPERVISOR) -> sigla da loja
# A regra é (filial, supervisor) porque a ATP física tem 2 "lojas" no sistema:
# Varejo e Atacado Balcão, distinguidas pelo supervisor.
LOJA_MAP = {
    (1, 1): 'ATP-V',     # ATP Varejo
    (1, 4): 'ATP-A',     # ATP Atacado Balcão
    (1, 3): 'INTRA',     # Intragrupo (não alimenta painéis, fica em seção própria)
    # Cestão Loja 1 e Inhambupe serão mapeados quando os arquivos chegarem.
    # Provavelmente: (2, *): 'CSTL1' e (3, *): 'INH', ou outra filial.
}

LOJA_NOME = {
    'ATP-V': 'ATP Varejo',
    'ATP-A': 'ATP Atacado',
    'CSTL1': 'Cestão Loja 1',
    'INH':   'Inhambupe',
    'INTRA': 'Intragrupo (interno)',
}

# Lojas que aparecem nos painéis de venda
LOJAS_PAINEL = ('ATP-V', 'ATP-A', 'CSTL1', 'INH')


# ============================================================
# CARREGAMENTO E LIMPEZA
# ============================================================

COLS_NUMERICAS = [
    'QT_CLIENTES_POSIT', 'QT_NFS', 'QT_CLIENTES_SUPERVISOR', 'QT_NFS_SUPERVISOR',
    'VL_VENDA_FATURADA', 'QT_VENDA', 'VL_DEVOLUCAO', 'QT_DEVOLUCAO',
    'VL_CMV', 'VL_CMV_DEVOLUCAO', 'VL_VENDA_LIQUIDA', 'VL_LUCRO',
    'PERC_LUCRO', 'PRECO_MEDIO',
]

COLS_INT = ['COD_FILIAL', 'COD_SUPERVISOR', 'COD_RCA', 'COD_PRODUTO',
            'COD_DEPARTAMENTO', 'COD_SECAO', 'COD_CATEGORIA', 'COD_FORNECEDOR']


def carregar_pasta(pasta_input: Path) -> pd.DataFrame:
    """Lê todos os CSVs da pasta e retorna um DataFrame consolidado."""
    arquivos = sorted(pasta_input.glob('*.csv'))
    if not arquivos:
        raise FileNotFoundError(f'Nenhum CSV encontrado em {pasta_input}')

    print(f'\n[1/8] Carregando {len(arquivos)} CSV(s) de {pasta_input}/')
    dfs = []
    for arq in arquivos:
        tam_mb = arq.stat().st_size / 1024 / 1024
        print(f'      └─ {arq.name}  ({tam_mb:.1f} MB)')
        d = pd.read_csv(arq, sep=';', encoding='latin-1', decimal=',',
                        dtype=str, low_memory=False)
        d.columns = [c.strip() for c in d.columns]
        # Coluna fantasma vinda do CRLF da última coluna
        if '' in d.columns:
            d = d.drop(columns=[''])
        dfs.append(d)

    df = pd.concat(dfs, ignore_index=True)
    print(f'      Total: {len(df):,} linhas')
    return df


def normalizar(df: pd.DataFrame) -> pd.DataFrame:
    """Converte tipos, mapeia loja, descarta lixo."""
    print('\n[2/8] Normalizando tipos e mapeando lojas...')

    # Datas
    df['data'] = pd.to_datetime(df['DT_FATURAMENTO'], format='%d/%m/%Y', errors='coerce')
    df['ym'] = df['data'].dt.to_period('M').astype(str)        # YYYY-MM
    df['ymd'] = df['data'].dt.strftime('%Y-%m-%d')             # YYYY-MM-DD
    df['ano'] = df['data'].dt.year
    df['mes'] = df['data'].dt.month

    # Numéricos: precisam ter vírgula→ponto ANTES de to_numeric.
    # (read_csv com dtype=str ignora o parâmetro decimal=',', então a vírgula
    # passa pra cá inalterada e quebra a conversão se não tratarmos manualmente.)
    for c in COLS_NUMERICAS:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c].astype(str).str.replace(',', '.', regex=False), errors='coerce').fillna(0.0)

    for c in COLS_INT:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors='coerce').fillna(-1).astype(int)

    # Mapear loja a partir de (COD_FILIAL, COD_SUPERVISOR)
    chave = list(zip(df['COD_FILIAL'], df['COD_SUPERVISOR']))
    df['loja'] = [LOJA_MAP.get(k, 'OUTROS') for k in chave]

    # Stats
    print('      Linhas por loja:')
    for loja, cnt in df['loja'].value_counts().items():
        nome = LOJA_NOME.get(loja, loja)
        print(f'        {loja:8s} ({nome}): {cnt:>10,}')

    outros = df[df['loja'] == 'OUTROS']
    if len(outros) > 0:
        print(f'      ⚠️  {len(outros):,} linhas com (filial,supervisor) não mapeado:')
        for chv, cnt in outros.groupby(['COD_FILIAL','COD_SUPERVISOR']).size().items():
            print(f'        ({chv[0]}, {chv[1]}) → {cnt} linhas')
        print(f'         ↳ Adicione no LOJA_MAP do script')

    return df


# ============================================================
# CONSTRUTORES DE SEÇÕES DO JSON
# ============================================================

def _agg_basico(g):
    """Agregação padrão para qualquer groupby."""
    venda_liq = g['VL_VENDA_LIQUIDA'].sum()
    lucro = g['VL_LUCRO'].sum()
    return pd.Series({
        'fat_brt': float(g['VL_VENDA_FATURADA'].sum()),
        'fat_liq': float(venda_liq),
        'devol':   float(g['VL_DEVOLUCAO'].sum()),
        'cmv':     float(g['VL_CMV'].sum()),
        'lucro':   float(lucro),
        'marg':    float(lucro / venda_liq * 100) if venda_liq else 0.0,
        'qt':      float(g['QT_VENDA'].sum()),
        'qt_dev':  float(g['QT_DEVOLUCAO'].sum()),
    })


def construir_meta(df_total: pd.DataFrame, n_arquivos: int) -> dict:
    print('\n[3/8] Construindo seção meta...')
    return {
        'geradoEm': datetime.now().isoformat(timespec='seconds'),
        'fonte': 'WinThor (extração CSV)',
        'arquivos_processados': n_arquivos,
        'linhas_processadas': int(len(df_total)),
        'periodo': {
            'inicio': df_total['ymd'].min(),
            'fim':    df_total['ymd'].max(),
            'meses':  int(df_total['ym'].nunique()),
            'dias':   int(df_total['ymd'].nunique()),
        },
        'lojas': sorted([l for l in df_total['loja'].unique() if l in LOJAS_PAINEL]),
        'lojas_nomes': {l: LOJA_NOME[l] for l in LOJAS_PAINEL if l in df_total['loja'].unique()},
    }


def construir_resumo(df: pd.DataFrame) -> dict:
    """KPIs consolidados grupo + por loja, total e por ano."""
    print('[4/8] Construindo resumo (KPIs grupo + por loja)...')

    def kpis(d):
        venda_liq = float(d['VL_VENDA_LIQUIDA'].sum())
        lucro = float(d['VL_LUCRO'].sum())
        # Clientes únicos: aproximação via QT_CLIENTES_POSIT vendedor (já agregado por dia)
        # Para um valor mais preciso, somamos QT_NFS_SUPERVISOR único por (data, supervisor)
        nfs_total = (d.drop_duplicates(['ymd','COD_SUPERVISOR'])['QT_NFS_SUPERVISOR'].sum())
        cli_total = (d.drop_duplicates(['ymd','COD_SUPERVISOR'])['QT_CLIENTES_SUPERVISOR'].sum())
        return {
            'fat_brt': float(d['VL_VENDA_FATURADA'].sum()),
            'fat_liq': venda_liq,
            'devol':   float(d['VL_DEVOLUCAO'].sum()),
            'cmv':     float(d['VL_CMV'].sum()),
            'lucro':   lucro,
            'marg':    lucro / venda_liq * 100 if venda_liq else 0.0,
            'qt':      float(d['QT_VENDA'].sum()),
            'qt_dev':  float(d['QT_DEVOLUCAO'].sum()),
            'nfs':     int(nfs_total),
            'clientes_pdv': int(cli_total),
            'skus':     int(d['COD_PRODUTO'].nunique()),
            'vendedores': int(d['COD_RCA'].nunique()),
            'dias':     int(d['ymd'].nunique()),
        }

    res = {'grupo': {'total': kpis(df), 'por_ano': {}}, 'por_loja': {}}
    for ano, d_ano in df.groupby('ano'):
        res['grupo']['por_ano'][int(ano)] = kpis(d_ano)

    for loja, d_loja in df.groupby('loja'):
        bloco = {'total': kpis(d_loja), 'por_ano': {}}
        for ano, d_ano in d_loja.groupby('ano'):
            bloco['por_ano'][int(ano)] = kpis(d_ano)
        res['por_loja'][loja] = bloco

    return res


def construir_mensal(df: pd.DataFrame) -> list:
    """Série mensal por loja: alimenta v-evolucao, v-benchmarking, v-ano2026."""
    print('[5/8] Construindo série mensal por loja...')
    rows = []
    for (loja, ym), g in df.groupby(['loja', 'ym']):
        venda_liq = float(g['VL_VENDA_LIQUIDA'].sum())
        lucro = float(g['VL_LUCRO'].sum())
        # NFs e clientes: pegar valor único por (data, supervisor) e somar
        u = g.drop_duplicates(['ymd','COD_SUPERVISOR'])
        rows.append({
            'loja': loja,
            'ym':   ym,
            'fat_brt': round(float(g['VL_VENDA_FATURADA'].sum()), 2),
            'fat_liq': round(venda_liq, 2),
            'devol':   round(float(g['VL_DEVOLUCAO'].sum()), 2),
            'lucro':   round(lucro, 2),
            'marg':    round(lucro / venda_liq * 100, 2) if venda_liq else 0.0,
            'qt':      int(g['QT_VENDA'].sum()),
            'nfs':     int(u['QT_NFS_SUPERVISOR'].sum()),
            'clientes_pdv': int(u['QT_CLIENTES_SUPERVISOR'].sum()),
            'skus':    int(g['COD_PRODUTO'].nunique()),
            'vendedores_ativos': int(g['COD_RCA'].nunique()),
        })
    return sorted(rows, key=lambda x: (x['loja'], x['ym']))


def construir_diario(df: pd.DataFrame) -> list:
    """Série diária por loja: alimenta v-vendas-diarias, v-dias-cp."""
    print('[6/8] Construindo série diária por loja...')
    rows = []
    for (loja, ymd), g in df.groupby(['loja', 'ymd']):
        venda_liq = float(g['VL_VENDA_LIQUIDA'].sum())
        lucro = float(g['VL_LUCRO'].sum())
        u = g.drop_duplicates(['COD_SUPERVISOR'])
        rows.append({
            'loja': loja,
            'data': ymd,
            'fat_liq': round(venda_liq, 2),
            'lucro':   round(lucro, 2),
            'marg':    round(lucro / venda_liq * 100, 2) if venda_liq else 0.0,
            'nfs':     int(u['QT_NFS_SUPERVISOR'].sum()),
            'clientes_pdv': int(u['QT_CLIENTES_SUPERVISOR'].sum()),
            'qt':      int(g['QT_VENDA'].sum()),
        })
    return sorted(rows, key=lambda x: (x['loja'], x['data']))


def construir_vendedores(df: pd.DataFrame) -> dict:
    """Drilldown: cada vendedor com cadastro + série mensal."""
    print('[7/8] Construindo drilldown de vendedores...')
    out = {'cadastro': [], 'mensal': []}

    # Cadastro: dados estáticos (último nome visto)
    cad = df.groupby(['COD_RCA']).agg(
        nome=('RCA', 'last'),
        loja=('loja', 'last'),
        supervisor=('DESC_SUPERVISOR', 'last'),
        cod_supervisor=('COD_SUPERVISOR', 'last'),
    ).reset_index()
    for _, r in cad.iterrows():
        out['cadastro'].append({
            'cod':  int(r['COD_RCA']),
            'nome': str(r['nome']),
            'loja': str(r['loja']),
            'supervisor': str(r['supervisor']),
            'cod_supervisor': int(r['cod_supervisor']),
        })

    # Mensal: agregação por (vendedor, mês)
    for (cod, ym), g in df.groupby(['COD_RCA', 'ym']):
        venda_liq = float(g['VL_VENDA_LIQUIDA'].sum())
        lucro = float(g['VL_LUCRO'].sum())
        out['mensal'].append({
            'cod': int(cod),
            'ym':  ym,
            'fat_liq': round(venda_liq, 2),
            'lucro':   round(lucro, 2),
            'marg':    round(lucro / venda_liq * 100, 2) if venda_liq else 0.0,
            'qt':      int(g['QT_VENDA'].sum()),
            'nfs':     int(g['QT_NFS'].sum()),    # NFs do vendedor (não do supervisor)
            'clientes': int(g['QT_CLIENTES_POSIT'].sum()),
        })

    return out


def construir_dimensoes(df: pd.DataFrame) -> dict:
    """Departamentos, categorias, fornecedores e top produtos por (loja, mês)."""
    print('[8/8] Construindo dimensões (deptos, categorias, fornecedores, produtos)...')
    dims = {}

    # Departamentos × loja × mês
    rows = []
    for (loja, ym, dept_cod, dept_nome), g in df.groupby(['loja','ym','COD_DEPARTAMENTO','DESC_DEPARTAMENTO']):
        venda_liq = float(g['VL_VENDA_LIQUIDA'].sum())
        lucro = float(g['VL_LUCRO'].sum())
        rows.append({
            'loja': loja, 'ym': ym, 'cod': int(dept_cod), 'nome': str(dept_nome),
            'fat_liq': round(venda_liq, 2), 'lucro': round(lucro, 2),
            'marg': round(lucro/venda_liq*100,2) if venda_liq else 0.0,
            'qt':   int(g['QT_VENDA'].sum()),
        })
    dims['deptos'] = sorted(rows, key=lambda x: (x['loja'], x['ym'], -x['fat_liq']))

    # Top 100 categorias × loja × mês
    rows = []
    for (loja, ym), g_lm in df.groupby(['loja','ym']):
        cat = g_lm.groupby(['COD_CATEGORIA','DESC_CATEGORIA']).agg(
            fat_liq=('VL_VENDA_LIQUIDA','sum'),
            lucro=('VL_LUCRO','sum'),
            qt=('QT_VENDA','sum')
        ).reset_index().sort_values('fat_liq', ascending=False).head(100)
        for _, r in cat.iterrows():
            venda_liq = float(r['fat_liq'])
            lucro = float(r['lucro'])
            rows.append({
                'loja': loja, 'ym': ym,
                'cod':  int(r['COD_CATEGORIA']), 'nome': str(r['DESC_CATEGORIA']),
                'fat_liq': round(venda_liq,2), 'lucro': round(lucro,2),
                'marg': round(lucro/venda_liq*100,2) if venda_liq else 0.0,
                'qt': int(r['qt']),
            })
    dims['categorias_top'] = rows

    # Top 200 fornecedores × loja × mês
    rows = []
    for (loja, ym), g_lm in df.groupby(['loja','ym']):
        forn = g_lm.groupby(['COD_FORNECEDOR','DESC_FORNECEDOR']).agg(
            fat_liq=('VL_VENDA_LIQUIDA','sum'),
            lucro=('VL_LUCRO','sum'),
            qt=('QT_VENDA','sum'),
            skus=('COD_PRODUTO','nunique')
        ).reset_index().sort_values('fat_liq', ascending=False).head(200)
        for _, r in forn.iterrows():
            venda_liq = float(r['fat_liq'])
            lucro = float(r['lucro'])
            rows.append({
                'loja': loja, 'ym': ym,
                'cod':  int(r['COD_FORNECEDOR']), 'nome': str(r['DESC_FORNECEDOR']),
                'fat_liq': round(venda_liq,2), 'lucro': round(lucro,2),
                'marg': round(lucro/venda_liq*100,2) if venda_liq else 0.0,
                'qt': int(r['qt']),
                'skus': int(r['skus']),
            })
    dims['fornecedores_top'] = rows

    # Top 200 produtos × loja × mês
    rows = []
    for (loja, ym), g_lm in df.groupby(['loja','ym']):
        prod = g_lm.groupby(['COD_PRODUTO','DESC_PRODUTO']).agg(
            fat_liq=('VL_VENDA_LIQUIDA','sum'),
            lucro=('VL_LUCRO','sum'),
            qt=('QT_VENDA','sum'),
        ).reset_index().sort_values('fat_liq', ascending=False).head(200)
        for _, r in prod.iterrows():
            venda_liq = float(r['fat_liq'])
            lucro = float(r['lucro'])
            rows.append({
                'loja': loja, 'ym': ym,
                'cod':  int(r['COD_PRODUTO']), 'desc': str(r['DESC_PRODUTO']),
                'fat_liq': round(venda_liq,2), 'lucro': round(lucro,2),
                'marg': round(lucro/venda_liq*100,2) if venda_liq else 0.0,
                'qt': int(r['qt']),
            })
    dims['produtos_top'] = rows

    return dims


def construir_intragrupo(df_intra: pd.DataFrame) -> dict:
    """Intragrupo: armazenado para consulta, mas NÃO entra nos painéis principais."""
    if len(df_intra) == 0:
        return {'mensal': [], 'total': {}}

    venda_liq = float(df_intra['VL_VENDA_LIQUIDA'].sum())
    lucro = float(df_intra['VL_LUCRO'].sum())
    total = {
        'fat_liq': round(venda_liq, 2),
        'lucro':   round(lucro, 2),
        'marg':    round(lucro / venda_liq * 100, 2) if venda_liq else 0.0,
        'qt':      int(df_intra['QT_VENDA'].sum()),
        'linhas':  int(len(df_intra)),
    }
    mensal = []
    for ym, g in df_intra.groupby('ym'):
        v = float(g['VL_VENDA_LIQUIDA'].sum())
        l = float(g['VL_LUCRO'].sum())
        mensal.append({
            'ym': ym,
            'fat_liq': round(v, 2),
            'lucro':   round(l, 2),
            'marg':    round(l/v*100, 2) if v else 0.0,
            'qt':      int(g['QT_VENDA'].sum()),
        })
    return {'mensal': sorted(mensal, key=lambda x: x['ym']), 'total': total}


# ============================================================
# MAIN
# ============================================================

def main(pasta_input: Path, pasta_output: Path):
    print('='*70)
    print('VENDAS ETL · R2 Soluções · Comercial GPC')
    print('='*70)

    df = carregar_pasta(pasta_input)
    df = normalizar(df)
    n_arquivos = len(list(pasta_input.glob('*.csv')))

    df_painel = df[df['loja'].isin(LOJAS_PAINEL)].copy()
    df_intra  = df[df['loja'] == 'INTRA'].copy()

    out = {
        'meta':       construir_meta(df_painel, n_arquivos),
        'resumo':     construir_resumo(df_painel),
        'mensal':     construir_mensal(df_painel),
        'diario':     construir_diario(df_painel),
        'vendedores': construir_vendedores(df_painel),
    }
    out.update(construir_dimensoes(df_painel))
    out['intragrupo'] = construir_intragrupo(df_intra)

    arq_out = pasta_output / 'vendas.json'
    with open(arq_out, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, separators=(',',':'))

    tam_kb = arq_out.stat().st_size / 1024
    print('\n' + '='*70)
    print(f'✅  Gerado: {arq_out}')
    print(f'   Tamanho: {tam_kb:.1f} KB ({tam_kb/1024:.2f} MB)')
    print('='*70)

    # Resumo de tamanho por seção
    print('\nTAMANHO POR SEÇÃO:')
    for k, v in out.items():
        s = json.dumps(v, ensure_ascii=False, separators=(',',':'))
        print(f'  {k:20s}: {len(s)/1024:>8.1f} KB · {len(v) if isinstance(v,(list,dict)) else 1} entradas')


if __name__ == '__main__':
    pasta_in  = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('vendas_input')
    pasta_out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('.')
    main(pasta_in, pasta_out)
