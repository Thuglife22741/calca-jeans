# LP — Calça jeans masculina · como editar

Este arquivo **não vai pro ar** (está no `.assetsignore`).

A LP é um arquivo só: **`index.html`** — HTML + CSS inline. O JS está em `script.js`.
Sem build, sem framework, sem npm install. Editar e subir.

---

## Rodar local

```bash
cd lp/public
npx http-server -p 8899 -c-1
# abre http://127.0.0.1:8899
```

## Publicar

```bash
cd lp
wrangler whoami          # confirma login; se não estiver, o Fernando roda `wrangler login`
wrangler deploy
```

`wrangler login` abre OAuth no navegador e **não roda headless** — tem que ser o Fernando.
Para um preview descartável sem conta: `wrangler deploy --temporary`.

**Depois de publicar, conferir:**
```bash
curl -I https://SUA-URL.workers.dev/
curl -I https://SUA-URL.workers.dev/assets/hero.webp   # espera Cache-Control immutable
```

---

## O que ainda está com placeholder

Busque no `index.html` por `[` e por `EXEMPLO-CHECKOUT` — tudo entre colchetes é provisório.

| Marca | O que é | Onde |
|---|---|---|
| `[NOME-PROVISORIO]` | nome da marca | `<title>`, comparativo, rodapé, `script.js` |
| `[--]` | preços, medidas, parcelamento | ofertas, tabela de medidas, modal |
| `[38 ao 48]`, `[98%]`, `[2%]`, `[11oz]` | ficha técnica e grade | hero, ficha técnica |
| `EXEMPLO-CHECKOUT.com` | URL do checkout | 3 links `data-checkout` |
| `[PENDENTE: ...]` | respostas de FAQ que dependem de decisão | FAQ, tabela de medidas |
| `data-ph="..."` | placeholder de foto | hero + 5 slides |

⚠️ **Os `[PENDENTE]` do FAQ não devem ser preenchidos por inferência.** Frete, prazo e política de
troca são decisões reais — inventar uma resposta plausível é o mesmo erro de fabricar depoimento.

---

## Trocar os placeholders por fotos

O gerador/câmera entrega arquivo grande demais. A coluna da página tem 480px, então:

```bash
# hero (LCP) — 540px de largura
sharp -i original.jpg -o assets/hero.webp -q 76 resize 540 --withoutEnlargement

# slides do carrossel — 520px
sharp -i p1.jpg -o assets/p1.webp -q 76 resize 520 --withoutEnlargement

# versão -hd, só para o lightbox — 760px
sharp -i p1.jpg -o assets/p1-hd.webp -q 76 resize 760 --withoutEnlargement
```

Guarde os originais **fora** de `public/` — eles são a fonte para reprocessar, não vão pro ar.

**No HTML**, troque:
```html
<div class="ph-img" data-ph="HERO — ..."></div>
```
por:
```html
<img src="assets/hero.webp" width="540" height="675"
     loading="eager" fetchpriority="high" decoding="async"
     alt="Homem vestindo a calça jeans, corpo inteiro">
```
E descomente o `<link rel="preload">` do hero no `<head>`.

Nos slides do carrossel, o wrapper tem que ser `<button class="aslide-btn">` (é o que o lightbox
escuta) e o `-hd` é montado sozinho pelo JS — não precisa referenciar no HTML.

**`width` e `height` são obrigatórios em toda imagem** — sem eles a página pula durante o
carregamento (CLS) e o PageSpeed cai.

---

## Ligar o checkout

Os 3 botões precisam continuar sendo `<a href>` reais — **nunca** `<button>`. O Pixel marca
InitiateCheckout pela navegação de URL; um `<button>` não dispara.

```html
<a class="btn" href="URL_REAL" data-checkout="basico" data-cta="plano-1">…</a>
```

---

## Tracking

Os scripts (Pixel, UTMify, Clarity) vão no **início do `<head>`**, onde está o comentário
`═══ TRACKING ═══`. Ver a skill `fop-tracking` — o CAPI roda em Edge Function do **Supabase**,
não num Worker. O `wrangler.toml` desta LP **não pode** ganhar um `main`.

---

## Antes de cada deploy

1. `node --check script.js`
2. Zero `data-ph` restante · zero `EXEMPLO-CHECKOUT`
3. **Auditoria de contraste** — cole o script do §11.1 da skill no console. Meta: 0 falhas.
   (A última rodada: 164 elementos com texto, 0 falhas.)
4. PageSpeed mobile ≥ 90 · acessibilidade ≥ 95
