# Rayssia Nails — Landing Page

Site de página única em **HTML, CSS e JavaScript puros** (sem build, sem dependências).
Basta abrir `index.html` no navegador ou publicar a pasta inteira em qualquer hospedagem estática
(Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```
rayssia-nails/
├── index.html          ← conteúdo e seções do site
├── css/styles.css      ← identidade visual (cores, fontes, layout, animações)
├── js/config.js        ← ★ CONFIGURAÇÃO: WhatsApp, mensagens, endereço, horários, galeria, depoimentos
├── js/main.js          ← interações (menu, FAQ, lightbox, links do WhatsApp)
├── js/effects.js       ← animações com GSAP + Motion (opcional)
├── js/effects-3d.js    ← brilhos e unhas 3D com Three.js (opcional)
└── assets/
    ├── favicon-32.png / apple-touch-icon.png  ← ícones gerados a partir do logo
    └── img/            ← logo (logo-original.jpg, logo-emblema.png) e fotos reais
```

## 1. Trocar o número do WhatsApp

Abra `js/config.js` e altere:

```js
whatsappNumber: "5584994455760",
```

Use só dígitos: `55` + DDD + número. Ex.: `5511987654321`.
**Todos** os botões do site (header, hero, serviços, galeria, CTA, FAQ, rodapé e o botão flutuante)
usam esse número automaticamente.

As mensagens pré-preenchidas ficam logo abaixo, em `messages` — uma padrão, uma para a galeria,
uma para o FAQ e uma para cada serviço.

## 2. Endereço, horários e Instagram

Também em `js/config.js`: `address`, `hours`, `instagramUrl` e `instagramHandle`.

## 3. Trocar as fotos

Todas as fotos do site são trabalhos da Rayssia (do Instagram) e ficam em `assets/img/`.

1. Salve a nova foto em `assets/img/` (de preferência `.webp` ou `.jpg`, até ~300 KB cada).
2. **Galeria:** em `js/config.js → gallery`, adicione ou troque itens (`src`, `alt` = descrição,
   `label` = legenda). Ao mudar a quantidade de fotos, ajuste os tamanhos (`tall`/`wide`)
   para a grade não ficar com buracos.
3. **Hero, Sobre, Serviços e Diferenciais:** em `index.html`, procure pelos comentários
   `<!-- IMAGEM ... -->` e troque o `src` da tag `<img>` logo abaixo.
4. Na foto principal (hero), atualize também a tag `<link rel="preload" ...>` no `<head>`
   e a `og:image` (imagem que aparece ao compartilhar o link).
5. A seção "Sobre" usa uma foto de unhas; se quiser, troque por uma foto da Rayssia ou do espaço.

Se alguma foto não carregar, o site mostra um fundo lilás com o nome da marca no lugar
(nunca um ícone de imagem quebrada).

## 4. Avaliações (Google)

Em `js/config.js → testimonials` estão 6 avaliações reais do Google. A nota e a quantidade
(`googleRating`, `googleText`) aparecem no topo do site e na seção de depoimentos — atualize
quando o número de avaliações mudar.

## 4.1 Efeitos (GSAP, Motion e Three.js)

- **GSAP:** entrada do título no topo, parallax das fotos, contador da nota do Google.
- **Motion:** botões “magnéticos”, estrelas aparecendo e barra de progresso no topo.
- **Three.js:** brilhos dourados no topo e unhas 3D (inspiradas no logo) no bloco roxo de agendamento
  (só em telas largas).

As bibliotecas vêm de CDN e são opcionais: se não carregarem, o site funciona igual.
Para remover, apague as linhas de `<script>` marcadas como “Efeitos” no fim do `index.html`
(e o `importmap` no `<head>`). Quem ativa “reduzir movimento” no celular não vê as animações.

## 5. Antes de publicar

- Troque `https://www.seudominio.com.br/` (canonical, `og:url` e `og:image`) no `<head>` do `index.html`.
- Confira o número do WhatsApp clicando em qualquer botão.

## Recursos incluídos

- Header fixo com sombra ao rolar, link ativo por seção e menu mobile (hambúrguer).
- Botão flutuante de WhatsApp e mensagens personalizadas por serviço (abrem em nova aba).
- Serviços em grade editorial no desktop e carrossel com indicadores no celular.
- Galeria em grade de tamanhos variados com lightbox (setas, teclado, swipe).
- FAQ em acordeão acessível.
- Animações suaves de entrada, desativadas para quem prefere movimento reduzido.
- SEO básico (title, description, Open Graph), lazy loading e imagens responsivas.
- Sem rolagem horizontal, testado em 360, 390, 430, 768, 1024 e 1440 px.
