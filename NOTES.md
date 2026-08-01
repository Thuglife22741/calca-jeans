# NOTES.md — Diário de Bordo

Histórico completo do projeto: o que foi feito, o que foi decidido, o que deu certo e o que não deu.

**Regra:** entrada nova **no topo** da seção de registros (mais recente primeiro). Anotar na hora, não depois.

---

## Como usar este diário

**Registrar sempre que:**
- uma decisão for tomada (e principalmente **por quê** — o motivo é mais valioso que a decisão)
- algo for implementado ou entregue
- um teste, campanha ou experimento produzir resultado (com números)
- a rota mudar, ou uma decisão anterior for revertida
- aparecer um problema, bug ou bloqueio — e como foi resolvido
- entrar uma integração, chave ou serviço externo novo

**Não registrar:** detalhe que o código já conta sozinho (nome de função, estrutura de pasta). Registre o que **não dá pra recuperar lendo o repositório**: o raciocínio, o contexto, a alternativa descartada.

**Formato de cada entrada:**

```
## AAAA-MM-DD — Título curto

**O quê:** o que aconteceu.
**Por quê:** o raciocínio / contexto.
**Resultado:** o que saiu disso (ou "em aberto").
**Próximo passo:** o que ficou pendente.
```

---

## Registros

## 2026-07-31 — Repositório no GitHub

**O quê:** `git init` + primeiro commit + repositório remoto **privado**
`Thuglife22741/calca-jeans`. 13 arquivos versionados.

**Por quê privado:** projeto comercial com oferta, preço e margem ainda em definição. Dá para abrir
depois; o contrário custa mais.

**Verificado após o push:** `.env` retorna 404 no remoto (não subiu) · o token real foi conferido
por comparação direta contra o conteúdo staged, não só por padrão de regex · o remote não guarda
credencial embutida na URL.

**Duas coisas foram excluídas do versionamento:**
- `fop-tracking/` — é um clone da skill, com `.git` próprio. Commitado como estava viraria um
  gitlink quebrado (pasta vazia para quem clonasse). Continua no disco, só não é versionado. Se um
  dia precisar viajar junto, tem que virar submódulo de verdade.
- `hero.png` — screenshot que o Playwright deixou na raiz durante a verificação. Removido.

**Pendência de autenticação:** o remote está com URL limpa, sem token. O `git push` vai pedir
credencial. Resolver com `git config --global credential.helper manager` (Git Credential Manager,
já vem no Git for Windows) na primeira vez.

⚠️ **O token do `.env` trafegou pelo chat.** Continua fora do repositório, mas convém revogar em
github.com/settings/tokens e gerar outro — de preferência um fine-grained, com escopo só neste repo.

**Próximo passo:** segue igual — fotos, preço, gateway e medidas reais.

---

## 2026-07-31 — LP masculina construída (placeholder-first) e verificada

**O quê:** Estrutura `lp/` criada e a página montada inteira: 11 seções, CSS inline, JS vanilla,
`wrangler.toml` assets-only. Ainda **sem** fotos, preço e checkout — tudo em placeholder marcado.

**Seções (adaptadas para produto físico):** topbar com o diferencial · hero · comparativo
"rígido vs. elastano" · carrossel de fotos com lightbox · 4 cards de benefício · 3 passos até a
entrega · ficha técnica · **tabela de medidas** · seção de honestidade · 2 ofertas (1 calça / kit 2)
· garantia · FAQ · CTA final · rodapé · sticky CTA · modal de upsell.

**O que mudou em relação à skill (que é de infoproduto):** saíram "acesso vitalício", "funciona
offline" e "acesso imediato"; entraram tabela de medidas, prazo/rastreio e troca de tamanho. A
garantia deixou de ser reembolso genérico e virou o direito de arrependimento do CDC (7 dias) mais
a troca por tamanho.

**Verificado no navegador (412×915), não por inspeção visual:**
- Contraste: **164 elementos com texto, 0 falhas** (auditoria §11.1 da skill).
- Console: 0 erros (o 404 de favicon foi resolvido com ícone SVG inline).
- Sem vazamento horizontal — o carrossel fica contido no `overflow:hidden` do viewport.
- Reveal: 11/11 aparecem em rolagem gradual; o hero **não** tem `.reveal` (protege o LCP).
- Sticky CTA: escondido no topo, aparece no meio, some sobre as ofertas e o rodapé; `tabindex`
  acompanha o `aria-hidden` (0 quando visível, -1 quando não).
- Carrossel: 5 slides clonados para 10, clones com `aria-hidden` e sem foco.
- Modal de upsell: abre no 1º clique do plano de 1 unidade sem navegar, trava o scroll, move o foco,
  fecha no Esc e devolve o foco.
- Os 3 botões de checkout são `<a href>` reais (`<button>` quebraria o InitiateCheckout do Pixel).

**Decisão de escrita — FAQ com `[PENDENTE]` em vez de resposta inventada.** Frete, prazo,
parcelamento e quem paga a troca ainda não foram definidos. Escrever resposta plausível ali seria o
mesmo erro de fabricar depoimento, então ficaram marcados. **Não preencher por inferência.**

**Prova social:** não existe ainda, então entrou a seção de honestidade ("não tenho depoimento para
te mostrar") em vez de print fabricado. Quando houver print real de cliente, ela vira carrossel.

**Resultado:** página navegável ponta a ponta, pronta para receber fotos, preço e checkout.

**Próximo passo:** (1) Fernando envia as fotos do fornecedor — 6 no total, lista em
`lp/public/PROMPTS_IMAGENS.md`; (2) definir preço e gateway; (3) medidas reais da grade;
(4) só então deploy + PageSpeed.

---

## 2026-07-31 — Oferta definida, stack fechada e `DESING.md` descartado como direção visual

**O quê:** Fechadas as decisões #1 e #4 do CLAUDE.md. Criado o `marca.md` (paleta índigo + areia,
contrastes medidos). Ainda sem código.

**Decisões fechadas:**
- **Stack:** HTML/CSS/JS estático, deploy em Cloudflare Workers (assets-only, sem `main` no `wrangler.toml`).
- **Público inicial:** masculino. Feminino vira uma segunda página clonada depois — tráfego direto converte melhor com um avatar por página.
- **Ângulo:** conforto / elastano. "Jeans que não aperta", contra o jeans rígido tradicional.
- **Imagens:** fotos reais do fornecedor (Fernando tem os arquivos, ainda não enviados). Foto de produto **não** se gera por IA — a peça da imagem tem que ser a peça entregue, senão vira troca e chargeback.
- **Preço e checkout:** placeholder por enquanto, não travam a build.

**`DESING.md` foi descartado como direção visual. Por quê — três motivos:**
1. É um scrape do `levi.com.br`. A fonte `DenimINK` é proprietária da Levi's e o `#c41230` é o vermelho da marca deles. Usar isso numa LP de jeans concorrente é imitação de identidade de marca, não modelagem de estrutura.
2. Os tokens saíram quebrados: `font.size.xs=0px`; escala tipográfica inteira entre 10 e 14px (sem título, e o h1 da LP é 37px); `surface.base=#000000` com `text.secondary=#110b0d` (preto sobre preto); `text.tertiary=#0000ee` é o azul de link padrão do navegador — artefato de scraping.
3. Descreve uma **loja** (85 links, 3 navegações, 25 inputs), não uma LP de oferta única sem menu. Segui-lo desfaria a decisão de modelo.

**O que foi aproveitado dele:** as regras de processo — WCAG 2.2 AA testável, `:focus-visible`
sempre visível, token semântico em vez de hex solto, estados obrigatórios por componente, zero
exceção pontual de espaçamento. Copiadas para o `marca.md`.

**Paleta escolhida:** índigo `#2F4E86` + areia `#F6F1E8`, acento cobre `#C0703A`. O índigo passa AA
nos dois sentidos (7,30:1 como texto sobre o fundo, 8,22:1 com branco por cima), o que elimina a
armadilha de contraste no botão de CTA. O cobre não passa em nenhum dos dois (3,74:1 e 3,32:1) —
ficou como decoração pura, com `--copper-ink #8F4A18` para qualquer texto.

**Resultado:** `marca.md` escrito, contrastes calculados. Pronto para construir.

**Próximo passo:** Fernando confirma a paleta → construir a LP placeholder-first. Depois: fotos
reais, preço, checkout.

---

## 2026-07-31 — Início do projeto e setup dos arquivos-base

**O quê:** Projeto criado do zero em `Projetos_IDE/calca`. Criados `CLAUDE.md`, `NOTES.md`, `.env`, `.env.example` e `.gitignore`. Nenhum código de aplicação ainda.

**Por quê:** Fernando quis a documentação e o controle de segredos em pé **antes** do código, para que o projeto já nasça com memória (diário de bordo) e com as chaves fora do versionamento — o banco e as APIs entram em seguida.

**Definições fechadas nesta sessão:**
- Modelo: **landing page de tráfego direto** (não e-commerce com catálogo). Foco em conversão de oferta, escala por Meta Ads.
- Produto: calças jeans masculinas e femininas.
- Banco: **Supabase (Postgres)**.

**Ficou em aberto:** stack do frontend, gateway de checkout, fornecedor/estoque, oferta inicial (qual modelo e qual público atacar primeiro), domínio, setup de rastreamento. Lista completa na tabela de Decisões Pendentes do [CLAUDE.md](CLAUDE.md).

**Resultado:** estrutura base pronta. `.env` preenchido só com placeholders — nenhuma credencial real ainda.

**Próximo passo:** decidir a oferta inicial e o público (masculino ou feminino primeiro), já que isso condiciona copy, criativos e a escolha da stack.
