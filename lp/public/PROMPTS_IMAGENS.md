# Imagens da LP

## ⚠️ Leia antes: foto de produto NÃO se gera por IA

A calça da imagem tem que ser **a calça que chega na casa do cliente**. Divergência entre foto e
peça é a principal causa de troca, reclamação no Reclame Aqui e chargeback em roupa vendida online
— e, em tráfego pago, ainda derruba a conta por reclamação de anúncio enganoso.

**IA aqui serve só para cenário e ambientação** (fundo, textura de parede, prop). Nunca para a peça.

---

## As 6 fotos que a página precisa

O Fernando tem os arquivos do fornecedor. Cada uma substitui um `data-ph` no `index.html`.

| # | Placeholder | O que mostrar | Largura final |
|---|---|---|---|
| 1 | `HERO — homem vestindo a calça` | corpo inteiro, de pé, luz natural. É o LCP. | 540px |
| 2 | `Frente inteira` | a peça deitada ou no manequim, frente | 520px + `-hd` 760px |
| 3 | `Costas / bolso traseiro` | costas, com o bolso e a costura visíveis | 520px + `-hd` |
| 4 | `Close do tecido e da costura` | macro — é o que prova a qualidade | 520px + `-hd` |
| 5 | `Cós e botão` | detalhe do cós, onde o elastano aparece | 520px + `-hd` |
| 6 | `Barra / caimento no sapato` | mostra o comprimento e o caimento real | 520px + `-hd` |

A #4 é a que mais vende num ângulo de conforto — o elastano é invisível numa foto de corpo inteiro,
mas dá para ver a trama de perto.

---

## Estilo-mestre

**Copiado do `../../marca.md`, palavra por palavra.** Cola no topo de todo prompt de cenário.
Se a paleta mudar, muda no `marca.md` primeiro e recola aqui — não editar por prompt.

```
Paleta: areia quente ■#F6F1E8, índigo de tecido ■#2F4E86, cobre ■#C0703A, grafite ■#1A1F2B
Vibe: índigo de tecido sobre areia quente — honesto, tátil, luz natural de fim de tarde,
sem brilho de estúdio publicitário
Fundo sempre areia lisa (#F6F1E8) ou concreto claro. Nenhum rosto humano identificável.
Textura de algodão e costura visíveis. Nada de renderização 3D ou aparência de CGI.
```

---

## Tratamento das fotos reais

Para as fotos do fornecedor casarem com a página, o fundo tem que ir para a areia `#F6F1E8`
(recorte + fundo chapado) e a temperatura tem que ficar quente. Sem isso, uma foto de estúdio
branco-frio fica visivelmente "colada" numa página bege.

```bash
sharp -i original.jpg -o assets/hero.webp -q 76 resize 540 --withoutEnlargement
```

Ícones (se precisar): flat, 1:1, PNG com fundo transparente, mesmo traço, sem texto, q82–85.

---

## Onde guardar os originais

Fora de `public/` — sugestão: `lp/originais/`. Eles são a fonte para reprocessar quando mudar o
tamanho de exibição. O que vai pro ar é só o `.webp` dimensionado.
