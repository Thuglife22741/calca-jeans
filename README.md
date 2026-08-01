# calça jeans — operação de tráfego direto

Venda de calça jeans masculina e feminina por landing page + Meta Ads.
Não é loja com catálogo: é oferta única, uma página por público.

**Status:** LP masculina construída e navegável, ainda sem fotos, preço e checkout.

---

## Estrutura

```
.
├── CLAUDE.md     instruções permanentes + decisões pendentes
├── NOTES.md      diário de bordo — o histórico e o porquê de cada decisão
├── marca.md      🎨 fonte da verdade da cor (paleta e contrastes medidos)
└── lp/           landing page masculina — HTML estático, Cloudflare Workers
```

Comece pelo **[NOTES.md](NOTES.md)**: ele conta em que pé está o projeto e por que cada
coisa foi decidida assim. O `CLAUDE.md` é o que vale como regra.

---

## Rodar

```bash
cd lp/public
npx http-server -p 8899 -c-1
```

## Publicar

```bash
cd lp
wrangler whoami     # confirma o login
wrangler deploy
```

## Variáveis

```bash
cp .env.example .env
```

O `.env` **nunca** é versionado. Toda variável nova entra também no `.env.example`,
com valor de exemplo.

---

## Stack

HTML, CSS e JS puros. Sem framework, sem build, sem webfont. Deploy em Cloudflare
Workers (assets-only). Banco em Supabase, quando entrar.

A escolha é por velocidade: em tráfego pago o anúncio precisa pintar em ~1s no celular.
Metas — PageSpeed mobile ≥ 90, acessibilidade ≥ 95, LCP < 2,5s.

---

## Como trabalhamos aqui

**O diário é obrigatório.** Decisão tomada, teste rodado, rota mudada: vai para o
`NOTES.md` na hora, com o motivo. O motivo importa mais que a decisão.

**A cor sai do `marca.md`.** A LP e as imagens são feitas em momentos diferentes; se cada
uma escolher a cor na hora, a página sai de um tom e as fotos de outro.

**Nada de prova social inventada.** Sem depoimento fabricado, sem escassez falsa, sem
preço-âncora que nunca existiu. Onde a resposta ainda não existe, fica `[PENDENTE]` —
inclusive no FAQ.

**Foto de produto não se gera por IA.** A peça da imagem tem que ser a peça que chega na
casa do cliente.

> ⚠️ `DESING.md` não é a direção visual do projeto — é um scrape do site da Levi's, com
> tokens quebrados. Está no repositório só como registro. O motivo está no `NOTES.md`.
