import type { Person } from "../types";

/**
 * ─────────────────────────────────────────────────────────────
 *  THE FAMILY.  To add someone, add one entry to this list.
 * ─────────────────────────────────────────────────────────────
 *  - `parents`: ids of mother and father → decides the row and the line.
 *  - `partners`: id of the spouse (only one side needs it).
 *  - `born` / `died`: "1955" or "12.03.1955".
 *  - `photo`: put the picture in public/photos/ and write "photos/<file name>".
 *  - `extra`: small grey text under the name.
 *  Example: { id: "sagyn", name: "Сагын Осмоналиев", gender: "m", born: "1995", photo: "photos/sagyn.jpg", ... }
 *  Order inside the list = order left→right among siblings.
 */
export const family: Person[] = [
  // ══ Маматовы ══════════════════════════════════════════════
  // Жаныбек: second wife Паша (mother of Максат, Гулум, Мира, Бакыт),
  // first wife Чынар (mother of Чолпон).
  {
    id: "pasha",
    name: "Паша Исаева",
    gender: "f",
    born: "1934",
    photo: "photos/Паша-Исаева.JPG",
  },
  {
    id: "zhanibek-m",
    name: "Жаныбек Маматов",
    gender: "m",
    born: "31.10.1928",
    photo: "photos/Жаныбек-Маматов.jpg",
    partners: ["pasha", "chynar"],
  },
  { id: "chynar", name: "Чынар Мамажанова", gender: "f", born: "1939" },

  // Максат: Нургуль (left) and Жылдыз (right).
  { id: "nurgul", name: "Нургуль", gender: "f" },
  {
    id: "maksat",
    name: "Максат Маматов",
    gender: "m",
    born: "23.03.1973",
    parents: ["zhanibek-m", "pasha"],
    partners: ["nurgul", "zhyldyz"],
  },
  { id: "zhyldyz", name: "Жылдыз", gender: "f", photo: "photos/Жылдыз.jpg" },
  {
    id: "assol",
    name: "Ассоль Максат кызы",
    gender: "f",
    photo: "photos/Ассоль-Максат-кызы.jpg",
    parents: ["maksat", "nurgul"],
  },
  {
    id: "ainazik",
    name: "Айназик Жаныбековна",
    gender: "f",
    parents: ["maksat", "nurgul"],
  },
  {
    id: "mustafa",
    name: "Мустафа Маматов",
    gender: "m",
    parents: ["maksat", "zhyldyz"],
  },

  {
    id: "gulum",
    name: "Гулум Маматова",
    gender: "f",
    born: "06.06.1970",
    photo: "photos/Гулум-Маматова.jpg",
    parents: ["zhanibek-m", "pasha"],
  },

  {
    id: "mira",
    name: "Мира Маматова",
    gender: "f",
    born: "01.05.1967",
    photo: "photos/Мира-Маматова.jpg",
    parents: ["zhanibek-m", "pasha"],
  },
  { id: "emirbek", name: "Эмирбек", gender: "m", parents: ["mira"] },

  {
    id: "bakyt",
    name: "Бакыт Маматов",
    gender: "m",
    born: "20.12.1962",
    photo: "photos/Бакыт-Маматов.jpg",
    parents: ["zhanibek-m", "pasha"],
    partners: ["kyzdarkan"],
  },
  {
    id: "kyzdarkan",
    name: "Кыздаркан Маканбаева",
    gender: "f",
    born: "1972",
    photo: "photos/Кыздаркан.JPG",
  },
  {
    id: "suiumkan",
    name: "Суйумкан Маматова",
    gender: "f",
    photo: "photos/Суйумкан-Маматова.jpg",
    parents: ["bakyt", "kyzdarkan"],
  },
  {
    id: "karylgach",
    name: "Карылгач Маматова",
    gender: "f",
    photo: "photos/Карылгач-Маматова.jpg",
    parents: ["bakyt", "kyzdarkan"],
  },

  {
    id: "cholpon",
    name: "Чолпон Осмоналиева",
    gender: "f",
    born: "10.01.1958",
    photo: "photos/Чолпон-Осмоналиева.jpg",
    parents: ["zhanibek-m", "chynar"],
    partners: ["kanybek"],
  },

  // ══ Осмоналиевы ═══════════════════════════════════════════
  {
    id: "nuraly",
    name: "Нуралы Осмоналиев",
    gender: "m",
    partners: ["buraila"],
  },
  {
    id: "buraila",
    name: "Бурайла Садыкова",
    gender: "f",
    born: "1936",
    photo: "photos/Бурайла-Садыкова.jpg",
  },

  {
    id: "kanybek",
    name: "Каныбек Осмоналиев",
    gender: "m",
    born: "23.03.1959",
    photo: "photos/Каныбек-Осмоналиев.jpg",
    parents: ["nuraly", "buraila"],
  },
  {
    id: "zarina",
    name: "Зарина Осмоналиева",
    gender: "f",
    born: "21.05.1982",
    photo: "photos/Зарина-Осмоналиева.jpg",
    parents: ["cholpon", "kanybek"],
  },
  {
    id: "sagyn",
    name: "Сагын Осмоналиев",
    gender: "m",
    born: "24.12.1993",
    photo: "photos/Сагын-Осмоналиев.jpg",
    parents: ["cholpon", "kanybek"],
  },

  // Гульмира + Койчун
  {
    id: "gulmira",
    name: "Гульмира Осмоналиева",
    gender: "f",
    born: "1963",
    photo: "photos/Гульмира-Осомналиева.jpg",
    parents: ["nuraly", "buraila"],
    partners: ["koichun"],
  },
  {
    id: "koichun",
    name: "Койчун Эрмекбаев",
    gender: "m",
    born: "1963",
    photo: "photos/Койчун-Эрмекбаев.jpg",
  },

  {
    id: "sapar",
    name: "Сапар Эрмекбаев",
    gender: "m",
    photo: "photos/Сапар-Эрмекбаев.jpg",
    parents: ["gulmira", "koichun"],
    partners: ["nurjamal"],
  },
  { id: "nurjamal", name: "Нуржамал Ахматова", gender: "f", photo: "photos/Нуржамал-Ахметова.jpg" },
  {
    id: "nursultan",
    name: "Нурсултан Бектурганов",
    gender: "m",
    photo: "photos/Нурсултан-Бектурганов.jpg",
    parents: ["sapar", "nurjamal"],
  },
  {
    id: "almaz",
    name: "Алмаз Бектурганов",
    gender: "m",
    photo: "photos/Алмаз-Бектурганов.jpg",
    parents: ["sapar", "nurjamal"],
  },
  {
    id: "asylzat",
    name: "Асылзат Бектурганова",
    gender: "f",
    photo: "photos/Асылзат Бектурганова.jpg",
    parents: ["sapar", "nurjamal"],
  },
  {
    id: "aruuzat",
    name: "Аруузат Бектурганова",
    gender: "f",
    photo: "photos/Аруузат Бектурганова.jpg",
    parents: ["sapar", "nurjamal"],
  },

  {
    id: "ziyara",
    name: "Зияра Эрмекбаева",
    gender: "f",
    photo: "photos/Зияра-Эрмекбаева.jpg",
    parents: ["gulmira", "koichun"],
    partners: ["ziyara-spouse"],
  },
  { id: "ziyara-spouse", name: "Күйөөсү", gender: "m", extra: "аты белгисиз" },
  {
    id: "asiya",
    name: "Асия Салыбаева",
    gender: "f",
    photo: "photos/Асия-Салыбаева.jpg",
    parents: ["ziyara", "ziyara-spouse"],
  },
  {
    id: "aslan",
    name: "Аслан Жусупмаматов",
    gender: "m",
    parents: ["ziyara", "ziyara-spouse"],
  },

  {
    id: "mairambek",
    name: "Майрамбек Бектурганов",
    gender: "m",
    photo: "photos/Майрамбек-Бектурганов.jpg",
    parents: ["gulmira", "koichun"],
    partners: ["aiperi-s"],
  },
  {
    id: "aiperi-s",
    name: "Айпери Акбиева",
    gender: "f",
    photo: "photos/Айпери-Акбиева.jpg",
  },
  {
    id: "erulan",
    name: "Эрулан Бектурганов",
    gender: "m",
    photo: "photos/Эрулан-Бектурганов.jpg",
    parents: ["mairambek", "aiperi-s"],
  },

  {
    id: "aiperi",
    name: "Айпери Бектурганова",
    gender: "f",
    photo: "photos/Айпери-Бектурганова.jpg",
    parents: ["gulmira", "koichun"],
    partners: ["omurbek"],
  },
  { id: "omurbek", name: "Өмүрбек", gender: "m", photo: "photos/Өмүрбек.jpg" },

  // Жаныбек + Роза
  {
    id: "zhanibek-o",
    name: "Жаныбек Осмоналиев",
    gender: "m",
    born: "1960",
    photo: "photos/Жаныбек-Осмоналиев.jpg",
    parents: ["nuraly", "buraila"],
    partners: ["roza"],
  },
  { id: "roza", name: "Роза Осмоналиева", gender: "f", born: "1963" },

  {
    id: "dinara",
    name: "Динара Осмоналиева",
    gender: "f",
    parents: ["zhanibek-o", "roza"],
    partners: ["zamir"],
  },
  { id: "zamir", name: "Замир", gender: "m" },
  { id: "emir", name: "Эмир", gender: "m", parents: ["dinara", "zamir"] },
  { id: "rayana", name: "Раяна", gender: "f", parents: ["dinara", "zamir"] },
  { id: "taberis", name: "Таберис", gender: "f", parents: ["dinara", "zamir"] },

  {
    id: "nurbek",
    name: "Нурбек Осмоналиев",
    gender: "m",
    parents: ["zhanibek-o", "roza"],
    partners: ["saikal"],
  },
  { id: "saikal", name: "Сайкал", gender: "f" },
  {
    id: "islam",
    name: "Ислам Осмоналиев",
    gender: "m",
    parents: ["nurbek", "saikal"],
  },
  {
    id: "aibiike",
    name: "Айбийке Осмоналиева",
    gender: "f",
    parents: ["nurbek", "saikal"],
  },

  {
    id: "nurgazy",
    name: "Нургазы Осмоналиев",
    gender: "m",
    photo: "photos/Нургазы-Осмоналиев.jpg",
    parents: ["zhanibek-o", "roza"],
    partners: ["perizat"],
  },
  { id: "perizat", name: "Перизат Салиева", gender: "f", photo: "photos/Перизат-Салиева.jpg" },
  {
    id: "elman",
    name: "Эльман Осмоналиев",
    gender: "m",
    photo: "photos/Эльман-Осмоналиев.jpg",
    parents: ["nurgazy", "perizat"],
  },
  {
    id: "kutman",
    name: "Кутман Осмоналиев",
    gender: "m",
    photo: "photos/Кутман-Осмоналиев.jpg",
    parents: ["nurgazy", "perizat"],
  },
  {
    id: "salman",
    name: "Салман Осмоналиев",
    gender: "m",
    photo: "photos/Салман-Осмоналиев.jpg",
    parents: ["nurgazy", "perizat"],
  },

  {
    id: "chynara",
    name: "Чынара Осмоналиева",
    gender: "f",
    parents: ["zhanibek-o", "roza"],
  },
  {
    id: "dastan",
    name: "Дастан Осмоналиев",
    gender: "m",
    parents: ["zhanibek-o", "roza"],
  },

  // Эльмира + Медер
  {
    id: "elmira",
    name: "Эльмира Осмоналиева",
    gender: "f",
    photo: "photos/Эльмира-Осмоналиева.jpg",
    parents: ["nuraly", "buraila"],
    partners: ["mederbek"],
  },
  {
    id: "mederbek",
    name: "Медер Аканов",
    gender: "m",
    photo: "photos/Медер-Аканов.jpg",
  },

  {
    id: "nazgul",
    name: "Назгуль Аканова",
    gender: "f",
    photo: "photos/Назгуль-Аканова.JPG",
    parents: ["elmira", "mederbek"],
    partners: ["chubak"],
  },
  { id: "chubak", name: "Чубак Жангазиев", gender: "m", photo: "photos/Чубак-Жангазиев.jpg" },
  {
    id: "ramilya",
    name: "Рамиля Жангазиева",
    gender: "f",
    photo: "photos/Рамиля-Жангазиева.jpg",
    parents: ["nazgul", "chubak"],
  },
  {
    id: "altynai",
    name: "Алтынай Жангазиева",
    gender: "f",
    photo: "photos/Алтынай-Жангазиева.jpg",
    parents: ["nazgul", "chubak"],
  },
  {
    id: "begimai",
    name: "Бегимай Жангазиева",
    gender: "f",
    photo: "photos/Бегимай-Жангазиева.jpg",
    parents: ["nazgul", "chubak"],
  },

  {
    id: "asel",
    name: "Асель Аканова",
    gender: "f",
    photo: "photos/Асель-Аканова.JPG",
    parents: ["elmira", "mederbek"],
    partners: ["daniyar"],
  },
  { id: "daniyar", name: "Данияр Памирбек уулу", gender: "m", photo: "photos/Данияр-Памирбек-уулу.jpg" },
  {
    id: "abdullah",
    name: "Абдуллах Памирбеков",
    gender: "m",
    photo: "photos/Абдуллах-Памирбеков.jpg",
    parents: ["asel", "daniyar"],
  },
  {
    id: "anisa",
    name: "Аниса Памирбекова",
    gender: "f",
    photo: "photos/Аниса-Памирбекова.jpg",
    parents: ["asel", "daniyar"],
  },
  {
    id: "iskhak",
    name: "Исхак Памирбеков",
    gender: "m",
    photo: "photos/Исхак-Памирбеков.jpg",
    parents: ["asel", "daniyar"],
  },

  {
    id: "bekbol",
    name: "Бекбол Аканов",
    gender: "m",
    parents: ["elmira", "mederbek"],
  },

  // Айнура + Рыспек
  {
    id: "ainura",
    name: "Айнура Осмоналиева",
    gender: "f",
    photo: "photos/Айнура-Осмоналиева.JPG",
    parents: ["nuraly", "buraila"],
    partners: ["ryspek"],
  },
  { id: "ryspek", name: "Рыспек Айтикеев", gender: "m", photo: "photos/Рыспек-Айтикеев.jpg" },
  {
    id: "aliya",
    name: "Алия Айтикеева",
    gender: "f",
    parents: ["ainura", "ryspek"],
    partners: ["adilet"],
  },
  { id: "adilet", name: "Адилет", gender: "m" },
  {
    id: "galiya",
    name: "Галия Айтикеева",
    gender: "f",
    photo: "photos/Галия-Айтикеева.jpg",
    parents: ["ainura", "ryspek"],
    partners: ["myrzabek"],
  },
  { id: "myrzabek", name: "Мырзабек", gender: "m", photo: "photos/Мырзабек.jpg" },
  {
    id: "murat",
    name: "Мурат Бейшенов",
    gender: "m",
    photo: "photos/Мурат-Бейшенов.jpg",
    parents: ["ainura", "ryspek"],
  },

  {
    id: "zhanysh",
    name: "Жаныш Осмоналиев",
    gender: "m",
    photo: "photos/Жаныш-Осмоналиев.jpg",
    parents: ["nuraly", "buraila"],
  },
];
