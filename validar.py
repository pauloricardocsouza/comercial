#!/usr/bin/env python3
"""
validar.py · Validação dos JSONs gerados pelo ETL GPC

Roda em <30s e checa invariantes que devem valer em qualquer execução do ETL.
Se algo falhar, indica BUG provável no ETL Python (não no front).

Uso:
    cd <pasta_dist>
    python3 validar.py
    python3 validar.py --strict   # falha o exit code se houver WARN

Saída:
    ✅ OK    : invariante respeitada
    ⚠️  WARN  : situação suspeita (pode ser dado real)
    ❌ FAIL  : invariante quebrada (provavelmente bug do ETL)

Exit codes:
    0 → tudo OK
    1 → algum FAIL
    2 → algum WARN (somente em --strict)
"""

import json
import gzip
import sys
import os
from pathlib import Path
from collections import defaultdict

# ─── Configuração ─────────────────────────────────────────────────────────

BASES_ESPERADAS = ['atp', 'cp', 'cp1', 'cp3', 'cp5', 'cp40', 'grupo']
LOJAS_GRUPO = ['ATP-V', 'ATP-A', 'CP1', 'CP3', 'CP5', 'CP40']
LOJAS_ATP = ['ATP-V', 'ATP-A']
LOJAS_CP = ['CP1', 'CP3', 'CP5', 'CP40']

TOLERANCIA_RS = 1.00      # tolerância de arredondamento em somas (R$)
TOLERANCIA_PCT = 0.01     # 0,01% pra divisões

# ─── Helpers ──────────────────────────────────────────────────────────────

def carregar(arquivo):
    """Carrega JSON, suporta .json e .json.gz."""
    if arquivo.endswith('.gz'):
        with gzip.open(arquivo, 'rt', encoding='utf-8') as f:
            return json.load(f)
    with open(arquivo, encoding='utf-8') as f:
        return json.load(f)

def existe(arquivo):
    """Retorna True se .json ou .json.gz existe."""
    return os.path.exists(arquivo) or os.path.exists(arquivo + '.gz')

def carregar_se_existe(arquivo):
    """Tenta carregar .json, depois .json.gz. None se nenhum."""
    if os.path.exists(arquivo):
        return carregar(arquivo)
    if os.path.exists(arquivo + '.gz'):
        return carregar(arquivo + '.gz')
    return None

# Acumulador de resultados
class Resultado:
    def __init__(self):
        self.oks = 0
        self.warns = []
        self.fails = []
        self.skips = []

    def ok(self, msg):
        self.oks += 1
        print(f'  ✅ OK    {msg}')

    def warn(self, msg, detalhe=''):
        self.warns.append(msg)
        if detalhe:
            print(f'  ⚠️  WARN  {msg}\n           └─ {detalhe}')
        else:
            print(f'  ⚠️  WARN  {msg}')

    def fail(self, msg, detalhe=''):
        self.fails.append(msg)
        if detalhe:
            print(f'  ❌ FAIL  {msg}\n           └─ {detalhe}')
        else:
            print(f'  ❌ FAIL  {msg}')

    def skip(self, msg):
        self.skips.append(msg)
        print(f'  ⏭️  SKIP  {msg}')

R = Resultado()

# ─── Validações ───────────────────────────────────────────────────────────

def secao(titulo):
    print(f'\n━━━━━━━━━━ {titulo} ━━━━━━━━━━')

def validar_arquivos_existem():
    """Confere se cada base tem todos os arquivos esperados."""
    secao('1 · Arquivos esperados')
    tipos = ['vendas', 'compras', 'estoque', 'financeiro', 'recebimentos', 'verbas', 'devolucoes']
    for base in BASES_ESPERADAS:
        for tipo in tipos:
            arq = f'{tipo}_{base}.json'
            if existe(arq):
                R.ok(f'{arq}')
            else:
                R.warn(f'{arq} ausente', 'pode ser intencional (ex: cubo só para atp/cp)')

    # Filiais.json é obrigatório
    if existe('filiais.json'):
        R.ok('filiais.json')
    else:
        R.fail('filiais.json ausente', 'arquivo obrigatório para o front identificar bases')

    # Manifest.json é importante (otimiza fetch)
    if existe('manifest.json'):
        R.ok('manifest.json')
    else:
        R.warn('manifest.json ausente', 'sem ele, front faz fetches especulativos')


def validar_consistencia_vendas():
    """Soma das filhas == pai (ATP+CP=grupo, ATPv+ATPa=ATP, CP1+CP3+CP5+CP40=CP)."""
    secao('2 · Consistência de soma · Vendas')
    grupo = carregar_se_existe('vendas_grupo.json')
    atp = carregar_se_existe('vendas_atp.json')
    cp = carregar_se_existe('vendas_cp.json')

    if not grupo:
        R.skip('vendas_grupo.json não encontrado')
        return

    soma_grupo_mensal = sum(m.get('fat_liq', 0) for m in grupo.get('mensal', []))

    # ATP-V + ATP-A == vendas_atp
    if atp:
        soma_atp = sum(m.get('fat_liq', 0) for m in atp.get('mensal', []))
        soma_atp_no_grupo = sum(m.get('fat_liq', 0) for m in grupo.get('mensal', [])
                                if m.get('loja') in LOJAS_ATP)
        diff = abs(soma_atp - soma_atp_no_grupo)
        if diff < TOLERANCIA_RS:
            R.ok(f'ATP isolado == ATP no grupo (R$ {soma_atp:,.2f})')
        else:
            R.fail('ATP isolado != ATP no grupo',
                   f'vendas_atp.json soma R$ {soma_atp:,.2f} mas no grupo R$ {soma_atp_no_grupo:,.2f} (diff R$ {diff:,.2f})')
    else:
        R.skip('vendas_atp.json não encontrado')

    # CP == soma das CP no grupo
    if cp:
        soma_cp = sum(m.get('fat_liq', 0) for m in cp.get('mensal', []))
        soma_cp_no_grupo = sum(m.get('fat_liq', 0) for m in grupo.get('mensal', [])
                              if m.get('loja') in LOJAS_CP)
        diff = abs(soma_cp - soma_cp_no_grupo)
        if diff < TOLERANCIA_RS:
            R.ok(f'CP isolado == CP no grupo (R$ {soma_cp:,.2f})')
        else:
            R.fail('CP isolado != CP no grupo',
                   f'vendas_cp.json soma R$ {soma_cp:,.2f} mas no grupo R$ {soma_cp_no_grupo:,.2f} (diff R$ {diff:,.2f})')
    else:
        R.skip('vendas_cp.json não encontrado')

    # Cada CP individual existe no consolidado CP?
    if cp:
        for loja in LOJAS_CP:
            arq_loja = f'vendas_{loja.lower()}.json'
            jl = carregar_se_existe(arq_loja)
            if not jl: continue
            soma_loja = sum(m.get('fat_liq', 0) for m in jl.get('mensal', []))
            soma_no_cp = sum(m.get('fat_liq', 0) for m in cp.get('mensal', []) if m.get('loja') == loja)
            diff = abs(soma_loja - soma_no_cp)
            if diff < TOLERANCIA_RS:
                R.ok(f'{loja} isolado == {loja} no CP')
            else:
                R.fail(f'{loja} isolado != {loja} no CP',
                       f'arquivo R$ {soma_loja:,.2f} vs CP R$ {soma_no_cp:,.2f}')


def validar_consistencia_resumo_mensal():
    """resumo.total deve bater com sum(mensal) — bug histórico do compras_grupo."""
    secao('3 · Consistência resumo vs mensal')

    casos = [
        ('vendas_grupo', 'fat_liq', lambda d: d.get('resumo',{}).get('grupo',{}).get('total',{}).get('fat_liq',0), 'mensal'),
        ('compras_grupo', 'valor',  lambda d: d.get('resumo',{}).get('grupo',{}).get('total',{}).get('valor',0),   'mensal'),
        ('compras_atp',   'valor',  lambda d: d.get('resumo',{}).get('grupo',{}).get('total',{}).get('valor',0),   'mensal'),
        ('compras_cp',    'valor',  lambda d: d.get('resumo',{}).get('grupo',{}).get('total',{}).get('valor',0),   'mensal'),
    ]

    for nome, campo, get_resumo, lista_campo in casos:
        d = carregar_se_existe(nome + '.json')
        if not d:
            R.skip(f'{nome}.json não encontrado')
            continue

        soma_mensal = sum(m.get(campo, 0) for m in d.get(lista_campo, []))
        valor_resumo = get_resumo(d)

        if valor_resumo == 0 and soma_mensal > 0:
            R.fail(f'{nome}: resumo.total = 0 mas mensal soma R$ {soma_mensal:,.2f}',
                   'bug do ETL — resumo não foi gerado corretamente')
            continue

        diff = abs(soma_mensal - valor_resumo)
        diff_pct = (diff / valor_resumo * 100) if valor_resumo > 0 else 0

        if diff < TOLERANCIA_RS * 10:  # 10× pra agregados
            R.ok(f'{nome}: resumo == sum(mensal) (R$ {valor_resumo:,.2f})')
        elif diff_pct < 0.5:  # menos de 0,5% de diferença é tolerável
            R.warn(f'{nome}: resumo levemente diferente de sum(mensal)',
                   f'resumo R$ {valor_resumo:,.2f} vs mensal R$ {soma_mensal:,.2f} (diff {diff_pct:.2f}%)')
        else:
            R.fail(f'{nome}: resumo divergente de sum(mensal)',
                   f'resumo R$ {valor_resumo:,.2f} vs mensal R$ {soma_mensal:,.2f} (diff {diff_pct:.1f}%)')


def validar_estoque():
    """Estoque: vl_venda_total > 0 quando há produtos com preço, vl_custo > 0, etc."""
    secao('4 · Estoque · invariantes')

    for base in BASES_ESPERADAS:
        d = carregar_se_existe(f'estoque_{base}.json')
        if not d:
            R.skip(f'estoque_{base}.json')
            continue

        resumo = d.get('resumo', {})
        produtos = d.get('produtos', [])
        n_prod = len(produtos)

        if n_prod == 0:
            R.warn(f'estoque_{base}: zero produtos no JSON')
            continue

        # vl_custo_total deve ser > 0 se há produtos com estoque
        vl_custo = resumo.get('vl_custo_total', 0)
        if vl_custo <= 0:
            R.fail(f'estoque_{base}: vl_custo_total = 0 com {n_prod} produtos',
                   'bug do ETL — agregado custo não foi calculado')
        else:
            R.ok(f'estoque_{base}: vl_custo_total R$ {vl_custo:,.2f} ({n_prod} SKUs)')

        # vl_venda_total deve ser > vl_custo_total (markup positivo) se houver preço cadastrado
        vl_venda = resumo.get('vl_venda_total', 0)
        prods_com_preco = [p for p in produtos if (p.get('estoque') or {}).get('preco', 0) > 0]
        if prods_com_preco and vl_venda <= 0:
            R.fail(f'estoque_{base}: vl_venda_total = 0 com {len(prods_com_preco)} produtos com preço',
                   'bug do ETL — agregado venda não foi calculado (mesmo padrão do estoque_grupo)')
        elif vl_venda > 0 and vl_venda <= vl_custo:
            R.warn(f'estoque_{base}: vl_venda_total <= vl_custo_total',
                   f'venda R$ {vl_venda:,.2f} vs custo R$ {vl_custo:,.2f} (margem negativa global?)')

        # markup_pct deveria ser não-nulo se vl_venda > 0
        markup = resumo.get('markup_pct')
        if vl_venda > 0 and markup is None:
            R.warn(f'estoque_{base}: markup_pct = null mas vl_venda_total > 0',
                   'ETL não calculou o markup (não-crítico, front tem fallback)')

        # por_status deve somar SKUs == skus_total
        por_status = resumo.get('por_status', {})
        if por_status:
            soma_skus = sum(s.get('skus', 0) for s in por_status.values())
            total_skus = resumo.get('skus_total', 0)
            if soma_skus != total_skus:
                R.fail(f'estoque_{base}: por_status.skus.sum != skus_total',
                       f'por_status soma {soma_skus} mas total é {total_skus}')


def validar_periodos_uniformes():
    """Cada loja deve ter o mesmo número de meses (16 = jan/2025 a abr/2026)."""
    secao('5 · Períodos uniformes')

    grupo = carregar_se_existe('vendas_grupo.json')
    if not grupo:
        R.skip('vendas_grupo.json')
        return

    por_loja = defaultdict(set)
    for m in grupo.get('mensal', []):
        por_loja[m['loja']].add(m['ym'])

    if not por_loja:
        R.warn('mensal vazio em vendas_grupo')
        return

    n_meses_padrao = max(len(v) for v in por_loja.values())
    todas_yms = set()
    for v in por_loja.values():
        todas_yms.update(v)
    yms_ordenados = sorted(todas_yms)

    for loja, yms in sorted(por_loja.items()):
        if len(yms) == n_meses_padrao:
            R.ok(f'{loja}: {len(yms)} meses ({min(yms)} a {max(yms)})')
        else:
            faltam = sorted(set(yms_ordenados) - yms)
            R.warn(f'{loja}: {len(yms)} meses (esperado {n_meses_padrao})',
                   f'faltam: {faltam[:5]}{"..." if len(faltam)>5 else ""}')


def validar_2024_removido():
    """Não deve haver dados de 2024 (decisão do projeto)."""
    secao('6 · 2024 não deve estar nos dados')

    casos = [('vendas_grupo','mensal','ym'), ('vendas_atp','mensal','ym'), ('vendas_cp','mensal','ym'),
             ('compras_grupo','mensal','ym')]
    for nome, lista_k, ym_k in casos:
        d = carregar_se_existe(nome + '.json')
        if not d: continue
        com_2024 = [m for m in d.get(lista_k,[]) if m.get(ym_k,'').startswith('2024')]
        if com_2024:
            R.fail(f'{nome}: {len(com_2024)} linhas de 2024 ainda presentes',
                   'ETL deve filtrar >= 2025-01')
        else:
            R.ok(f'{nome}: sem dados de 2024')


def validar_metas():
    """metas.json deve ter estrutura esperada."""
    secao('7 · Metas')
    m = carregar_se_existe('metas.json')
    if not m:
        R.warn('metas.json não encontrado', 'arquivo opcional, criado quando admin define metas')
        return

    if 'config' not in m:
        R.fail('metas.json sem chave "config"')
    if 'metas' not in m:
        R.fail('metas.json sem chave "metas"')
    else:
        for filial, mapa_ym in m['metas'].items():
            if filial.lower() not in ['atp','cp','cp1','cp3','cp5','cp40','atp-v','atp-a']:
                R.warn(f'metas.json: filial desconhecida "{filial}"')
            for ym, valor in mapa_ym.items():
                if not (len(ym)==7 and ym[4]=='-'):
                    R.warn(f'metas.json: ym fora de formato YYYY-MM ("{ym}")')
                if not isinstance(valor, (int, float)):
                    R.fail(f'metas.json: valor não numérico em {filial}/{ym}')


def validar_filiais():
    """filiais.json deve listar bases conhecidas e hierarquia consistente."""
    secao('8 · filiais.json')
    f = carregar_se_existe('filiais.json')
    if not f:
        R.fail('filiais.json não encontrado')
        return

    bases = set(b['sigla'] for b in f.get('bases', []))
    esperadas = {'grupo', 'atp', 'cp'}
    falta = esperadas - bases
    if falta:
        R.fail(f'filiais.json: bases faltando: {falta}')
    else:
        R.ok(f'filiais.json: bases ok ({sorted(bases)})')

    # hierarquia: grupo deve ter filhos atp e cp
    raiz = next((h for h in f.get('hierarquia', []) if h.get('sigla') == 'grupo'), None)
    if not raiz:
        R.fail('filiais.json: nó raiz "grupo" não encontrado em hierarquia')
    elif set(raiz.get('filhos', [])) != {'atp', 'cp'}:
        R.warn(f'filiais.json: filhos do grupo são {raiz.get("filhos")} (esperado atp+cp)')
    else:
        R.ok('filiais.json: hierarquia ok (grupo → atp + cp)')


def validar_recebimentos_clientes():
    """Recebimentos: clientes em atraso devem ter pelo menos uma faixa de aging."""
    secao('9 · Recebimentos · sanidade')

    for base in BASES_ESPERADAS:
        d = carregar_se_existe(f'recebimentos_{base}.json')
        if not d: continue
        clientes = d.get('por_cliente_top', [])
        sem_faixas = [c for c in clientes if not c.get('faixas')]
        if sem_faixas:
            R.warn(f'recebimentos_{base}: {len(sem_faixas)} clientes sem distribuição de aging')

        # Pendência conhecida: nome do cliente não está no JSON
        if clientes and 'nome' not in clientes[0]:
            R.warn(f'recebimentos_{base}: clientes sem campo "nome" (PCCLIENT não cruzou)',
                   'pendência conhecida — front mostra "—"')

        # Top 1 deve ter o maior valor (sanity check de ordenação)
        if len(clientes) >= 2 and clientes[0].get('valor', 0) < clientes[1].get('valor', 0):
            R.fail(f'recebimentos_{base}: por_cliente_top fora de ordem',
                   f'top[0] R$ {clientes[0].get("valor",0):,.2f} < top[1] R$ {clientes[1].get("valor",0):,.2f}')


def validar_cubo_olap():
    """Cubo deve ter formato esperado (uniforme)."""
    secao('10 · Cubo OLAP · formato')

    for base in ['atp', 'cp']:
        d = carregar_se_existe(f'cubo_{base}.json')
        if not d:
            R.skip(f'cubo_{base}.json')
            continue

        keys = set(d.keys())
        formato_novo = {'meta', 'dimensoes', 'fatos'} <= keys
        formato_antigo = {'meta', 'dim', 'fato_vendas'} <= keys

        if formato_novo:
            R.ok(f'cubo_{base}: formato novo (dimensoes/fatos)')
            fv = d.get('fatos', {}).get('vendas', {})
            if not fv.get('linhas'):
                R.warn(f'cubo_{base}: fatos.vendas.linhas vazio')
        elif formato_antigo:
            R.warn(f'cubo_{base}: formato antigo (dim/fato_vendas)',
                   'front normaliza em runtime, mas regenerar no formato novo é melhor')
        else:
            R.fail(f'cubo_{base}: formato desconhecido',
                   f'top keys: {sorted(keys)}')


# ─── Execução ─────────────────────────────────────────────────────────────

def main():
    strict = '--strict' in sys.argv
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print('  Validação de JSONs do ETL · GPC Comercial')
    print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    print(f'  pasta: {os.getcwd()}')
    print(f'  strict mode: {strict}')

    validar_arquivos_existem()
    validar_consistencia_vendas()
    validar_consistencia_resumo_mensal()
    validar_estoque()
    validar_periodos_uniformes()
    validar_2024_removido()
    validar_metas()
    validar_filiais()
    validar_recebimentos_clientes()
    validar_cubo_olap()

    print()
    print('━━━━━━━━━━━━ RESUMO ━━━━━━━━━━━━')
    print(f'  ✅ OK    : {R.oks}')
    print(f'  ⚠️  WARN  : {len(R.warns)}')
    print(f'  ❌ FAIL  : {len(R.fails)}')
    print(f'  ⏭️  SKIP  : {len(R.skips)}')

    if R.fails:
        print()
        print('FAILS encontrados:')
        for m in R.fails:
            print(f'  • {m}')

    if R.fails:
        sys.exit(1)
    if strict and R.warns:
        sys.exit(2)
    sys.exit(0)


if __name__ == '__main__':
    main()
