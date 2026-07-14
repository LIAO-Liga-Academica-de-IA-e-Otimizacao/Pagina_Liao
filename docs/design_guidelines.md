# Diretrizes de Design: Sistema de Estilos LIAO

Este documento descreve as regras de design e os padrões de estilo que devem ser seguidos em todo o projeto frontend da **Liga de Inteligência Artificial e Otimização (LIAO)**. O objetivo é manter o visual consistente e garantir suporte completo e fluido a transições entre os modos **Claro (Light)** e **Escuro (Dark)**.

---

## 1. Tipografia e Fontes

As fontes do projeto estão configuradas no Tailwind e integradas via Google Fonts:
* **Fonte Principal (Textos e Parágrafos)**: `Inter` (Sans-serif) - Garantindo alta legibilidade.
* **Fonte Display (Títulos principais)**: `Outfit` (Sans-serif) - Usada para cabeçalhos e seções destacadas para dar um ar moderno e premium.
* **Fontes Auxiliares (Modais de Tecnologia/Redes)**: `Orbitron` e `Rajdhani` - Usadas em elementos futuristas de IA.

---

## 2. Paleta de Cores

As cores da marca estão mapeadas no arquivo `tailwind.config.js` e devem ser referenciadas pelas classes do Tailwind:

### Cores Institucionais (Logo LIAO)
* **L (Vermelho)**: `#E32D2D` (`liao-red`)
* **I (Amarelo)**: `#F9B233` (`liao-yellow`)
* **Λ / A (Azul)**: `#1D70B8` (`liao-blue`)
* **O (Verde)**: `#429946` (`liao-green`)

### Paletas Semânticas (com escala 50 a 950)
* **Primary** (Azuis corporativos)
* **Success** (Tons de verde para sucesso/ações afirmativas)
* **Warning** (Tons de amarelo/laranja para avisos)
* **Danger** (Tons de vermelho para erros/alertas)
* **Neutral** (Cinzas customizados para fundos e textos)
  * *Nota*: Os cinzas foram customizados para evitar tons genéricos de cinza do navegador (ex: `neutral-50` é `#f6f6f6`, `neutral-900` é `#1a1a1a`).

---

## 3. Classes Semânticas de Fundo (Seções)

Para evitar o uso excessivo de classes Tailwind repetidas nos componentes e garantir que o site se comporte de forma uniforme ao alternar temas, utilize sempre as classes abaixo (definidas em [index.css](file:///home/dante/Code/projects/Pagina_Liao/liao-react/src/index.css)):

| Classe CSS | Uso Indicado | Comportamento Light Mode | Comportamento Dark Mode |
| :--- | :--- | :--- | :--- |
| `.section-bg-main` | Fundo principal da página ou de blocos principais. | Branco (`bg-white`) | Cinza escuro (`bg-neutral-900`) |
| `.section-bg-alt` | Fundo de seções secundárias ou carrosséis alternados. | Cinza muito claro (`bg-neutral-50`) | Cinza escuro semi-transparente (`bg-neutral-900/40`) |
| `.premium-cta-bg` | Seções especiais de conversão/Call to Action. | Gradiente claro suave (`from-neutral-50 via-white to-neutral-100`) | Gradiente preto/grafite profundo (`from-neutral-950 via-neutral-900 to-black`) |
| `.footer-bg` | Área do rodapé institucional da aplicação. | Cinza-claro sólido (`bg-neutral-100`) | Preto profundo (`bg-neutral-950`) |

---

## 4. Componentes Globais Padronizados

Sempre utilize as seguintes classes estruturadas sob `@layer components` para botões e blocos informativos:

### Botões (Buttons)
* **`.btn-primary`**: Ação principal padrão. Possui gradiente de preto a verde escuro, bordas arredondadas médias (`rounded-lg`) e efeito de zoom ao passar o mouse (`hover:scale-105`).
* **`.btn-premium`**: Ação premium/seletiva (ex: inscrição no processo seletivo). Possui uma borda com gradiente dourado metálico, fundo sólido (branco no Light Mode e preto/grafite no Dark Mode) e texto escuro no Light Mode (`text-neutral-900`) e claro no Dark Mode (`dark:text-white`).
* **`.btn-secondary`**: Ações secundárias. Fundo neutro cinza-claro/escuro adaptativo.

### Cartões (Cards)
* **`.card`**: Cartão com fundo dinâmico e sombra que aumenta no hover.
* **`.card-premium`**: Cartão com borda metálica dourada fina e fundos adaptativos (branco/escuro).

### Formulários
* **`.input-field`**: Inputs e textareas padronizados com bordas sutis e foco na cor azul primária.

---

## 5. Boas Práticas de Implementação
1. **Evite Estilos Ad-hoc**: Não utilize classes Tailwind de cor de fundo, arredondamento e sombra diretamente nos botões principais e seções de página se houver uma classe global semântica (ex: use `.btn-primary` em vez de escrever `bg-green-500 rounded-full px-10 py-5 shadow-lg`).
2. **Respeite o Dark Mode**: Sempre que adicionar cores customizadas de texto ou fundo, lembre-se de usar o prefixo `dark:` para definir o contraste correspondente para o modo escuro.
3. **Use Transições Suaves**: Para todas as trocas de cor de fundo e texto induzidas pelo tema, certifique-se de adicionar `transition-colors duration-200` para manter o efeito fluido.
