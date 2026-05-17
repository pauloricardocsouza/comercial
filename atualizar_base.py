#!/usr/bin/env python3
"""
atualizar_base.py · Atualizador semi-automático de uma base do GPC

Uso:
    python3 atualizar_base.py <base> <pasta_com_arquivos_novos>

Exemplo:
    python3 atualizar_base.py atp ~/Downloads/atp-novo
    python3 atualizar_base.py cp  ~/Downloads/cp-novo

O que faz:
    1. Backup dos arquivos atuais da base em backup/<timestamp>/
    2. Copia os arquivos novos pra raiz (substitui)
    3. Roda validar.py
    4. Regenera manifest.json com novo gerado_em (invalida caches IDB+SW)
    5. Devolve um diff de tamanho (antes vs depois) pra sanity check

Não toca:
    - Outras bases (só mexe nos arquivos *_<base>.json[.gz])
    - filiais.json, dias_cp_seed.json, código JS/HTML
    - Commits git (faça à mão pra revisar)
"""

import sys
import os
import shutil
import json
import gzip
import subprocess
from pathlib import Path
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────

BASES_VALIDAS = ['atp', 'cp', 'cp1', 'cp3', 'cp5', 'cp40', 'grupo']
TIPOS_ARQUIVO = ['vendas', 'compras', 'estoque', 'financeiro',
                 'devolucoes', 'recebimentos', 'verbas', 'cubo']
EXTENSOES = ['.json', '.json.gz']

ROOT = Path(__file__).parent.resolve()

# ─── Helpers ──────────────────────────────────────────────────────────────

def humanize(n):
    """Bytes → '1.2 MB' / '500 KB'."""
    for unit in ['B','KB','MB','GB']:
        if abs(n) < 1024.0:
            return f"{n:3.1f} {unit}"
        n /= 1024.0
    return f"{n:.1f} TB"

def arquivos_da_base(base):
    """Lista arquivos *_<base>.json[.gz] presentes na raiz."""
    out = []
    for tipo in TIPOS_ARQUIVO:
        for ext in EXTENSOES:
            p = ROOT / f"{tipo}_{base}{ext}"
            if p.exists():
                out.append(p)
    return out

def carregar_json(p):
    if str(p).endswith('.gz'):
        with gzip.open(p, 'rt', encoding='utf-8') as f:
            return json.load(f)
    with open(p, encoding='utf-8') as f:
        return json.load(f)

# ─── Etapas ───────────────────────────────────────────────────────────────

def fazer_backup(base, ts):
    bkdir = ROOT / 'backup' / ts
    bkdir.mkdir(parents=True, exist_ok=True)
    atuais = arquivos_da_base(base)
    if not atuais:
        print(f"  (nenhum arquivo *_{base}* atual pra fazer backup)")
        return bkdir, []
    print(f"  backup → backup/{ts}/")
    feitos = []
    for p in atuais:
        dst = bkdir / p.name
        shutil.copy2(p, dst)
        feitos.append((p.name, p.stat().st_size))
        print(f"    {p.name}  ({humanize(p.stat().st_size)})")
    return bkdir, feitos

def copiar_novos(base, pasta_origem):
    pasta = Path(pasta_origem).expanduser().resolve()
    if not pasta.is_dir():
        print(f"❌ pasta '{pasta}' não existe ou não é diretório")
        return None
    candidatos = []
    for tipo in TIPOS_ARQUIVO:
        for ext in EXTENSOES:
            nome = f"{tipo}_{base}{ext}"
            src = pasta / nome
            if src.exists():
                candidatos.append(src)
    if not candidatos:
        print(f"❌ nenhum arquivo *_{base}.json[.gz] encontrado em {pasta}")
        return None
    print(f"  copiando {len(candidatos)} arquivo(s) pra raiz:")
    novos = []
    for src in candidatos:
        dst = ROOT / src.name
        # Apaga .json se vier .json.gz e vice-versa (pra não ficar duplicado conflitante)
        for ext in EXTENSOES:
            outro = ROOT / (src.name.rsplit('.json', 1)[0] + ext)
            if outro.exists() and outro.name != src.name:
                print(f"    🗑  removendo conflitante: {outro.name}")
                outro.unlink()
        shutil.copy2(src, dst)
        novos.append((src.name, dst.stat().st_size))
        print(f"    {src.name}  ({humanize(dst.stat().st_size)})")
    return novos

def regenerar_manifest():
    """Reconstrói manifest.json a partir dos arquivos presentes na raiz."""
    arquivos = {}
    for tipo in TIPOS_ARQUIVO + ['filiais']:
        for ext in EXTENSOES:
            for p in ROOT.glob(f"{tipo}_*{ext}" if tipo != 'filiais' else 'filiais.json'):
                nome = p.name
                # Chave canônica é sempre .json (sem .gz)
                chave = nome.replace('.gz', '')
                if chave not in arquivos:
                    arquivos[chave] = {}
                if nome.endswith('.gz'):
                    arquivos[chave]['gz'] = True
                else:
                    arquivos[chave]['json'] = True
    # filiais.json sempre presente
    if (ROOT / 'filiais.json').exists():
        arquivos.setdefault('filiais.json', {})['json'] = True

    manifest = {
        'gerado_em': datetime.now().strftime('%Y-%m-%dT%H:%M:%S'),
        'arquivos': dict(sorted(arquivos.items())),
        'tem_consolidado': any(k.endswith('_grupo.json') for k in arquivos),
    }
    with open(ROOT / 'manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"  manifest.json regenerado · {len(arquivos)} arquivos · gerado_em={manifest['gerado_em']}")
    return manifest

def rodar_validar():
    val = ROOT / 'validar.py'
    if not val.exists():
        print("  ⚠ validar.py não encontrado — pulando validação")
        return 0
    print("  rodando validar.py …")
    rc = subprocess.call([sys.executable, str(val)], cwd=str(ROOT))
    print(f"  validar.py → exit code {rc}")
    return rc

def diff_tamanhos(antigos, novos):
    """Compara tamanho antigo vs novo arquivo a arquivo."""
    map_ant = dict(antigos)
    print("\n📊 Diff de tamanho:")
    for nome, sz_novo in novos:
        sz_ant = map_ant.get(nome, 0)
        delta = sz_novo - sz_ant
        sinal = '+' if delta >= 0 else ''
        pct = (delta / sz_ant * 100) if sz_ant else 0
        print(f"    {nome:35s}  {humanize(sz_ant):>10s} → {humanize(sz_novo):>10s}  ({sinal}{humanize(delta):>10s}, {sinal}{pct:5.1f}%)")

# ─── Main ─────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    base = sys.argv[1].lower().strip()
    pasta = sys.argv[2]
    if base not in BASES_VALIDAS:
        print(f"❌ base '{base}' inválida. Use uma de: {', '.join(BASES_VALIDAS)}")
        return 1

    print(f"\n🔄 Atualizando base '{base}' a partir de '{pasta}'\n")

    ts = datetime.now().strftime('%Y-%m-%dT%H-%M-%S')

    print("1️⃣  Backup dos arquivos atuais")
    _, antigos = fazer_backup(base, ts)

    print("\n2️⃣  Copiando arquivos novos")
    novos = copiar_novos(base, pasta)
    if novos is None:
        print("\n❌ Abortado.")
        return 1

    print("\n3️⃣  Validando")
    rc = rodar_validar()

    print("\n4️⃣  Regenerando manifest.json")
    regenerar_manifest()

    diff_tamanhos(antigos, novos)

    print(f"\n✅ Base '{base}' atualizada.")
    print(f"   Backup em: backup/{ts}/")
    print(f"   Próximos passos:")
    print(f"     - Hard refresh no navegador (Ctrl+Shift+R)")
    print(f"     - Smoke test: Visão Executiva, Estoque, Fornecedores, Inadimplência")
    print(f"     - git add -A && git commit -m 'data: refresh {base} <YYYY-MM-DD>' && git push")
    if rc != 0:
        print(f"\n⚠ validar.py terminou com exit code {rc} — revise os warnings antes do commit.")
    return rc

if __name__ == '__main__':
    sys.exit(main())
