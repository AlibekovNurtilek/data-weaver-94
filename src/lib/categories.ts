export const customTags = ['TTSOZ', 'ETSOZ', 'ISSOZ', 'ASSOZ', 'TTSSOZ'];

export const categories = [
  {
    id: 1,
    label: "Маани берүүчү",
    children: [
      {
        id: 11,
        label: "Зат атооч",
        children: [
          { id: 111, label: "Зат атооч", designation: "NOUN" },
          { id: 112, label: "Ээнчилүү зат атооч", designation: "PROPN" },
        ],
      },
      { id: 12, label: "Сын атооч", designation: "ADJ" },
      { id: 13, label: "Ат атооч", designation: "PRON" },
      { id: 14, label: "Сан атооч", designation: "NUM" },
      {
        id: 15,
        label: "Этиш",
        children: [
          { id: 151, label: "Этиш", designation: "VERB" },
          { id: 152, label: "Көмөкчү этиш", designation: "AUX" },
        ],
      },
      { id: 16, label: "Тактооч", designation: "ADV" },
    ],
  },
  {
    id: 2,
    label: "Маани бербөөчү же кызматчы",
    children: [
      { id: 21, label: "Байламта", designation: "CCONJ" },
      { id: 22, label: "Жандооч", designation: "SCONJ" },
      { id: 23, label: "Бөлүкчө", designation: "PART" },
      { id: 24, label: "Модалдык сөз", designation: "INTJ" },
    ],
  },
  {
    id: 3,
    label: "Өзгөчө сөз түркүмдөрү",
    children: [
      {
        id: 31,
        label: "Тууранды сөз",
        children: [
          { id: 311, label: "Табыш тууранды сөз", designation: "TTSOZ" },
          { id: 312, label: "Элес тууранды сөз", designation: "ETSOZ" },
        ],
      },
      {
        id: 32,
        label: "Сырдык сөз",
        children: [
          { id: 321, label: "Ички сезимди билдирүүчү", designation: "ISSOZ" },
          { id: 322, label: "Айбанаттарга карата айтылуучу", designation: "ASSOZ" },
          { id: 323, label: "Турмуш тиричиликте колдонулуучу", designation: "TTSSOZ" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Башка...",
    children: [
      { id: 41, label: "Атоочтук", designation: "ATOOCH" },
      { id: 42, label: "Кыймыл атооч", designation: "KTOOCH" },
      { id: 43, label: "Тыныш белгиси", designation: "PUNCT" },
      { id: 44, label: "Символ", designation: "SYM" },
    ],
  },
];