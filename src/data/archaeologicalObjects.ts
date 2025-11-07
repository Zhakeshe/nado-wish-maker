export interface ArchaeologicalObject {
  id: string;
  name: string;
  nameKz: string;
  nameEn: string;
  description: string;
  descriptionKz: string;
  descriptionEn: string;
  era: string;
  eraKz: string;
  eraEn: string;
  region: string;
  coordinates: [number, number];
  points: number;
  modelUrl?: string;
  imageUrl?: string;
  facts: string[];
  factsKz: string[];
  factsEn: string[];
}

export const archaeologicalObjects: ArchaeologicalObject[] = [
  {
    id: "botai",
    name: "Ботайская культура",
    nameKz: "Ботай мәдениеті",
    nameEn: "Botai Culture",
    description: "Древнейшее поселение, где впервые одомашнили лошадь (3500 г. до н.э.)",
    descriptionKz: "Жылқыны қолға үйреткен ең көне қоныс (б.з.д. 3500 ж.)",
    descriptionEn: "Ancient settlement where horses were first domesticated (3500 BCE)",
    era: "Энеолит",
    eraKz: "Энеолит",
    eraEn: "Eneolithic",
    region: "Акмолинская область",
    coordinates: [69.7, 53.5],
    points: 15,
    imageUrl: "/placeholder.svg",
    facts: [
      "Древнейший центр одомашнивания лошади в мире",
      "Найдены остатки более 300 жилищ",
      "Возраст находок - около 5500 лет"
    ],
    factsKz: [
      "Әлемдегі жылқыны қолға үйретудің ең көне орталығы",
      "300-ден астам тұрғын үй қалдықтары табылды",
      "Табылымдардың жасы - 5500 жылдай"
    ],
    factsEn: [
      "World's oldest center of horse domestication",
      "Remains of over 300 dwellings found",
      "Artifacts are about 5500 years old"
    ]
  },
  {
    id: "berel",
    name: "Берел",
    nameKz: "Берел",
    nameEn: "Berel",
    description: "Царские курганы пазырыкской культуры с мумифицированными лошадьми",
    descriptionKz: "Мумияланған жылқылары бар пазырык мәдениетінің патшалық обалары",
    descriptionEn: "Royal burial mounds of Pazyryk culture with mummified horses",
    era: "V-III вв. до н.э.",
    eraKz: "б.з.д. V-III ғ.",
    eraEn: "5th-3rd centuries BCE",
    region: "Восточно-Казахстанская область",
    coordinates: [85.5, 49.2],
    points: 20,
    imageUrl: "/placeholder.svg",
    facts: [
      "Найдено 13 мумифицированных лошадей",
      "Сохранились татуировки на коже",
      "Обнаружены золотые украшения скифского периода"
    ],
    factsKz: [
      "13 мумияланған жылқы табылды",
      "Теріде татуировкалар сақталған",
      "Скиф кезеңінің алтын әшекей бұйымдары табылды"
    ],
    factsEn: [
      "13 mummified horses discovered",
      "Tattoos preserved on skin",
      "Scythian gold ornaments found"
    ]
  },
  {
    id: "turkistan",
    name: "Мавзолей Ходжи Ахмеда Ясави",
    nameKz: "Қожа Ахмет Ясауи кесенесі",
    nameEn: "Mausoleum of Khoja Ahmed Yasawi",
    description: "Архитектурный шедевр XIV века, построенный по приказу Тимура",
    descriptionKz: "Әмір Темірдің бұйрығымен салынған XIV ғасырдың сәулет өнерінің шедеврі",
    descriptionEn: "14th century architectural masterpiece built by order of Timur",
    era: "XIV век",
    eraKz: "XIV ғасыр",
    eraEn: "14th century",
    region: "Туркестанская область",
    coordinates: [68.26, 43.30],
    points: 10,
    imageUrl: "/placeholder.svg",
    facts: [
      "Включён в список Всемирного наследия ЮНЕСКО",
      "Купол высотой 44 метра",
      "Построен из обожжённого кирпича"
    ],
    factsKz: [
      "ЮНЕСКО-ның Дүниежүзілік мұра тізіміне енгізілген",
      "Күмбездің биіктігі 44 метр",
      "Күйдірілген кірпіштен салынған"
    ],
    factsEn: [
      "UNESCO World Heritage Site",
      "44-meter high dome",
      "Built from fired brick"
    ]
  },
  {
    id: "otrar",
    name: "Отрар",
    nameKz: "Отырар",
    nameEn: "Otrar",
    description: "Древний город на Великом Шёлковом пути, разрушенный монголами в 1219 году",
    descriptionKz: "1219 жылы моңғолдар қиратқан Ұлы Жібек жолындағы көне қала",
    descriptionEn: "Ancient city on the Silk Road destroyed by Mongols in 1219",
    era: "VIII-XVIII вв.",
    eraKz: "VIII-XVIII ғғ.",
    eraEn: "8th-18th centuries",
    region: "Туркестанская область",
    coordinates: [68.33, 42.90],
    points: 15,
    imageUrl: "/placeholder.svg",
    facts: [
      "Родина великого учёного аль-Фараби",
      "Крупнейший торговый центр Средней Азии",
      "Площадь городища - более 200 гектаров"
    ],
    factsKz: [
      "Ұлы ғалым Әл-Фарабидің туған жері",
      "Орта Азияның ірі сауда орталығы",
      "Қала орнының көлемі - 200 гектардан астам"
    ],
    factsEn: [
      "Birthplace of great scholar al-Farabi",
      "Major trading center of Central Asia",
      "Site area exceeds 200 hectares"
    ]
  },
  {
    id: "tamgaly",
    name: "Тамгалы",
    nameKz: "Таңбалы",
    nameEn: "Tamgaly",
    description: "Петроглифы бронзового века - древнейшие наскальные рисунки",
    descriptionKz: "Қола дәуірінің петроглифтері - ең көне жартас суреттері",
    descriptionEn: "Bronze Age petroglyphs - ancient rock carvings",
    era: "XIV-VIII вв. до н.э.",
    eraKz: "б.з.д. XIV-VIII ғғ.",
    eraEn: "14th-8th centuries BCE",
    region: "Алматинская область",
    coordinates: [75.58, 43.80],
    points: 10,
    imageUrl: "/placeholder.svg",
    facts: [
      "Более 5000 древних рисунков",
      "Объект Всемирного наследия ЮНЕСКО",
      "Изображения солнечных божеств и шаманов"
    ],
    factsKz: [
      "5000-нан астам көне сурет",
      "ЮНЕСКО-ның Дүниежүзілік мұра нысаны",
      "Күн құдайлары мен бақсылардың бейнелері"
    ],
    factsEn: [
      "Over 5000 ancient drawings",
      "UNESCO World Heritage Site",
      "Images of solar deities and shamans"
    ]
  },
  {
    id: "golden-man",
    name: "Золотой человек",
    nameKz: "Алтын адам",
    nameEn: "Golden Man",
    description: "Курган Иссык - захоронение сакского воина в золотых доспехах",
    descriptionKz: "Ысық обасы - алтын сауытты сақ жауынгерінің қорымы",
    descriptionEn: "Issyk Kurgan - burial of a Saka warrior in golden armor",
    era: "V-IV вв. до н.э.",
    eraKz: "б.з.д. V-IV ғғ.",
    eraEn: "5th-4th centuries BCE",
    region: "Алматинская область",
    coordinates: [77.55, 43.35],
    points: 20,
    imageUrl: "/placeholder.svg",
    facts: [
      "4000 золотых украшений на доспехах",
      "Национальный символ Казахстана",
      "Возраст захоронения - 2500 лет"
    ],
    factsKz: [
      "Сауытта 4000 алтын әшекей",
      "Қазақстанның ұлттық рәмізі",
      "Қорымның жасы - 2500 жыл"
    ],
    factsEn: [
      "4000 gold ornaments on armor",
      "National symbol of Kazakhstan",
      "2500 years old burial"
    ]
  }
];

export const regions = [
  { name: "Акмолинская область", nameKz: "Ақмола облысы", nameEn: "Akmola Region", coordinates: [71.5, 51.5] as [number, number] },
  { name: "Алматинская область", nameKz: "Алматы облысы", nameEn: "Almaty Region", coordinates: [77.0, 44.0] as [number, number] },
  { name: "Восточно-Казахстанская область", nameKz: "Шығыс Қазақстан облысы", nameEn: "East Kazakhstan Region", coordinates: [81.0, 49.5] as [number, number] },
  { name: "Туркестанская область", nameKz: "Түркістан облысы", nameEn: "Turkistan Region", coordinates: [68.5, 43.0] as [number, number] },
  { name: "Атырауская область", nameKz: "Атырау облысы", nameEn: "Atyrau Region", coordinates: [51.9, 47.1] as [number, number] },
  { name: "Западно-Казахстанская область", nameKz: "Батыс Қазақстан облысы", nameEn: "West Kazakhstan Region", coordinates: [51.6, 50.3] as [number, number] },
  { name: "Жамбылская область", nameKz: "Жамбыл облысы", nameEn: "Jambyl Region", coordinates: [73.0, 43.5] as [number, number] },
  { name: "Карагандинская область", nameKz: "Қарағанды облысы", nameEn: "Karaganda Region", coordinates: [73.0, 48.0] as [number, number] },
  { name: "Костанайская область", nameKz: "Қостанай облысы", nameEn: "Kostanay Region", coordinates: [63.6, 53.2] as [number, number] },
  { name: "Мангистауская область", nameKz: "Маңғыстау облысы", nameEn: "Mangystau Region", coordinates: [52.5, 44.0] as [number, number] },
  { name: "Павлодарская область", nameKz: "Павлодар облысы", nameEn: "Pavlodar Region", coordinates: [76.9, 52.3] as [number, number] },
  { name: "Северо-Казахстанская область", nameKz: "Солтүстік Қазақстан облысы", nameEn: "North Kazakhstan Region", coordinates: [69.4, 54.5] as [number, number] },
  { name: "Улытауская область", nameKz: "Ұлытау облысы", nameEn: "Ulytau Region", coordinates: [66.5, 48.5] as [number, number] },
  { name: "Абайская область", nameKz: "Абай облысы", nameEn: "Abai Region", coordinates: [79.0, 49.0] as [number, number] },
];
