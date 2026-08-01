# Marca — [NOME-PROVISORIO] · Calça Jeans Masculina

> **Fonte da verdade da cor.** O `index.html` copia os hex daqui para o `:root`.
> Todo prompt de imagem cola o bloco **Estilo-mestre** palavra por palavra.
> Cor que não está aqui não entra no CSS — se precisar de uma nova, adicione aqui primeiro.

## Direção visual

Índigo de tecido sobre areia quente — honesto, tátil, sem brilho de publicidade. A página tem que
parecer a peça: algodão de verdade, costura à vista, nada de estúdio branco estéril.

## Paleta (fonte da verdade)

| Papel | Hex | Token | Onde entra |
|---|---|---|---|
| fundo | `#F6F1E8` | `--bg` | fundo da página · fundo das fotos de produto |
| fundo alt | `#EAE0D0` | `--bg-soft` | faixas inclinadas, seções alternadas |
| linha | `#DDD2BE` | `--line` | bordas de card |
| marca | `#2F4E86` | `--brand` | índigo — fundos, ícones, gradiente |
| marca clara | `#3E6AAE` | `--brand-2` | ponta clara do gradiente |
| acento | `#C0703A` | `--copper` | cobre — SÓ decoração (ver contraste) |
| texto | `#1A1F2B` | `--ink` | texto principal |
| texto fraco | `#5B6270` | `--ink-soft` | texto secundário |

## Variantes derivadas (medidas, não chutadas)

| Token | Hex | Contraste | Uso |
|---|---|---|---|
| `--ink` | `#1A1F2B` | **14,64:1** sobre `--bg` | texto principal |
| `--ink-soft` | `#5B6270` | **5,45:1** sobre `--bg` | texto secundário — passa AA |
| `--brand` | `#2F4E86` | **7,30:1** sobre `--bg` · **8,22:1** com branco | índigo serve como texto E como fundo |
| `--brand-2` | `#3E6AAE` | **5,42:1** com branco | ponta clara do gradiente — passa |
| `--copper-ink` | `#8F4A18` | **5,91:1** sobre `--bg` · **6,65:1** com branco | TEXTO na cor cobre |
| `--copper-soft` | `#F5E4D6` | — | fundo de badge/tile |

**Vantagem do índigo:** por ser escuro, ele passa AA nos dois sentidos — como texto sobre o fundo
claro *e* com texto branco por cima. Isso elimina a armadilha mais cara da skill (botão de CTA com
texto branco sobre cor vibrante medindo 2,7–3,8:1). O gradiente do botão é
`linear-gradient(90deg, #2F4E86, #3E6AAE)` e **as duas pontas passam** — 8,22:1 e 5,42:1.

**O cobre não tem essa folga.** Branco sobre `--copper` mede **3,74:1** e falha; cobre como texto
sobre o fundo mede **3,32:1** e falha. Por isso `--copper` é decoração pura (barra lateral de card,
ícone, filete) e todo texto em cobre usa `--copper-ink`.

⚠️ Botão de 16px/800 é texto **normal** pela WCAG (grande = ≥24px, ou ≥18,66px E bold). Precisa de
4,5:1, não 3:1. Não confiar na intuição de "botão grande".

## Tipografia

```css
--display: Georgia,'Noto Serif','Times New Roman',serif;
--body: system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;
```

**Zero webfont** — nenhuma requisição, nenhum render-block, nenhum FOUT. A serifada de sistema
carrega o caráter (denim tem estética de herança, funciona); o `system-ui` fica só no corpo, onde
neutralidade é virtude.

**Não usar `DenimINK`** — é fonte proprietária da Levi's, licenciada e não redistribuível.

## Regras herdadas do `DESING.md` (as que se aproveitam)

- WCAG 2.2 AA como alvo, com critério testável — a auditoria de contraste roda antes de todo deploy.
- `:focus-visible` sempre visível; nunca remover indicador de foco.
- Token semântico no componente, nunca hex solto.
- Todo componente interativo define: default, hover, focus-visible, active, disabled.
- Sem exceção pontual de espaçamento ou tipografia — se precisa de um valor novo, ele vira token.

## Estilo-mestre (COLAR EM TODO PROMPT DE IMAGEM — não editar por prompt)

```
Paleta: areia quente ■#F6F1E8, índigo de tecido ■#2F4E86, cobre ■#C0703A, grafite ■#1A1F2B
Vibe: índigo de tecido sobre areia quente — honesto, tátil, luz natural de fim de tarde,
sem brilho de estúdio publicitário
Fundo sempre areia lisa (#F6F1E8) ou concreto claro. Nenhum rosto humano identificável.
Textura de algodão e costura visíveis. Nada de renderização 3D ou aparência de CGI.
```

⚠️ **Foto de produto não se gera por IA.** A peça na imagem tem que ser a peça que chega na casa do
cliente — divergência vira troca, reclamação e chargeback. IA só para cenário e ambientação.

---

_Última atualização: 2026-07-31_
