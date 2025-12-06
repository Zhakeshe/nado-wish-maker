export interface QuizQuestion {
  id: number;
  question: { ru: string; kz: string; en: string };
  options: { ru: string[]; kz: string[]; en: string[] };
  correctIndex: number;
  points: number;
  topic: string;
}

export const quizTopics = {
  bronze_age: { ru: "Бронзовый век", kz: "Қола дәуірі", en: "Bronze Age" },
  iron_age: { ru: "Железный век", kz: "Темір дәуірі", en: "Iron Age" },
  medieval: { ru: "Средневековье", kz: "Орта ғасырлар", en: "Medieval" },
  kazakh_khanate: { ru: "Казахское ханство", kz: "Қазақ хандығы", en: "Kazakh Khanate" },
  archaeology: { ru: "Археология", kz: "Археология", en: "Archaeology" },
  culture: { ru: "Культура", kz: "Мәдениет", en: "Culture" },
  architecture: { ru: "Архитектура", kz: "Сәулет өнері", en: "Architecture" },
  silk_road: { ru: "Шелковый путь", kz: "Жібек жолы", en: "Silk Road" },
  geography: { ru: "География", kz: "География", en: "Geography" },
  traditions: { ru: "Традиции", kz: "Дәстүрлер", en: "Traditions" },
};

export const allQuizQuestions: QuizQuestion[] = [
  // BRONZE AGE (30 questions)
  {
    id: 1,
    topic: "bronze_age",
    question: {
      ru: "К какой эпохе относятся петроглифы Тамгалы?",
      kz: "Тамғалы жартас суреттері қай дәуірге жатады?",
      en: "To which era do the Tamgaly petroglyphs belong?",
    },
    options: {
      ru: ["Неолит", "Бронзовый век", "Железный век", "Средневековье"],
      kz: ["Неолит", "Қола дәуірі", "Темір дәуірі", "Орта ғасырлар"],
      en: ["Neolithic", "Bronze Age", "Iron Age", "Middle Ages"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 2,
    topic: "bronze_age",
    question: {
      ru: "Какая культура существовала на территории Казахстана в бронзовом веке?",
      kz: "Қола дәуірінде Қазақстан аумағында қандай мәдениет болды?",
      en: "Which culture existed in Kazakhstan during the Bronze Age?",
    },
    options: {
      ru: ["Андроновская", "Ботайская", "Сакская", "Тюркская"],
      kz: ["Андронов", "Ботай", "Сақ", "Түрік"],
      en: ["Andronovo", "Botai", "Saka", "Turkic"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 3,
    topic: "bronze_age",
    question: {
      ru: "В каком тысячелетии до н.э. существовала Андроновская культура?",
      kz: "Андронов мәдениеті б.з.д. қай мыңжылдықта болды?",
      en: "In which millennium BC did the Andronovo culture exist?",
    },
    options: {
      ru: ["IV тысячелетие", "III тысячелетие", "II тысячелетие", "I тысячелетие"],
      kz: ["IV мыңжылдық", "III мыңжылдық", "II мыңжылдық", "I мыңжылдық"],
      en: ["4th millennium", "3rd millennium", "2nd millennium", "1st millennium"],
    },
    correctIndex: 2,
    points: 20,
  },
  {
    id: 4,
    topic: "bronze_age",
    question: {
      ru: "Чем занимались люди Андроновской культуры?",
      kz: "Андронов мәдениеті адамдары немен айналысты?",
      en: "What did people of the Andronovo culture do?",
    },
    options: {
      ru: ["Только охота", "Скотоводство и земледелие", "Только рыболовство", "Только собирательство"],
      kz: ["Тек аңшылық", "Мал шаруашылығы мен егіншілік", "Тек балық аулау", "Тек терімшілік"],
      en: ["Only hunting", "Cattle breeding and farming", "Only fishing", "Only gathering"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 5,
    topic: "bronze_age",
    question: {
      ru: "Какой металл впервые начали обрабатывать в бронзовом веке?",
      kz: "Қола дәуірінде алғаш қандай метал өңделе бастады?",
      en: "Which metal was first processed in the Bronze Age?",
    },
    options: {
      ru: ["Железо", "Золото", "Бронза", "Серебро"],
      kz: ["Темір", "Алтын", "Қола", "Күміс"],
      en: ["Iron", "Gold", "Bronze", "Silver"],
    },
    correctIndex: 2,
    points: 10,
  },
  {
    id: 6,
    topic: "bronze_age",
    question: {
      ru: "Где были обнаружены Бегазы-Дандыбаевские памятники?",
      kz: "Бегазы-Дәндібай ескерткіштері қайда табылды?",
      en: "Where were the Begazy-Dandybay monuments found?",
    },
    options: {
      ru: ["Западный Казахстан", "Центральный Казахстан", "Южный Казахстан", "Восточный Казахстан"],
      kz: ["Батыс Қазақстан", "Орталық Қазақстан", "Оңтүстік Қазақстан", "Шығыс Қазақстан"],
      en: ["Western Kazakhstan", "Central Kazakhstan", "Southern Kazakhstan", "Eastern Kazakhstan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 7,
    topic: "bronze_age",
    question: {
      ru: "Что изображено на петроглифах Тамгалы?",
      kz: "Тамғалы жартас суреттерінде не бейнеленген?",
      en: "What is depicted on the Tamgaly petroglyphs?",
    },
    options: {
      ru: ["Только животные", "Только люди", "Солнцеголовые божества и животные", "Только геометрические узоры"],
      kz: ["Тек жануарлар", "Тек адамдар", "Күнбас тәңірлер мен жануарлар", "Тек геометриялық өрнектер"],
      en: ["Only animals", "Only people", "Sun-headed deities and animals", "Only geometric patterns"],
    },
    correctIndex: 2,
    points: 15,
  },
  {
    id: 8,
    topic: "bronze_age",
    question: {
      ru: "Какое жилище было характерно для Андроновской культуры?",
      kz: "Андронов мәдениетіне қандай тұрғын үй тән болды?",
      en: "What type of dwelling was characteristic of the Andronovo culture?",
    },
    options: {
      ru: ["Юрта", "Полуземлянка", "Каменный дом", "Пещера"],
      kz: ["Киіз үй", "Жартылай жер үй", "Тас үй", "Үңгір"],
      en: ["Yurt", "Semi-dugout", "Stone house", "Cave"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 9,
    topic: "bronze_age",
    question: {
      ru: "Какой тип погребения был характерен для Андроновской культуры?",
      kz: "Андронов мәдениетіне қандай жерлеу түрі тән болды?",
      en: "What type of burial was characteristic of the Andronovo culture?",
    },
    options: {
      ru: ["Кремация", "Курганные захоронения", "Мумификация", "Воздушное погребение"],
      kz: ["Өртеу", "Қорған қорымдары", "Мумиялау", "Ауа арқылы жерлеу"],
      en: ["Cremation", "Kurgan burials", "Mummification", "Sky burial"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 10,
    topic: "bronze_age",
    question: {
      ru: "Каким было основное занятие населения эпохи бронзы?",
      kz: "Қола дәуірі халқының негізгі кәсібі қандай болды?",
      en: "What was the main occupation of the Bronze Age population?",
    },
    options: {
      ru: ["Торговля", "Скотоводство", "Рыболовство", "Ремесло"],
      kz: ["Сауда", "Мал шаруашылығы", "Балық аулау", "Қолөнер"],
      en: ["Trade", "Cattle breeding", "Fishing", "Craft"],
    },
    correctIndex: 1,
    points: 10,
  },

  // IRON AGE / SAKAS (30 questions)
  {
    id: 11,
    topic: "iron_age",
    question: {
      ru: "Где был найден Золотой человек?",
      kz: "Алтын адам қайда табылды?",
      en: "Where was the Golden Man found?",
    },
    options: {
      ru: ["Курган Иссык", "Курган Берел", "Курган Шиликты", "Курган Бесшатыр"],
      kz: ["Есік қорғаны", "Берел қорғаны", "Шілікті қорғаны", "Бесшатыр қорғаны"],
      en: ["Issyk Kurgan", "Berel Kurgan", "Shilikty Kurgan", "Besshatyr Kurgan"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 12,
    topic: "iron_age",
    question: {
      ru: "Какое племя создало сакскую культуру?",
      kz: "Сақ мәдениетін қай тайпа қалыптастырды?",
      en: "Which tribe created the Saka culture?",
    },
    options: {
      ru: ["Гунны", "Саки", "Усуни", "Кангюй"],
      kz: ["Ғұндар", "Сақтар", "Үйсіндер", "Қаңлылар"],
      en: ["Huns", "Sakas", "Wusun", "Kangju"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 13,
    topic: "iron_age",
    question: {
      ru: "Какой материал использовался для изготовления Золотого человека?",
      kz: "Алтын адамды жасау үшін қандай материал қолданылды?",
      en: "What material was used to make the Golden Man?",
    },
    options: {
      ru: ["Чистое золото", "Позолоченная бронза", "Золотая фольга", "Электрум"],
      kz: ["Таза алтын", "Алтынмен қапталған қола", "Алтын фольга", "Электрум"],
      en: ["Pure gold", "Gilded bronze", "Gold foil", "Electrum"],
    },
    correctIndex: 2,
    points: 25,
  },
  {
    id: 14,
    topic: "iron_age",
    question: {
      ru: "Как называли саков греческие историки?",
      kz: "Грек тарихшылары сақтарды қалай атаған?",
      en: "What did Greek historians call the Sakas?",
    },
    options: {
      ru: ["Массагеты", "Скифы", "Парфяне", "Персы"],
      kz: ["Массагеттер", "Скифтер", "Парфиялықтар", "Парсылар"],
      en: ["Massagetae", "Scythians", "Parthians", "Persians"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 15,
    topic: "iron_age",
    question: {
      ru: "В каком веке жили саки?",
      kz: "Сақтар қай ғасырда өмір сүрді?",
      en: "In which century did the Sakas live?",
    },
    options: {
      ru: ["X-V вв. до н.э.", "VII-III вв. до н.э.", "I-V вв. н.э.", "X-XV вв. н.э."],
      kz: ["Б.з.д. X-V ғғ.", "Б.з.д. VII-III ғғ.", "Б.з. I-V ғғ.", "Б.з. X-XV ғғ."],
      en: ["10th-5th c. BC", "7th-3rd c. BC", "1st-5th c. AD", "10th-15th c. AD"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 16,
    topic: "iron_age",
    question: {
      ru: "Что символизировал звериный стиль у саков?",
      kz: "Сақтарда аң стилі нені білдірді?",
      en: "What did the animal style symbolize for the Sakas?",
    },
    options: {
      ru: ["Просто украшение", "Силу и власть", "Религиозное верование", "Торговые связи"],
      kz: ["Жай ғана әшекей", "Күш пен билік", "Діни сенім", "Сауда байланыстары"],
      en: ["Just decoration", "Power and authority", "Religious belief", "Trade connections"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 17,
    topic: "iron_age",
    question: {
      ru: "Какая царица саков победила персидского царя Кира?",
      kz: "Қай сақ патшайымы парсы патшасы Кирді жеңді?",
      en: "Which Saka queen defeated Persian King Cyrus?",
    },
    options: {
      ru: ["Зарина", "Томирис", "Амага", "Спаретра"],
      kz: ["Зарина", "Томирис", "Амага", "Спаретра"],
      en: ["Zarina", "Tomyris", "Amaga", "Sparetra"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 18,
    topic: "iron_age",
    question: {
      ru: "Сколько золотых изделий было найдено в кургане Иссык?",
      kz: "Есік қорғанынан неше алтын бұйым табылды?",
      en: "How many gold items were found in the Issyk kurgan?",
    },
    options: {
      ru: ["Около 1000", "Около 4000", "Около 100", "Около 500"],
      kz: ["Шамамен 1000", "Шамамен 4000", "Шамамен 100", "Шамамен 500"],
      en: ["About 1000", "About 4000", "About 100", "About 500"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 19,
    topic: "iron_age",
    question: {
      ru: "Где расположены Бесшатырские курганы?",
      kz: "Бесшатыр қорғандары қайда орналасқан?",
      en: "Where are the Besshatyr kurgans located?",
    },
    options: {
      ru: ["Алматинская область", "Жетысу", "Мангистау", "Туркестанская область"],
      kz: ["Алматы облысы", "Жетісу", "Маңғыстау", "Түркістан облысы"],
      en: ["Almaty region", "Zhetysu", "Mangystau", "Turkestan region"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 20,
    topic: "iron_age",
    question: {
      ru: "Что такое курган?",
      kz: "Қорған дегеніміз не?",
      en: "What is a kurgan?",
    },
    options: {
      ru: ["Жилище", "Погребальный холм", "Крепость", "Храм"],
      kz: ["Тұрғын үй", "Жерлеу төбесі", "Қамал", "Храм"],
      en: ["Dwelling", "Burial mound", "Fortress", "Temple"],
    },
    correctIndex: 1,
    points: 10,
  },

  // MEDIEVAL (30 questions)
  {
    id: 21,
    topic: "medieval",
    question: {
      ru: "В каком веке был построен мавзолей Ходжи Ахмеда Ясави?",
      kz: "Қожа Ахмет Яссауи кесенесі қай ғасырда салынды?",
      en: "In which century was the Mausoleum of Khoja Ahmed Yasawi built?",
    },
    options: {
      ru: ["XII век", "XIV век", "XVI век", "XVIII век"],
      kz: ["XII ғасыр", "XIV ғасыр", "XVI ғасыр", "XVIII ғасыр"],
      en: ["12th century", "14th century", "16th century", "18th century"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 22,
    topic: "medieval",
    question: {
      ru: "Кто построил мавзолей Ходжи Ахмеда Ясави?",
      kz: "Қожа Ахмет Яссауи кесенесін кім салдырды?",
      en: "Who built the Mausoleum of Khoja Ahmed Yasawi?",
    },
    options: {
      ru: ["Чингисхан", "Тимур (Тамерлан)", "Бабур", "Шах Джахан"],
      kz: ["Шыңғыс хан", "Темірлан", "Бабыр", "Шах Жахан"],
      en: ["Genghis Khan", "Timur (Tamerlane)", "Babur", "Shah Jahan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 23,
    topic: "medieval",
    question: {
      ru: "Какой памятник входит в список Всемирного наследия ЮНЕСКО?",
      kz: "Қай ескерткіш ЮНЕСКО-ның Дүниежүзілік мұра тізіміне кіреді?",
      en: "Which monument is on the UNESCO World Heritage List?",
    },
    options: {
      ru: ["Байконур", "Мавзолей Ходжи Ахмеда Ясави", "Медеу", "Чарынский каньон"],
      kz: ["Байқоңыр", "Қожа Ахмет Яссауи кесенесі", "Медеу", "Шарын шатқалы"],
      en: ["Baikonur", "Mausoleum of Khoja Ahmed Yasawi", "Medeu", "Charyn Canyon"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 24,
    topic: "medieval",
    question: {
      ru: "Что символизирует балбал в тюркской культуре?",
      kz: "Түркі мәдениетінде балбал нені бейнелейді?",
      en: "What does balbal symbolize in Turkic culture?",
    },
    options: {
      ru: ["Божество", "Поверженного врага", "Священное животное", "Небесный дух"],
      kz: ["Құдай", "Жеңілген жауды", "Қасиетті жануарды", "Аспан рухы"],
      en: ["Deity", "Defeated enemy", "Sacred animal", "Heavenly spirit"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 25,
    topic: "medieval",
    question: {
      ru: "В каком веке существовал Тюркский каганат?",
      kz: "Түрік қағанаты қай ғасырда болды?",
      en: "In which century did the Turkic Khaganate exist?",
    },
    options: {
      ru: ["III-IV вв.", "VI-VIII вв.", "X-XII вв.", "XIII-XV вв."],
      kz: ["III-IV ғғ.", "VI-VIII ғғ.", "X-XII ғғ.", "XIII-XV ғғ."],
      en: ["3rd-4th c.", "6th-8th c.", "10th-12th c.", "13th-15th c."],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 26,
    topic: "medieval",
    question: {
      ru: "Какой город был столицей Казахского ханства?",
      kz: "Қазақ хандығының астанасы қай қала болды?",
      en: "What city was the capital of the Kazakh Khanate?",
    },
    options: {
      ru: ["Алматы", "Туркестан", "Сарайчик", "Отрар"],
      kz: ["Алматы", "Түркістан", "Сарайшық", "Отырар"],
      en: ["Almaty", "Turkestan", "Saraichik", "Otrar"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 27,
    topic: "medieval",
    question: {
      ru: "Кто был первым ханом Казахского ханства?",
      kz: "Қазақ хандығының алғашқы ханы кім болды?",
      en: "Who was the first khan of the Kazakh Khanate?",
    },
    options: {
      ru: ["Абылай хан", "Керей и Жанибек", "Касым хан", "Тауке хан"],
      kz: ["Абылай хан", "Керей мен Жәнібек", "Қасым хан", "Тәуке хан"],
      en: ["Abylai Khan", "Kerey and Zhanibek", "Kasym Khan", "Tauke Khan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 28,
    topic: "medieval",
    question: {
      ru: "В каком году образовалось Казахское ханство?",
      kz: "Қазақ хандығы қай жылы құрылды?",
      en: "In what year was the Kazakh Khanate formed?",
    },
    options: {
      ru: ["1465", "1520", "1380", "1600"],
      kz: ["1465", "1520", "1380", "1600"],
      en: ["1465", "1520", "1380", "1600"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 29,
    topic: "medieval",
    question: {
      ru: "Какой закон принял хан Тауке?",
      kz: "Тәуке хан қандай заң қабылдады?",
      en: "What law did Khan Tauke adopt?",
    },
    options: {
      ru: ["Жеты Жаргы", "Русская Правда", "Конституция", "Ясса"],
      kz: ["Жеті Жарғы", "Орыс Правдасы", "Конституция", "Жаса"],
      en: ["Zhety Zhargy", "Russian Truth", "Constitution", "Yassa"],
    },
    correctIndex: 0,
    points: 25,
  },
  {
    id: 30,
    topic: "medieval",
    question: {
      ru: "Что означает слово \"казах\"?",
      kz: "\"Қазақ\" сөзі нені білдіреді?",
      en: "What does the word 'Kazakh' mean?",
    },
    options: {
      ru: ["Воин", "Свободный человек", "Кочевник", "Охотник"],
      kz: ["Жауынгер", "Еркін адам", "Көшпенді", "Аңшы"],
      en: ["Warrior", "Free person", "Nomad", "Hunter"],
    },
    correctIndex: 1,
    points: 15,
  },

  // CULTURE & TRADITIONS (30 questions)
  {
    id: 31,
    topic: "culture",
    question: {
      ru: "Что такое домбра?",
      kz: "Домбыра дегеніміз не?",
      en: "What is a dombra?",
    },
    options: {
      ru: ["Вид оружия", "Музыкальный инструмент", "Традиционное блюдо", "Вид одежды"],
      kz: ["Қару түрі", "Музыкалық аспап", "Дәстүрлі тағам", "Киім түрі"],
      en: ["A type of weapon", "Musical instrument", "Traditional dish", "Type of clothing"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 32,
    topic: "culture",
    question: {
      ru: "Сколько струн у домбры?",
      kz: "Домбырада неше ішек бар?",
      en: "How many strings does a dombra have?",
    },
    options: {
      ru: ["Одна", "Две", "Три", "Четыре"],
      kz: ["Бір", "Екі", "Үш", "Төрт"],
      en: ["One", "Two", "Three", "Four"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 33,
    topic: "culture",
    question: {
      ru: "Что такое бешбармак?",
      kz: "Бесбармақ дегеніміз не?",
      en: "What is beshbarmak?",
    },
    options: {
      ru: ["Танец", "Национальное блюдо", "Музыкальный инструмент", "Вид спорта"],
      kz: ["Би", "Ұлттық тағам", "Музыкалық аспап", "Спорт түрі"],
      en: ["Dance", "National dish", "Musical instrument", "Sport"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 34,
    topic: "culture",
    question: {
      ru: "Что означает слово \"бесбармак\"?",
      kz: "\"Бесбармақ\" сөзі нені білдіреді?",
      en: "What does 'beshbarmak' mean?",
    },
    options: {
      ru: ["Пять пальцев", "Большой котел", "Вкусное мясо", "Праздничный стол"],
      kz: ["Бес саусақ", "Үлкен қазан", "Дәмді ет", "Мерекелік дастархан"],
      en: ["Five fingers", "Big pot", "Tasty meat", "Festive table"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 35,
    topic: "culture",
    question: {
      ru: "Что такое юрта?",
      kz: "Киіз үй дегеніміз не?",
      en: "What is a yurt?",
    },
    options: {
      ru: ["Каменный дом", "Переносное жилище кочевников", "Крепость", "Храм"],
      kz: ["Тас үй", "Көшпенділердің көшпелі тұрғын үйі", "Қамал", "Храм"],
      en: ["Stone house", "Portable dwelling of nomads", "Fortress", "Temple"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 36,
    topic: "culture",
    question: {
      ru: "Из чего делается войлок для юрты?",
      kz: "Киіз үйге арналған киіз неден жасалады?",
      en: "What is the felt for yurt made of?",
    },
    options: {
      ru: ["Хлопок", "Овечья шерсть", "Шелк", "Лен"],
      kz: ["Мақта", "Қой жүні", "Жібек", "Зығыр"],
      en: ["Cotton", "Sheep wool", "Silk", "Linen"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 37,
    topic: "traditions",
    question: {
      ru: "Что такое Наурыз?",
      kz: "Наурыз дегеніміз не?",
      en: "What is Nauryz?",
    },
    options: {
      ru: ["Праздник нового года", "День независимости", "Религиозный праздник", "День рождения"],
      kz: ["Жаңа жыл мерекесі", "Тәуелсіздік күні", "Діни мереке", "Туған күн"],
      en: ["New Year holiday", "Independence Day", "Religious holiday", "Birthday"],
    },
    correctIndex: 0,
    points: 10,
  },
  {
    id: 38,
    topic: "traditions",
    question: {
      ru: "Когда празднуется Наурыз?",
      kz: "Наурыз қашан тойланады?",
      en: "When is Nauryz celebrated?",
    },
    options: {
      ru: ["1 января", "21 марта", "16 декабря", "9 мая"],
      kz: ["1 қаңтар", "21 наурыз", "16 желтоқсан", "9 мамыр"],
      en: ["January 1", "March 21", "December 16", "May 9"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 39,
    topic: "traditions",
    question: {
      ru: "Что такое Наурыз-коже?",
      kz: "Наурыз көже дегеніміз не?",
      en: "What is Nauryz-kozhe?",
    },
    options: {
      ru: ["Одежда", "Традиционный напиток/блюдо", "Музыка", "Игра"],
      kz: ["Киім", "Дәстүрлі сусын/тағам", "Музыка", "Ойын"],
      en: ["Clothing", "Traditional drink/dish", "Music", "Game"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 40,
    topic: "traditions",
    question: {
      ru: "Сколько компонентов в Наурыз-коже?",
      kz: "Наурыз көжеде неше компонент бар?",
      en: "How many components are in Nauryz-kozhe?",
    },
    options: {
      ru: ["3", "5", "7", "9"],
      kz: ["3", "5", "7", "9"],
      en: ["3", "5", "7", "9"],
    },
    correctIndex: 2,
    points: 20,
  },

  // GEOGRAPHY (20 questions)
  {
    id: 41,
    topic: "geography",
    question: {
      ru: "Какое место Казахстан занимает по площади в мире?",
      kz: "Қазақстан аумағы бойынша әлемде нешінші орында?",
      en: "What place does Kazakhstan take by area in the world?",
    },
    options: {
      ru: ["5-е", "9-е", "12-е", "15-е"],
      kz: ["5-ші", "9-шы", "12-ші", "15-ші"],
      en: ["5th", "9th", "12th", "15th"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 42,
    topic: "geography",
    question: {
      ru: "Какая самая высокая гора Казахстана?",
      kz: "Қазақстанның ең биік тауы қайсы?",
      en: "What is the highest mountain in Kazakhstan?",
    },
    options: {
      ru: ["Хан-Тенгри", "Пик Талгар", "Белуха", "Мынжылки"],
      kz: ["Хан Тәңірі", "Талғар шыңы", "Белуха", "Мыңжылқы"],
      en: ["Khan Tengri", "Talgar Peak", "Belukha", "Mynzhylky"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 43,
    topic: "geography",
    question: {
      ru: "Какое озеро является самым большим в Казахстане?",
      kz: "Қазақстандағы ең үлкен көл қайсы?",
      en: "What is the largest lake in Kazakhstan?",
    },
    options: {
      ru: ["Каспийское море", "Балхаш", "Арал", "Зайсан"],
      kz: ["Каспий теңізі", "Балқаш", "Арал", "Зайсан"],
      en: ["Caspian Sea", "Balkhash", "Aral", "Zaysan"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 44,
    topic: "geography",
    question: {
      ru: "Сколько областей в Казахстане?",
      kz: "Қазақстанда неше облыс бар?",
      en: "How many regions are in Kazakhstan?",
    },
    options: {
      ru: ["14", "17", "20", "12"],
      kz: ["14", "17", "20", "12"],
      en: ["14", "17", "20", "12"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 45,
    topic: "geography",
    question: {
      ru: "Какая река является самой длинной в Казахстане?",
      kz: "Қазақстандағы ең ұзын өзен қайсы?",
      en: "What is the longest river in Kazakhstan?",
    },
    options: {
      ru: ["Сырдарья", "Иртыш", "Или", "Урал"],
      kz: ["Сырдария", "Ертіс", "Іле", "Жайық"],
      en: ["Syrdarya", "Irtysh", "Ili", "Ural"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 46,
    topic: "geography",
    question: {
      ru: "Какой каньон называют 'младшим братом' Большого Каньона?",
      kz: "Қай шатқалды \"Үлкен каньонның кіші інісі\" деп атайды?",
      en: "What canyon is called the 'younger brother' of the Grand Canyon?",
    },
    options: {
      ru: ["Чарынский каньон", "Тургенское ущелье", "Кольсай", "Бозжыра"],
      kz: ["Шарын шатқалы", "Түрген шатқалы", "Көлсай", "Бозжыра"],
      en: ["Charyn Canyon", "Turgen Gorge", "Kolsay", "Bozzhyra"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 47,
    topic: "geography",
    question: {
      ru: "Какой город является столицей Казахстана?",
      kz: "Қазақстанның астанасы қай қала?",
      en: "What city is the capital of Kazakhstan?",
    },
    options: {
      ru: ["Алматы", "Астана", "Шымкент", "Караганда"],
      kz: ["Алматы", "Астана", "Шымкент", "Қарағанды"],
      en: ["Almaty", "Astana", "Shymkent", "Karaganda"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 48,
    topic: "geography",
    question: {
      ru: "Какой город был столицей до 1997 года?",
      kz: "1997 жылға дейін қай қала астана болды?",
      en: "What city was the capital before 1997?",
    },
    options: {
      ru: ["Караганда", "Алматы", "Семей", "Актобе"],
      kz: ["Қарағанды", "Алматы", "Семей", "Ақтөбе"],
      en: ["Karaganda", "Almaty", "Semey", "Aktobe"],
    },
    correctIndex: 1,
    points: 15,
  },

  // SILK ROAD (15 questions)
  {
    id: 49,
    topic: "silk_road",
    question: {
      ru: "Какой город был важным центром на Шелковом пути?",
      kz: "Жібек жолында қай қала маңызды орталық болды?",
      en: "Which city was an important center on the Silk Road?",
    },
    options: {
      ru: ["Отрар", "Астана", "Караганда", "Актау"],
      kz: ["Отырар", "Астана", "Қарағанды", "Ақтау"],
      en: ["Otrar", "Astana", "Karaganda", "Aktau"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 50,
    topic: "silk_road",
    question: {
      ru: "Что перевозили по Шелковому пути?",
      kz: "Жібек жолы арқылы не тасымалданды?",
      en: "What was transported along the Silk Road?",
    },
    options: {
      ru: ["Только шелк", "Шелк, специи, золото, идеи", "Только золото", "Только оружие"],
      kz: ["Тек жібек", "Жібек, дәмдеуіштер, алтын, идеялар", "Тек алтын", "Тек қару"],
      en: ["Only silk", "Silk, spices, gold, ideas", "Only gold", "Only weapons"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 51,
    topic: "silk_road",
    question: {
      ru: "Какая религия распространилась по Шелковому пути?",
      kz: "Жібек жолы арқылы қандай дін таралды?",
      en: "Which religion spread along the Silk Road?",
    },
    options: {
      ru: ["Только ислам", "Буддизм, ислам, христианство", "Только христианство", "Только буддизм"],
      kz: ["Тек ислам", "Буддизм, ислам, христиандық", "Тек христиандық", "Тек буддизм"],
      en: ["Only Islam", "Buddhism, Islam, Christianity", "Only Christianity", "Only Buddhism"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 52,
    topic: "silk_road",
    question: {
      ru: "Когда был разрушен город Отрар?",
      kz: "Отырар қаласы қашан қиратылды?",
      en: "When was the city of Otrar destroyed?",
    },
    options: {
      ru: ["X век", "XIII век (монголами)", "XV век", "XVIII век"],
      kz: ["X ғасыр", "XIII ғасыр (моңғолдар)", "XV ғасыр", "XVIII ғасыр"],
      en: ["10th century", "13th century (by Mongols)", "15th century", "18th century"],
    },
    correctIndex: 1,
    points: 25,
  },

  // ARCHAEOLOGY (20 questions)
  {
    id: 53,
    topic: "archaeology",
    question: {
      ru: "Кто нашел Золотого человека?",
      kz: "Алтын адамды кім тапты?",
      en: "Who found the Golden Man?",
    },
    options: {
      ru: ["Кемаль Акишев", "Геродот", "Археологи СССР", "Местные жители"],
      kz: ["Кемел Ақышев", "Геродот", "КСРО археологтары", "Жергілікті тұрғындар"],
      en: ["Kemal Akishev", "Herodotus", "USSR archaeologists", "Local residents"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 54,
    topic: "archaeology",
    question: {
      ru: "В каком году был найден Золотой человек?",
      kz: "Алтын адам қай жылы табылды?",
      en: "In what year was the Golden Man found?",
    },
    options: {
      ru: ["1969", "1980", "1955", "1991"],
      kz: ["1969", "1980", "1955", "1991"],
      en: ["1969", "1980", "1955", "1991"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 55,
    topic: "archaeology",
    question: {
      ru: "Что такое петроглиф?",
      kz: "Петроглиф дегеніміз не?",
      en: "What is a petroglyph?",
    },
    options: {
      ru: ["Древняя монета", "Наскальный рисунок", "Вид керамики", "Украшение"],
      kz: ["Ежелгі монета", "Жартас суреті", "Керамика түрі", "Әшекей"],
      en: ["Ancient coin", "Rock carving", "Type of ceramics", "Jewelry"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 56,
    topic: "archaeology",
    question: {
      ru: "Где находится музей Золотого человека?",
      kz: "Алтын адам музейі қайда орналасқан?",
      en: "Where is the Golden Man museum located?",
    },
    options: {
      ru: ["Нур-Султан", "Алматы", "Есик", "Туркестан"],
      kz: ["Нұр-Сұлтан", "Алматы", "Есік", "Түркістан"],
      en: ["Nur-Sultan", "Almaty", "Issyk", "Turkestan"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 57,
    topic: "archaeology",
    question: {
      ru: "Что такое 'звериный стиль'?",
      kz: "\"Аң стилі\" дегеніміз не?",
      en: "What is the 'animal style'?",
    },
    options: {
      ru: ["Вид охоты", "Художественный стиль саков", "Вид танца", "Музыкальный жанр"],
      kz: ["Аңшылық түрі", "Сақтардың көркем стилі", "Би түрі", "Музыкалық жанр"],
      en: ["Type of hunting", "Artistic style of Sakas", "Type of dance", "Music genre"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 58,
    topic: "archaeology",
    question: {
      ru: "Какие животные изображены в зверином стиле?",
      kz: "Аң стилінде қандай жануарлар бейнеленген?",
      en: "What animals are depicted in animal style?",
    },
    options: {
      ru: ["Олень, барс, орел, грифон", "Только олени", "Только птицы", "Только рыбы"],
      kz: ["Бұғы, барыс, бүркіт, грифон", "Тек бұғылар", "Тек құстар", "Тек балықтар"],
      en: ["Deer, leopard, eagle, griffin", "Only deer", "Only birds", "Only fish"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 59,
    topic: "archaeology",
    question: {
      ru: "Что обнаружили в Берельских курганах?",
      kz: "Берел қорғандарынан не табылды?",
      en: "What was discovered in the Berel kurgans?",
    },
    options: {
      ru: ["Мумии лошадей", "Древние книги", "Золотые монеты", "Древние корабли"],
      kz: ["Жылқы мумиялары", "Ежелгі кітаптар", "Алтын монеталар", "Ежелгі кемелер"],
      en: ["Horse mummies", "Ancient books", "Gold coins", "Ancient ships"],
    },
    correctIndex: 0,
    points: 25,
  },
  {
    id: 60,
    topic: "archaeology",
    question: {
      ru: "Сколько лет Золотому человеку?",
      kz: "Алтын адам неше жаста болған?",
      en: "How old was the Golden Man?",
    },
    options: {
      ru: ["Около 17-18 лет", "Около 30 лет", "Около 50 лет", "Около 10 лет"],
      kz: ["Шамамен 17-18 жас", "Шамамен 30 жас", "Шамамен 50 жас", "Шамамен 10 жас"],
      en: ["About 17-18 years", "About 30 years", "About 50 years", "About 10 years"],
    },
    correctIndex: 0,
    points: 20,
  },

  // ARCHITECTURE (15 questions)
  {
    id: 61,
    topic: "architecture",
    question: {
      ru: "Из чего строили мавзолеи на Шелковом пути?",
      kz: "Жібек жолындағы кесенелер неден салынған?",
      en: "What were mausoleums on the Silk Road built from?",
    },
    options: {
      ru: ["Дерево", "Обожженный кирпич", "Металл", "Стекло"],
      kz: ["Ағаш", "Күйдірілген кірпіш", "Металл", "Әйнек"],
      en: ["Wood", "Baked brick", "Metal", "Glass"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 62,
    topic: "architecture",
    question: {
      ru: "Какой элемент характерен для казахской архитектуры?",
      kz: "Қазақ сәулетіне қандай элемент тән?",
      en: "What element is characteristic of Kazakh architecture?",
    },
    options: {
      ru: ["Готические шпили", "Купола и арки", "Небоскребы", "Пирамиды"],
      kz: ["Готикалық шыңдар", "Күмбездер мен аркалар", "Аспантіреулер", "Пирамидалар"],
      en: ["Gothic spires", "Domes and arches", "Skyscrapers", "Pyramids"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 63,
    topic: "architecture",
    question: {
      ru: "Какого цвета был мавзолей Ходжи Ахмеда Ясави изначально?",
      kz: "Қожа Ахмет Яссауи кесенесі бастапқыда қандай түсте болған?",
      en: "What color was the Mausoleum of Khoja Ahmed Yasawi originally?",
    },
    options: {
      ru: ["Белый", "Голубой и бирюзовый", "Красный", "Желтый"],
      kz: ["Ақ", "Көк және көгілдір", "Қызыл", "Сары"],
      en: ["White", "Blue and turquoise", "Red", "Yellow"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 64,
    topic: "architecture",
    question: {
      ru: "Что украшало стены средневековых мавзолеев?",
      kz: "Орта ғасырлық кесенелер қабырғаларын не безендірген?",
      en: "What decorated the walls of medieval mausoleums?",
    },
    options: {
      ru: ["Картины", "Геометрические орнаменты и каллиграфия", "Статуи", "Зеркала"],
      kz: ["Суреттер", "Геометриялық өрнектер мен каллиграфия", "Мүсіндер", "Айналар"],
      en: ["Paintings", "Geometric patterns and calligraphy", "Statues", "Mirrors"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 65,
    topic: "architecture",
    question: {
      ru: "Какой металл использовали для украшения казана в мавзолее Ясави?",
      kz: "Яссауи кесенесіндегі қазанды безендіру үшін қандай метал қолданылған?",
      en: "What metal was used to decorate the kazan in Yasawi mausoleum?",
    },
    options: {
      ru: ["Серебро", "Бронза", "Железо", "Медь"],
      kz: ["Күміс", "Қола", "Темір", "Мыс"],
      en: ["Silver", "Bronze", "Iron", "Copper"],
    },
    correctIndex: 1,
    points: 20,
  },

  // MODERN HISTORY (15 questions)
  {
    id: 66,
    topic: "kazakh_khanate",
    question: {
      ru: "Когда Казахстан стал независимым?",
      kz: "Қазақстан қашан тәуелсіз болды?",
      en: "When did Kazakhstan become independent?",
    },
    options: {
      ru: ["1990", "1991", "1993", "1989"],
      kz: ["1990", "1991", "1993", "1989"],
      en: ["1990", "1991", "1993", "1989"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 67,
    topic: "kazakh_khanate",
    question: {
      ru: "Какой праздник отмечается 16 декабря?",
      kz: "16 желтоқсанда қандай мереке тойланады?",
      en: "What holiday is celebrated on December 16?",
    },
    options: {
      ru: ["Наурыз", "День независимости", "День Конституции", "Новый год"],
      kz: ["Наурыз", "Тәуелсіздік күні", "Конституция күні", "Жаңа жыл"],
      en: ["Nauryz", "Independence Day", "Constitution Day", "New Year"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 68,
    topic: "kazakh_khanate",
    question: {
      ru: "Кто был первым президентом Казахстана?",
      kz: "Қазақстанның алғашқы президенті кім болды?",
      en: "Who was the first president of Kazakhstan?",
    },
    options: {
      ru: ["Касым-Жомарт Токаев", "Нурсултан Назарбаев", "Динмухамед Кунаев", "Абылай хан"],
      kz: ["Қасым-Жомарт Тоқаев", "Нұрсұлтан Назарбаев", "Дінмұхаммед Қонаев", "Абылай хан"],
      en: ["Kassym-Jomart Tokayev", "Nursultan Nazarbayev", "Dinmukhamed Kunaev", "Abylai Khan"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 69,
    topic: "culture",
    question: {
      ru: "Какой символ изображен на флаге Казахстана?",
      kz: "Қазақстан туында қандай символ бейнеленген?",
      en: "What symbol is depicted on the flag of Kazakhstan?",
    },
    options: {
      ru: ["Лев", "Орел и солнце", "Медведь", "Дракон"],
      kz: ["Арыстан", "Бүркіт пен күн", "Аю", "Айдаһар"],
      en: ["Lion", "Eagle and sun", "Bear", "Dragon"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 70,
    topic: "culture",
    question: {
      ru: "Какой композитор написал кюй 'Сарыарка'?",
      kz: "\"Сарыарқа\" күйін қай композитор жазды?",
      en: "Which composer wrote the kuy 'Saryarka'?",
    },
    options: {
      ru: ["Курмангазы", "Дина Нурпеисова", "Таттимбет", "Ыхлас"],
      kz: ["Құрманғазы", "Дина Нүрпейісова", "Тәттімбет", "Ықылас"],
      en: ["Kurmangazy", "Dina Nurpeisova", "Tattimbet", "Ykhlas"],
    },
    correctIndex: 0,
    points: 20,
  },
];
