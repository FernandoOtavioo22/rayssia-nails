/* =====================================================================
   RAYSSIA NAILS — CONFIGURAÇÃO CENTRAL
   ---------------------------------------------------------------------
   Edite APENAS este arquivo para trocar telefone, mensagens, endereço,
   horários, Instagram, fotos da galeria e depoimentos.
   ===================================================================== */

window.RAYSSIA_CONFIG = {
  /* ---------------------------------------------------------------
     WHATSAPP
     Formato: código do país + DDD + número, só dígitos.
     Exemplo: 5511987654321  (55 = Brasil, 11 = DDD)
     --------------------------------------------------------------- */
  whatsappNumber: "5584994455760",
  whatsappDisplay: "(84) 99445-5760",   // como o número aparece escrito no site

  /* Mensagem padrão (botões "Agendar horário", flutuante, CTA final) */
  messages: {
    default:
      "Olá! Encontrei o site da Rayssia Nails e gostaria de conhecer melhor os serviços e consultar os horários disponíveis para agendamento. 💅",
    gallery:
      "Olá! Vi a galeria no site da Rayssia Nails e quero fazer minhas unhas assim! Pode me passar os horários disponíveis? 💅",
    faq:
      "Olá! Estava lendo as dúvidas no site da Rayssia Nails e gostaria de tirar uma dúvida antes de agendar. 💅",
    instagram: "",

    /* Mensagens por serviço — a chave é usada em data-wa="servico:CHAVE" */
    services: {
      alongamento:
        "Olá! Vi no site da Rayssia Nails o serviço de Alongamento de unhas e gostaria de saber mais e consultar os horários disponíveis. 💅",
      "banho-de-gel":
        "Olá! Vi no site da Rayssia Nails o serviço de Banho de gel e gostaria de saber mais e consultar os horários disponíveis. 💅",
      "esmaltacao-em-gel":
        "Olá! Vi no site da Rayssia Nails o serviço de Esmaltação em gel e gostaria de saber mais e consultar os horários disponíveis. 💅",
      manutencao:
        "Olá! Gostaria de agendar uma Manutenção com a Rayssia Nails. Quais horários estão disponíveis? 💅",
      "nail-art":
        "Olá! Vi no site da Rayssia Nails o serviço de Nail Art e gostaria de conversar sobre uma decoração personalizada. 💅"
    }
  },

  /* ---------------------------------------------------------------
     CONTATO E INFORMAÇÕES DO RODAPÉ
     --------------------------------------------------------------- */
  instagramUrl: "https://www.instagram.com/raysillva_nails/",
  instagramHandle: "@raysillva_nails",

  /* Nota e quantidade de avaliações no Google (atualize quando mudar) */
  googleRating: "5,0",
  googleCount: "21",
  googleText: "21 avaliações no Google",
  address: "Endereço informado pelo WhatsApp",       // ex.: Rua das Flores, 123 — Centro, Cidade/UF
  hours: [
    "Atendimento com horário marcado",               // ex.: Terça a sexta — 9h às 19h
    "Consulte a agenda pelo WhatsApp"                // ex.: Sábado — 9h às 15h
  ],

  /* ---------------------------------------------------------------
     GALERIA
     - src: caminho da foto. Para usar fotos próprias, coloque o arquivo
       em assets/img/ e use, por exemplo: "assets/img/galeria-01.webp"
     - size: "" (normal), "tall" (alta) ou "wide" (larga)
       Mantenha 2 "tall" + 3 "wide" nesta ordem para a grade ficar sem buracos.
     --------------------------------------------------------------- */
  gallery: [
    { src: "assets/img/alongamento-marmore-ouro.webp", alt: "Alongamento bailarina com efeito mármore e folha de ouro", label: "Mármore e ouro", size: "tall" },
    { src: "assets/img/lilas-florzinhas.webp", alt: "Unhas lilás com florzinhas brancas pintadas à mão", label: "Lilás com flores", size: "" },
    { src: "assets/img/esmaltacao-marsala.webp", alt: "Esmaltação em gel marsala com acabamento brilhante", label: "Esmaltação marsala", size: "wide" },
    { src: "assets/img/francesinha-diagonal.webp", alt: "Francesinha branca diagonal com linhas finas e strass", label: "Francesinha diagonal", size: "" },
    { src: "assets/img/flor-pintada-a-mao.jpg", alt: "Francesinha amarela com flor rosa pintada à mão", label: "Flor pintada à mão", size: "tall" },
    { src: "assets/img/francesinha-classica.webp", alt: "Francesinha clássica com glitter em unhas quadradas", label: "Francesinha clássica", size: "" },
    { src: "assets/img/degrade-brilho.webp", alt: "Unhas amendoadas em degradê rosa com brilho", label: "Degradê com brilho", size: "wide" },
    { src: "assets/img/francesinha-lilas-borboleta.webp", alt: "Francesinha lilás com borboletas aplicadas", label: "Lilás com borboleta", size: "" },
    { src: "assets/img/preto-nude-linhas.jpg", alt: "Unhas em preto e nude com linhas brancas e douradas", label: "Preto e nude", size: "" },
    { src: "assets/img/alongamento-prata.webp", alt: "Alongamento bailarina em tom lavanda com linhas prateadas", label: "Alongamento lavanda", size: "" },
    { src: "assets/img/pes-francesinha.webp", alt: "Pés com francesinha clássica", label: "Pés com francesinha", size: "wide" }
  ],

  /* ---------------------------------------------------------------
     DEPOIMENTOS — avaliações reais do Google (perfil da Rayssia Nails)
     Para adicionar outra: copie uma linha e troque text e name.
     --------------------------------------------------------------- */
  testimonials: [
    { text: "Quero deixar registrado o quanto amo o trabalho da minha nail designer! O atendimento sempre maravilhoso, ela é super caprichosa, cuidadosa e muito atenciosa em cada detalhe. Minhas unhas ficam sempre perfeitas, exatamente como eu quero! 😍💖", name: "Brenda Kelly", service: "Avaliação no Google", rating: 5, placeholder: false },
    { text: "Ótimo atendimento! Trabalho impecável, realizado com muito cuidado, dedicação e excelência. Tudo muito bem feito.", name: "Alana Raiane Medeiros", service: "Avaliação no Google", rating: 5, placeholder: false },
    { text: "Atendimento de qualidade, trabalho excelente e profissional com experiência, carisma e talento. Vale muito a pena, e eleva a nossa autoestima.", name: "Roseane Cavalcanti", service: "Avaliação no Google", rating: 5, placeholder: false },
    { text: "Maravilhosa, super atenciosa, trabalhadora super bem. Já estou com ela há 1 ano e super indico 🥰", name: "Ana Lima", service: "Avaliação no Google", rating: 5, placeholder: false },
    { text: "Amo o trabalho dela, super indico ❤️🥰", name: "Wenia Naelly", service: "Avaliação no Google", rating: 5, placeholder: false },
    { text: "Ótimo trabalho, poder confiar. Mão de fada, adorei!", name: "Tereza Oliveira", service: "Avaliação no Google", rating: 5, placeholder: false }
  ]
};
