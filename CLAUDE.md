# CLAUDE.md

Instruções para o Claude Code neste projeto. Mantido atualizado conforme o projeto cresce.

---

## 1. O que é o projeto

Operação de **venda de calças jeans masculinas e femininas** via **tráfego direto**.

- **Modelo:** landing page de venda (1–2 ofertas por página), mobile-first, escalada por Meta Ads.
- **Não é** um e-commerce com catálogo completo. Foco em conversão de uma oferta específica, não em navegação de loja.
- **Checkout:** externo (gateway a definir — ver Decisões Pendentes).
- **Banco:** Supabase (Postgres).

## 2. Estado atual

**Fase:** setup inicial. Ainda não há código de aplicação.

O diário de bordo em [NOTES.md](NOTES.md) é a fonte da verdade sobre o que já foi feito e por quê. **Leia o NOTES.md antes de começar qualquer trabalho neste projeto.**

## 3. Stack

**HTML/CSS/JS puro. Sem framework, sem build.** Deploy em **Cloudflare Workers** (assets-only).

- Zero dependência de runtime. CSS inline no `index.html`, JS vanilla com `defer`.
- **Zero webfont** — stack de fonte do sistema (ver `marca.md`).
- `wrangler.toml` **sem `main`**: assets-only serve estático puro na borda, é o modo mais rápido e não consome requisição de Worker.
- Metas: PageSpeed mobile ≥ 90, acessibilidade ≥ 95, LCP < 2,5s, CLS < 0,01.

## 3.1 Oferta

- **Público da primeira página: masculino.** O feminino será uma segunda página clonada — tráfego direto converte melhor com um avatar por página.
- **Ângulo: conforto / elastano.** "Jeans que não aperta", posicionado contra o jeans rígido tradicional. É o que a página inteira defende.
- **Imagens: fotos reais do fornecedor.** Foto de produto **nunca** se gera por IA — a peça da imagem tem que ser a peça entregue, senão vira troca, reclamação e chargeback. IA só para cenário/ambientação.

## 3.2 Cor: a fonte da verdade é o `marca.md`

Toda cor sai de [marca.md](marca.md) — o `:root` do HTML copia de lá, e todo prompt de imagem cola
o bloco Estilo-mestre palavra por palavra. **Cor inventada dentro do CSS é como a página e as fotos
se separam.** Se precisar de um tom novo, adicione ao `marca.md` primeiro.

⚠️ **`DESING.md` NÃO é a direção visual.** É um scrape do site da Levi's com tokens quebrados
(fonte proprietária, escala tipográfica sem títulos, preto sobre preto) e descreve uma loja, não uma
LP. Só as regras de processo dele foram aproveitadas, e já estão no `marca.md`. Motivo completo no
NOTES.md. Não usar como referência de cor ou tipografia.

## 3.3 Produto físico ≠ infoproduto

A skill `landing-page-vendas` foi validada em infoproduto. Aqui a entrega é física, então três
seções mudam de natureza — **não** copiar "acesso vitalício / funciona offline / acesso imediato":

| Infoproduto | Aqui |
|---|---|
| acesso vitalício, offline | grade de tamanhos + tabela de medidas |
| acesso imediato | frete, prazo e rastreio |
| garantia de 7 dias (reembolso) | troca por tamanho + direito de arrependimento (CDC, 7 dias) |

## 4. Regras de trabalho

### Diário de bordo é obrigatório
Toda evolução relevante do projeto vai para [NOTES.md](NOTES.md): decisões tomadas, o que foi implementado, resultados de teste, mudanças de rota, números de campanha. Anotar **na hora**, não no fim da sessão. Formato e critério do que registrar estão no próprio NOTES.md.

### Segredos
- Chaves reais vivem **apenas** no `.env`, que é ignorado pelo git.
- Toda variável nova precisa entrar também no `.env.example` — com valor de exemplo, nunca o real.
- Nunca colar chave real em código, commit, log ou mensagem.
- `SUPABASE_SERVICE_ROLE_KEY` é chave de servidor: nunca expor no client/bundle do frontend.

### Performance (quando houver LP)
A página é o ativo da operação. Metas: PageSpeed mobile ≥ 90, acessibilidade ~100, sem dependência externa desnecessária no caminho crítico.

### Idioma
Código e nomes de variáveis em inglês. Documentação, comentários e conversa em português.

## 5. Estrutura de arquivos

```
calca/
├── CLAUDE.md              # este arquivo — instruções permanentes
├── NOTES.md               # diário de bordo — histórico e decisões
├── marca.md               # 🎨 FONTE DA VERDADE DA COR (paleta + estilo-mestre)
├── DESING.md              # ⚠️ scrape da Levi's — NÃO usar, ver §3.2
├── .env / .env.example / .gitignore
└── lp/                    # landing page (masculino)
    ├── wrangler.toml      # Worker assets-only, sem `main`
    └── public/            # ← só isto vai pro ar
        ├── index.html     # HTML + CSS inline (fonte-de-verdade do CSS)
        ├── script.js      # JS vanilla, defer
        ├── _headers       # cache: assets immutable 1 ano, JS 1 dia
        ├── .assetsignore  # exclui os .md do upload
        ├── README.md      # como editar, publicar e trocar placeholders
        ├── PROMPTS_IMAGENS.md
        └── assets/        # .webp dimensionados (ainda vazio)
```

Atualizar esta árvore conforme o projeto crescer.

**Rodar local:** `cd lp/public && npx http-server -p 8899 -c-1`
**Publicar:** `cd lp && wrangler deploy` — só com pedido explícito do Fernando. O `wrangler login`
abre OAuth no navegador e não roda headless.

## 6. Comandos

_A definir junto com a stack._

## 7. Decisões pendentes

| # | Decisão | Status |
|---|---------|--------|
| 1 | Stack do frontend | ✅ fechada — HTML estático + Cloudflare Workers (§3) |
| 2 | Gateway de checkout (Yampi / Appmax / Mercado Pago / outro) | aberta — placeholder na LP |
| 3 | Origem do produto (fornecedor, estoque próprio, dropshipping) | aberta |
| 4 | Oferta inicial: público e ângulo | ✅ fechada — masculino, conforto/elastano (§3.1) |
| 4b | Preço / ticket | aberta — placeholder na LP |
| 5 | Domínio | aberta |
| 6 | Rastreamento: Meta Pixel + CAPI (server-side, dedup por event_id) | aberta |
| 7 | Nome da marca | aberta — `[NOME-PROVISORIO]` no código |
| 8 | Grade de tamanhos e tabela de medidas | aberta — depende do fornecedor |
| 9 | Frete: transportadora, prazo, política de troca | aberta |

Ao fechar uma decisão: mover para o corpo deste arquivo e registrar o raciocínio no NOTES.md.

---

_Última atualização: 2026-07-31_
