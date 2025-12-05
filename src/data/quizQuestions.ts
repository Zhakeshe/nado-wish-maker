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
};

export const allQuizQuestions: QuizQuestion[] = [
  // BRONZE AGE (20 questions)
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

  // IRON AGE / SAKAS (20 questions)
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

  // MEDIEVAL (20 questions)
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
      ru: ["III-V века", "VI-VIII века", "X-XII века", "XIII-XV века"],
      kz: ["III-V ғасырлар", "VI-VIII ғасырлар", "X-XII ғасырлар", "XIII-XV ғасырлар"],
      en: ["3rd-5th centuries", "6th-8th centuries", "10th-12th centuries", "13th-15th centuries"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 26,
    topic: "medieval",
    question: {
      ru: "Кто был основателем Тюркского каганата?",
      kz: "Түрік қағанатының негізін салушы кім?",
      en: "Who founded the Turkic Khaganate?",
    },
    options: {
      ru: ["Бумын-каган", "Истеми-каган", "Тоньюкук", "Кюльтегин"],
      kz: ["Бұмын қаған", "Істемі қаған", "Тоныкөк", "Күлтегін"],
      en: ["Bumin Qaghan", "Istemi Qaghan", "Tonyukuk", "Kul Tigin"],
    },
    correctIndex: 0,
    points: 25,
  },
  {
    id: 27,
    topic: "medieval",
    question: {
      ru: "Где находится мавзолей Айша-биби?",
      kz: "Айша бибі кесенесі қайда орналасқан?",
      en: "Where is the Aisha-bibi mausoleum located?",
    },
    options: {
      ru: ["Туркестан", "Тараз", "Алматы", "Шымкент"],
      kz: ["Түркістан", "Тараз", "Алматы", "Шымкент"],
      en: ["Turkestan", "Taraz", "Almaty", "Shymkent"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 28,
    topic: "medieval",
    question: {
      ru: "К какому веку относится мавзолей Айша-биби?",
      kz: "Айша бибі кесенесі қай ғасырға жатады?",
      en: "To which century does the Aisha-bibi mausoleum belong?",
    },
    options: {
      ru: ["X век", "XI-XII века", "XIV век", "XVI век"],
      kz: ["X ғасыр", "XI-XII ғасырлар", "XIV ғасыр", "XVI ғасыр"],
      en: ["10th century", "11th-12th centuries", "14th century", "16th century"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 29,
    topic: "medieval",
    question: {
      ru: "Какой город был столицей Караханидов?",
      kz: "Қарахандар мемлекетінің астанасы қай қала болды?",
      en: "Which city was the capital of the Karakhanids?",
    },
    options: {
      ru: ["Баласагун", "Отрар", "Сыгнак", "Сауран"],
      kz: ["Баласағұн", "Отырар", "Сығанақ", "Сауран"],
      en: ["Balasagun", "Otrar", "Sygnak", "Sauran"],
    },
    correctIndex: 0,
    points: 25,
  },
  {
    id: 30,
    topic: "medieval",
    question: {
      ru: "Кем был Аль-Фараби?",
      kz: "Әл-Фараби кім болған?",
      en: "Who was Al-Farabi?",
    },
    options: {
      ru: ["Полководец", "Философ и ученый", "Купец", "Правитель"],
      kz: ["Қолбасшы", "Философ және ғалым", "Саудагер", "Билеуші"],
      en: ["Commander", "Philosopher and scientist", "Merchant", "Ruler"],
    },
    correctIndex: 1,
    points: 15,
  },

  // KAZAKH KHANATE (20 questions)
  {
    id: 31,
    topic: "kazakh_khanate",
    question: {
      ru: "Кто основал Казахское ханство?",
      kz: "Қазақ хандығын кім құрды?",
      en: "Who founded the Kazakh Khanate?",
    },
    options: {
      ru: ["Абылай хан", "Керей и Жанибек", "Тауке хан", "Касым хан"],
      kz: ["Абылай хан", "Керей мен Жәнібек", "Тәуке хан", "Қасым хан"],
      en: ["Abylai Khan", "Kerey and Zhanibek", "Tauke Khan", "Kasym Khan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 32,
    topic: "kazakh_khanate",
    question: {
      ru: "В каком году было образовано Казахское ханство?",
      kz: "Қазақ хандығы қай жылы құрылды?",
      en: "In what year was the Kazakh Khanate formed?",
    },
    options: {
      ru: ["1456", "1465", "1480", "1500"],
      kz: ["1456", "1465", "1480", "1500"],
      en: ["1456", "1465", "1480", "1500"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 33,
    topic: "kazakh_khanate",
    question: {
      ru: "Какой древний город был столицей Казахского ханства?",
      kz: "Қазақ хандығының астанасы қай ежелгі қала болды?",
      en: "Which ancient city was the capital of the Kazakh Khanate?",
    },
    options: {
      ru: ["Отрар", "Туркестан", "Сыганак", "Сауран"],
      kz: ["Отырар", "Түркістан", "Сығанақ", "Сауран"],
      en: ["Otrar", "Turkestan", "Syganak", "Sauran"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 34,
    topic: "kazakh_khanate",
    question: {
      ru: "В каком году Туркестан стал столицей Казахского ханства?",
      kz: "Түркістан Қазақ хандығының астанасы қай жылы болды?",
      en: "In what year did Turkestan become the capital of the Kazakh Khanate?",
    },
    options: {
      ru: ["1465", "1500", "1598", "1718"],
      kz: ["1465", "1500", "1598", "1718"],
      en: ["1465", "1500", "1598", "1718"],
    },
    correctIndex: 2,
    points: 25,
  },
  {
    id: 35,
    topic: "kazakh_khanate",
    question: {
      ru: "Сколько жузов было в Казахском ханстве?",
      kz: "Қазақ хандығында неше жүз болды?",
      en: "How many zhuzes were in the Kazakh Khanate?",
    },
    options: {
      ru: ["Два", "Три", "Четыре", "Пять"],
      kz: ["Екі", "Үш", "Төрт", "Бес"],
      en: ["Two", "Three", "Four", "Five"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 36,
    topic: "kazakh_khanate",
    question: {
      ru: "Кто создал свод законов «Жеты Жаргы»?",
      kz: "«Жеті жарғы» заңдар жинағын кім құрастырды?",
      en: "Who created the code of laws 'Zhety Zhargy'?",
    },
    options: {
      ru: ["Касым хан", "Тауке хан", "Абылай хан", "Кенесары хан"],
      kz: ["Қасым хан", "Тәуке хан", "Абылай хан", "Кенесары хан"],
      en: ["Kasym Khan", "Tauke Khan", "Abylai Khan", "Kenesary Khan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 37,
    topic: "kazakh_khanate",
    question: {
      ru: "При каком хане численность Казахского ханства достигла миллиона человек?",
      kz: "Қай ханның тұсында Қазақ хандығының халық саны миллионға жетті?",
      en: "Under which khan did the Kazakh Khanate reach a million people?",
    },
    options: {
      ru: ["Керей хан", "Касым хан", "Тауке хан", "Абылай хан"],
      kz: ["Керей хан", "Қасым хан", "Тәуке хан", "Абылай хан"],
      en: ["Kerey Khan", "Kasym Khan", "Tauke Khan", "Abylai Khan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 38,
    topic: "kazakh_khanate",
    question: {
      ru: "Как назывались традиционные казахские законы?",
      kz: "Дәстүрлі қазақ заңдары қалай аталды?",
      en: "What were traditional Kazakh laws called?",
    },
    options: {
      ru: ["Шариат", "Адат", "Торе", "Манас"],
      kz: ["Шариғат", "Әдет", "Төре", "Манас"],
      en: ["Sharia", "Adat", "Tore", "Manas"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 39,
    topic: "kazakh_khanate",
    question: {
      ru: "Кто из казахских ханов имел титул «батыр»?",
      kz: "Қазақ хандарының қайсысында «батыр» атағы болды?",
      en: "Which Kazakh khan had the title 'batyr'?",
    },
    options: {
      ru: ["Абылай", "Касым", "Тауке", "Керей"],
      kz: ["Абылай", "Қасым", "Тәуке", "Керей"],
      en: ["Abylai", "Kasym", "Tauke", "Kerey"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 40,
    topic: "kazakh_khanate",
    question: {
      ru: "Какой жуз располагался на территории Семиречья?",
      kz: "Жетісу аумағында қай жүз орналасты?",
      en: "Which zhuz was located in the Zhetysu territory?",
    },
    options: {
      ru: ["Старший жуз", "Средний жуз", "Младший жуз", "Все три"],
      kz: ["Ұлы жүз", "Орта жүз", "Кіші жүз", "Үшеуі де"],
      en: ["Senior Zhuz", "Middle Zhuz", "Junior Zhuz", "All three"],
    },
    correctIndex: 0,
    points: 15,
  },

  // SILK ROAD (15 questions)
  {
    id: 41,
    topic: "silk_road",
    question: {
      ru: "Сколько лет насчитывает история Великого Шелкового пути?",
      kz: "Ұлы Жібек жолының тарихы неше жыл?",
      en: "How many years is the history of the Great Silk Road?",
    },
    options: {
      ru: ["500 лет", "1000 лет", "2000 лет", "3000 лет"],
      kz: ["500 жыл", "1000 жыл", "2000 жыл", "3000 жыл"],
      en: ["500 years", "1000 years", "2000 years", "3000 years"],
    },
    correctIndex: 2,
    points: 20,
  },
  {
    id: 42,
    topic: "silk_road",
    question: {
      ru: "Какой город был крупным центром на Шелковом пути?",
      kz: "Жібек жолында қай қала ірі орталық болды?",
      en: "Which city was a major center on the Silk Road?",
    },
    options: {
      ru: ["Отрар", "Астана", "Актау", "Атырау"],
      kz: ["Отырар", "Астана", "Ақтау", "Атырау"],
      en: ["Otrar", "Astana", "Aktau", "Atyrau"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 43,
    topic: "silk_road",
    question: {
      ru: "Что в основном перевозили по Шелковому пути?",
      kz: "Жібек жолымен негізінен не тасымалданды?",
      en: "What was mainly transported on the Silk Road?",
    },
    options: {
      ru: ["Только шелк", "Шелк, специи, драгоценности", "Только оружие", "Только продукты"],
      kz: ["Тек жібек", "Жібек, дәмдеуіштер, асыл тастар", "Тек қару", "Тек тағамдар"],
      en: ["Only silk", "Silk, spices, gems", "Only weapons", "Only food"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 44,
    topic: "silk_road",
    question: {
      ru: "Какие две страны соединял Шелковый путь?",
      kz: "Жібек жолы қай екі елді байланыстырды?",
      en: "Which two countries did the Silk Road connect?",
    },
    options: {
      ru: ["Россия и Индия", "Китай и Римская империя", "Персия и Египет", "Монголия и Япония"],
      kz: ["Ресей мен Үндістан", "Қытай мен Рим империясы", "Парсы мен Мысыр", "Моңғолия мен Жапония"],
      en: ["Russia and India", "China and Roman Empire", "Persia and Egypt", "Mongolia and Japan"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 45,
    topic: "silk_road",
    question: {
      ru: "В каком году был разрушен город Отрар?",
      kz: "Отырар қаласы қай жылы қиратылды?",
      en: "In what year was the city of Otrar destroyed?",
    },
    options: {
      ru: ["1218", "1219", "1221", "1227"],
      kz: ["1218", "1219", "1221", "1227"],
      en: ["1218", "1219", "1221", "1227"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 46,
    topic: "silk_road",
    question: {
      ru: "Кто разрушил Отрар?",
      kz: "Отырарды кім қиратты?",
      en: "Who destroyed Otrar?",
    },
    options: {
      ru: ["Александр Македонский", "Чингисхан", "Тимур", "Арабы"],
      kz: ["Ұлы Александр", "Шыңғыс хан", "Темірлан", "Арабтар"],
      en: ["Alexander the Great", "Genghis Khan", "Timur", "Arabs"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 47,
    topic: "silk_road",
    question: {
      ru: "Какой ученый родился в Отраре?",
      kz: "Отырарда қай ғалым дүниеге келді?",
      en: "Which scholar was born in Otrar?",
    },
    options: {
      ru: ["Аль-Фараби", "Авиценна", "Улугбек", "Аль-Хорезми"],
      kz: ["Әл-Фараби", "Ибн Сина", "Ұлықбек", "Әл-Хорезми"],
      en: ["Al-Farabi", "Avicenna", "Ulugbek", "Al-Khwarizmi"],
    },
    correctIndex: 0,
    points: 20,
  },

  // ARCHAEOLOGY (15 questions)
  {
    id: 48,
    topic: "archaeology",
    question: {
      ru: "В каком году был обнаружен Золотой человек?",
      kz: "Алтын адам қай жылы табылды?",
      en: "In what year was the Golden Man discovered?",
    },
    options: {
      ru: ["1959", "1969", "1979", "1989"],
      kz: ["1959", "1969", "1979", "1989"],
      en: ["1959", "1969", "1979", "1989"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 49,
    topic: "archaeology",
    question: {
      ru: "Кто руководил раскопками кургана Иссык?",
      kz: "Есік қорғанының қазбасын кім басқарды?",
      en: "Who led the excavations of the Issyk kurgan?",
    },
    options: {
      ru: ["К. Акишев", "А. Маргулан", "М. Кадырбаев", "Е. Агеева"],
      kz: ["К. Ақышев", "Ә. Марғұлан", "М. Қадырбаев", "Е. Агеева"],
      en: ["K. Akishev", "A. Margulan", "M. Kadyrbayev", "E. Ageeva"],
    },
    correctIndex: 0,
    points: 25,
  },
  {
    id: 50,
    topic: "archaeology",
    question: {
      ru: "Сколько петроглифов насчитывается в Тамгалы?",
      kz: "Тамғалыда неше жартас суреті бар?",
      en: "How many petroglyphs are there in Tamgaly?",
    },
    options: {
      ru: ["Около 1000", "Около 3000", "Около 5000", "Около 10000"],
      kz: ["Шамамен 1000", "Шамамен 3000", "Шамамен 5000", "Шамамен 10000"],
      en: ["About 1000", "About 3000", "About 5000", "About 10000"],
    },
    correctIndex: 2,
    points: 20,
  },
  {
    id: 51,
    topic: "archaeology",
    question: {
      ru: "Что изучает археология?",
      kz: "Археология нені зерттейді?",
      en: "What does archaeology study?",
    },
    options: {
      ru: ["Живые организмы", "Древние культуры по материальным остаткам", "Звезды", "Климат"],
      kz: ["Тірі организмдер", "Материалдық қалдықтар бойынша ежелгі мәдениеттер", "Жұлдыздар", "Климат"],
      en: ["Living organisms", "Ancient cultures through material remains", "Stars", "Climate"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 52,
    topic: "archaeology",
    question: {
      ru: "В каком году Тамгалы внесен в список ЮНЕСКО?",
      kz: "Тамғалы ЮНЕСКО тізіміне қай жылы енгізілді?",
      en: "In what year was Tamgaly added to the UNESCO list?",
    },
    options: {
      ru: ["2000", "2004", "2008", "2012"],
      kz: ["2000", "2004", "2008", "2012"],
      en: ["2000", "2004", "2008", "2012"],
    },
    correctIndex: 1,
    points: 25,
  },

  // CULTURE (15 questions)
  {
    id: 53,
    topic: "culture",
    question: {
      ru: "Как называется традиционное казахское жилище?",
      kz: "Дәстүрлі қазақ тұрғын үйі қалай аталады?",
      en: "What is the traditional Kazakh dwelling called?",
    },
    options: {
      ru: ["Изба", "Юрта", "Чум", "Шалаш"],
      kz: ["Үй", "Киіз үй", "Чум", "Шатыр"],
      en: ["Izba", "Yurt", "Chum", "Shelter"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 54,
    topic: "culture",
    question: {
      ru: "Как называется традиционный казахский музыкальный инструмент?",
      kz: "Дәстүрлі қазақ музыкалық аспабы қалай аталады?",
      en: "What is the traditional Kazakh musical instrument called?",
    },
    options: {
      ru: ["Балалайка", "Домбра", "Гитара", "Скрипка"],
      kz: ["Балалайка", "Домбыра", "Гитара", "Скрипка"],
      en: ["Balalaika", "Dombra", "Guitar", "Violin"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 55,
    topic: "culture",
    question: {
      ru: "Кто такой акын?",
      kz: "Ақын кім?",
      en: "Who is an akyn?",
    },
    options: {
      ru: ["Воин", "Поэт-импровизатор", "Правитель", "Торговец"],
      kz: ["Жауынгер", "Импровизатор-ақын", "Билеуші", "Саудагер"],
      en: ["Warrior", "Poet-improviser", "Ruler", "Merchant"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 56,
    topic: "culture",
    question: {
      ru: "Что такое айтыс?",
      kz: "Айтыс дегеніміз не?",
      en: "What is aitys?",
    },
    options: {
      ru: ["Танец", "Поэтическое состязание", "Борьба", "Скачки"],
      kz: ["Би", "Ақындар жарысы", "Күрес", "Бәйге"],
      en: ["Dance", "Poetic competition", "Wrestling", "Horse racing"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 57,
    topic: "culture",
    question: {
      ru: "Как называется традиционная казахская борьба?",
      kz: "Дәстүрлі қазақ күресі қалай аталады?",
      en: "What is traditional Kazakh wrestling called?",
    },
    options: {
      ru: ["Дзюдо", "Казакша курес", "Самбо", "Сумо"],
      kz: ["Дзюдо", "Қазақша күрес", "Самбо", "Сумо"],
      en: ["Judo", "Kazakh kuresi", "Sambo", "Sumo"],
    },
    correctIndex: 1,
    points: 15,
  },

  // ARCHITECTURE (15 questions)
  {
    id: 58,
    topic: "architecture",
    question: {
      ru: "Какой материал использовался для облицовки мавзолея Айша-биби?",
      kz: "Айша бибі кесенесін қаптау үшін қандай материал қолданылды?",
      en: "What material was used to clad the Aisha-bibi mausoleum?",
    },
    options: {
      ru: ["Мрамор", "Терракотовая плитка", "Золото", "Дерево"],
      kz: ["Мәрмәр", "Терракот плиткасы", "Алтын", "Ағаш"],
      en: ["Marble", "Terracotta tiles", "Gold", "Wood"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 59,
    topic: "architecture",
    question: {
      ru: "Сколько узоров на мавзолее Айша-биби?",
      kz: "Айша бибі кесенесінде неше өрнек бар?",
      en: "How many patterns are on the Aisha-bibi mausoleum?",
    },
    options: {
      ru: ["Около 10", "Около 30", "Около 60", "Около 100"],
      kz: ["Шамамен 10", "Шамамен 30", "Шамамен 60", "Шамамен 100"],
      en: ["About 10", "About 30", "About 60", "About 100"],
    },
    correctIndex: 2,
    points: 25,
  },
  {
    id: 60,
    topic: "architecture",
    question: {
      ru: "Какая форма характерна для мавзолеев Казахстана?",
      kz: "Қазақстан кесенелеріне қандай форма тән?",
      en: "What shape is characteristic of Kazakhstan mausoleums?",
    },
    options: {
      ru: ["Пирамидальная", "Купольная", "Конусная", "Прямоугольная"],
      kz: ["Пирамида тәрізді", "Күмбезді", "Конус тәрізді", "Тіктөртбұрышты"],
      en: ["Pyramidal", "Domed", "Cone-shaped", "Rectangular"],
    },
    correctIndex: 1,
    points: 15,
  },

  // Additional questions to reach 100+
  {
    id: 61,
    topic: "medieval",
    question: {
      ru: "Какой город называли «Второй Меккой»?",
      kz: "Қай қаланы «Екінші Мекке» деп атады?",
      en: "Which city was called the 'Second Mecca'?",
    },
    options: {
      ru: ["Отрар", "Туркестан", "Тараз", "Сауран"],
      kz: ["Отырар", "Түркістан", "Тараз", "Сауран"],
      en: ["Otrar", "Turkestan", "Taraz", "Sauran"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 62,
    topic: "culture",
    question: {
      ru: "Как называется казахский национальный напиток из кобыльего молока?",
      kz: "Бие сүтінен жасалған қазақ ұлттық сусыны қалай аталады?",
      en: "What is the Kazakh national drink made from mare's milk called?",
    },
    options: {
      ru: ["Айран", "Кумыс", "Шубат", "Катык"],
      kz: ["Айран", "Қымыз", "Шұбат", "Қатық"],
      en: ["Ayran", "Kumys", "Shubat", "Katyk"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 63,
    topic: "bronze_age",
    question: {
      ru: "Какое животное было священным у андроновцев?",
      kz: "Андронов халқында қандай жануар қасиетті болды?",
      en: "Which animal was sacred to the Andronovo people?",
    },
    options: {
      ru: ["Кошка", "Лошадь", "Собака", "Змея"],
      kz: ["Мысық", "Жылқы", "Ит", "Жылан"],
      en: ["Cat", "Horse", "Dog", "Snake"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 64,
    topic: "iron_age",
    question: {
      ru: "Какое государство создали усуни?",
      kz: "Үйсіндер қандай мемлекет құрды?",
      en: "What state did the Wusun create?",
    },
    options: {
      ru: ["Империю", "Ханство", "Каганат", "Конфедерацию"],
      kz: ["Империя", "Хандық", "Қағанат", "Конфедерация"],
      en: ["Empire", "Khanate", "Khaganate", "Confederation"],
    },
    correctIndex: 3,
    points: 20,
  },
  {
    id: 65,
    topic: "kazakh_khanate",
    question: {
      ru: "Как назывался совет биев при хане?",
      kz: "Хан қасындағы билер кеңесі қалай аталды?",
      en: "What was the council of biys called?",
    },
    options: {
      ru: ["Курултай", "Маслихат", "Жиын", "Сенат"],
      kz: ["Құрылтай", "Мәслихат", "Жиын", "Сенат"],
      en: ["Kurultai", "Maslikhat", "Zhiyn", "Senate"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 66,
    topic: "silk_road",
    question: {
      ru: "Какие религии распространялись по Шелковому пути?",
      kz: "Жібек жолы арқылы қандай діндер таралды?",
      en: "What religions spread along the Silk Road?",
    },
    options: {
      ru: ["Только ислам", "Буддизм, ислам, христианство", "Только христианство", "Только буддизм"],
      kz: ["Тек ислам", "Буддизм, ислам, христиандық", "Тек христиандық", "Тек буддизм"],
      en: ["Only Islam", "Buddhism, Islam, Christianity", "Only Christianity", "Only Buddhism"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 67,
    topic: "archaeology",
    question: {
      ru: "Где находится некрополь Берел?",
      kz: "Берел қорымы қайда орналасқан?",
      en: "Where is the Berel necropolis located?",
    },
    options: {
      ru: ["Алматинская область", "Восточный Казахстан", "Западный Казахстан", "Северный Казахстан"],
      kz: ["Алматы облысы", "Шығыс Қазақстан", "Батыс Қазақстан", "Солтүстік Қазақстан"],
      en: ["Almaty region", "East Kazakhstan", "West Kazakhstan", "North Kazakhstan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 68,
    topic: "culture",
    question: {
      ru: "Что такое «шаңырақ»?",
      kz: "«Шаңырақ» дегеніміз не?",
      en: "What is 'shanyrak'?",
    },
    options: {
      ru: ["Ковер", "Верхняя часть юрты", "Музыкальный инструмент", "Оружие"],
      kz: ["Кілем", "Киіз үйдің жоғарғы бөлігі", "Музыкалық аспап", "Қару"],
      en: ["Carpet", "Top part of yurt", "Musical instrument", "Weapon"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 69,
    topic: "architecture",
    question: {
      ru: "Какой высоты мавзолей Ходжи Ахмеда Ясави?",
      kz: "Қожа Ахмет Яссауи кесенесінің биіктігі қанша?",
      en: "How tall is the Mausoleum of Khoja Ahmed Yasawi?",
    },
    options: {
      ru: ["25 метров", "38 метров", "50 метров", "65 метров"],
      kz: ["25 метр", "38 метр", "50 метр", "65 метр"],
      en: ["25 meters", "38 meters", "50 meters", "65 meters"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 70,
    topic: "medieval",
    question: {
      ru: "Кем был Юсуф Баласагуни?",
      kz: "Жүсіп Баласағұн кім болған?",
      en: "Who was Yusuf Balasaguni?",
    },
    options: {
      ru: ["Воин", "Поэт и мыслитель", "Купец", "Правитель"],
      kz: ["Жауынгер", "Ақын және ойшыл", "Саудагер", "Билеуші"],
      en: ["Warrior", "Poet and thinker", "Merchant", "Ruler"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 71,
    topic: "kazakh_khanate",
    question: {
      ru: "Какое название носило войско казахских ханов?",
      kz: "Қазақ хандарының әскері қалай аталды?",
      en: "What was the army of Kazakh khans called?",
    },
    options: {
      ru: ["Орда", "Легион", "Армия", "Гвардия"],
      kz: ["Орда", "Легион", "Армия", "Гвардия"],
      en: ["Horde", "Legion", "Army", "Guard"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 72,
    topic: "iron_age",
    question: {
      ru: "Какой головной убор носил Золотой человек?",
      kz: "Алтын адам қандай бас киім киген?",
      en: "What headdress did the Golden Man wear?",
    },
    options: {
      ru: ["Корона", "Остроконечный колпак", "Шлем", "Тюрбан"],
      kz: ["Тәж", "Үшкір қалпақ", "Дулыға", "Сәлде"],
      en: ["Crown", "Pointed cap", "Helmet", "Turban"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 73,
    topic: "bronze_age",
    question: {
      ru: "Где находится Ботайское поселение?",
      kz: "Ботай қонысы қайда орналасқан?",
      en: "Where is the Botai settlement located?",
    },
    options: {
      ru: ["Южный Казахстан", "Северный Казахстан", "Западный Казахстан", "Восточный Казахстан"],
      kz: ["Оңтүстік Қазақстан", "Солтүстік Қазақстан", "Батыс Қазақстан", "Шығыс Қазақстан"],
      en: ["Southern Kazakhstan", "Northern Kazakhstan", "Western Kazakhstan", "Eastern Kazakhstan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 74,
    topic: "culture",
    question: {
      ru: "Что такое «асатаяк»?",
      kz: "«Асатаяқ» дегеніміз не?",
      en: "What is 'asatayak'?",
    },
    options: {
      ru: ["Музыкальный инструмент", "Оружие", "Посуда", "Украшение"],
      kz: ["Музыкалық аспап", "Қару", "Ыдыс", "Әшекей"],
      en: ["Musical instrument", "Weapon", "Dish", "Jewelry"],
    },
    correctIndex: 0,
    points: 20,
  },
  {
    id: 75,
    topic: "silk_road",
    question: {
      ru: "Какой товар везли с Востока на Запад?",
      kz: "Шығыстан Батысқа қандай тауар тасымалданды?",
      en: "What goods were carried from East to West?",
    },
    options: {
      ru: ["Шелк и чай", "Нефть", "Зерно", "Железо"],
      kz: ["Жібек пен шай", "Мұнай", "Астық", "Темір"],
      en: ["Silk and tea", "Oil", "Grain", "Iron"],
    },
    correctIndex: 0,
    points: 15,
  },
  // Continue with more questions...
  {
    id: 76,
    topic: "archaeology",
    question: {
      ru: "Какой возраст имеют древнейшие находки в Казахстане?",
      kz: "Қазақстандағы ең көне табылымдардың жасы қанша?",
      en: "How old are the oldest finds in Kazakhstan?",
    },
    options: {
      ru: ["100 тысяч лет", "500 тысяч лет", "1 миллион лет", "2 миллиона лет"],
      kz: ["100 мың жыл", "500 мың жыл", "1 миллион жыл", "2 миллион жыл"],
      en: ["100 thousand years", "500 thousand years", "1 million years", "2 million years"],
    },
    correctIndex: 2,
    points: 25,
  },
  {
    id: 77,
    topic: "medieval",
    question: {
      ru: "Какое государство называлось Дешт-и-Кипчак?",
      kz: "Қай мемлекет Дешт-и-Қыпшақ деп аталды?",
      en: "Which state was called Desht-i-Kipchak?",
    },
    options: {
      ru: ["Золотая Орда", "Казахское ханство", "Тюркский каганат", "Кипчакская степь"],
      kz: ["Алтын Орда", "Қазақ хандығы", "Түрік қағанаты", "Қыпшақ даласы"],
      en: ["Golden Horde", "Kazakh Khanate", "Turkic Khaganate", "Kipchak Steppe"],
    },
    correctIndex: 3,
    points: 20,
  },
  {
    id: 78,
    topic: "culture",
    question: {
      ru: "Как называется казахская конная игра?",
      kz: "Қазақ ат ойыны қалай аталады?",
      en: "What is Kazakh horse game called?",
    },
    options: {
      ru: ["Кокпар", "Поло", "Футбол", "Хоккей"],
      kz: ["Көкпар", "Поло", "Футбол", "Хоккей"],
      en: ["Kokpar", "Polo", "Football", "Hockey"],
    },
    correctIndex: 0,
    points: 10,
  },
  {
    id: 79,
    topic: "kazakh_khanate",
    question: {
      ru: "Кто был последним казахским ханом?",
      kz: "Соңғы қазақ ханы кім болды?",
      en: "Who was the last Kazakh khan?",
    },
    options: {
      ru: ["Абылай хан", "Кенесары хан", "Касым хан", "Тауке хан"],
      kz: ["Абылай хан", "Кенесары хан", "Қасым хан", "Тәуке хан"],
      en: ["Abylai Khan", "Kenesary Khan", "Kasym Khan", "Tauke Khan"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 80,
    topic: "iron_age",
    question: {
      ru: "Как называется культура железного века в Центральном Казахстане?",
      kz: "Орталық Қазақстандағы темір дәуірі мәдениеті қалай аталады?",
      en: "What is the Iron Age culture in Central Kazakhstan called?",
    },
    options: {
      ru: ["Тасмолинская", "Андроновская", "Ботайская", "Саргатская"],
      kz: ["Тасмола", "Андронов", "Ботай", "Саргат"],
      en: ["Tasmola", "Andronovo", "Botai", "Sargat"],
    },
    correctIndex: 0,
    points: 25,
  },
  {
    id: 81,
    topic: "bronze_age",
    question: {
      ru: "Что такое менгир?",
      kz: "Менгир дегеніміз не?",
      en: "What is a menhir?",
    },
    options: {
      ru: ["Вертикально стоящий камень", "Горизонтальный камень", "Каменный круг", "Пещера"],
      kz: ["Тік тұрған тас", "Көлденең тас", "Тас шеңбер", "Үңгір"],
      en: ["Vertically standing stone", "Horizontal stone", "Stone circle", "Cave"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 82,
    topic: "architecture",
    question: {
      ru: "Из какого материала строились средневековые города в Казахстане?",
      kz: "Қазақстандағы ортағасырлық қалалар қандай материалдан салынды?",
      en: "What material were medieval cities in Kazakhstan built from?",
    },
    options: {
      ru: ["Камень", "Сырцовый кирпич", "Дерево", "Бетон"],
      kz: ["Тас", "Шикі кірпіш", "Ағаш", "Бетон"],
      en: ["Stone", "Mud brick", "Wood", "Concrete"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 83,
    topic: "silk_road",
    question: {
      ru: "Какой китайский товар был самым ценным на Шелковом пути?",
      kz: "Жібек жолындағы ең қымбат қытай тауары қандай болды?",
      en: "What Chinese goods were most valuable on the Silk Road?",
    },
    options: {
      ru: ["Рис", "Шелк", "Бамбук", "Чай"],
      kz: ["Күріш", "Жібек", "Бамбук", "Шай"],
      en: ["Rice", "Silk", "Bamboo", "Tea"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 84,
    topic: "culture",
    question: {
      ru: "Как называется традиционная казахская вышивка?",
      kz: "Дәстүрлі қазақ кестесі қалай аталады?",
      en: "What is traditional Kazakh embroidery called?",
    },
    options: {
      ru: ["Орнамент", "Кесте", "Узор", "Вышивка"],
      kz: ["Өрнек", "Кесте", "Ою", "Тігін"],
      en: ["Ornament", "Keste", "Pattern", "Embroidery"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 85,
    topic: "medieval",
    question: {
      ru: "Какой язык был официальным в Караханидском государстве?",
      kz: "Қарахан мемлекетінің ресми тілі қандай болды?",
      en: "What was the official language of the Karakhanid state?",
    },
    options: {
      ru: ["Персидский", "Тюркский", "Арабский", "Монгольский"],
      kz: ["Парсы", "Түркі", "Араб", "Моңғол"],
      en: ["Persian", "Turkic", "Arabic", "Mongolian"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 86,
    topic: "archaeology",
    question: {
      ru: "Какой тип керамики характерен для бронзового века?",
      kz: "Қола дәуіріне қандай керамика түрі тән?",
      en: "What type of ceramics is characteristic of the Bronze Age?",
    },
    options: {
      ru: ["Глазурованная", "Лепная с геометрическим орнаментом", "Фарфор", "Стеклянная"],
      kz: ["Глазурь жағылған", "Геометриялық өрнекті қолдан жасалған", "Фарфор", "Шыны"],
      en: ["Glazed", "Hand-molded with geometric ornament", "Porcelain", "Glass"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 87,
    topic: "kazakh_khanate",
    question: {
      ru: "Какой хан объединил три жуза?",
      kz: "Үш жүзді қай хан біріктірді?",
      en: "Which khan united the three zhuzes?",
    },
    options: {
      ru: ["Касым хан", "Абылай хан", "Тауке хан", "Кенесары хан"],
      kz: ["Қасым хан", "Абылай хан", "Тәуке хан", "Кенесары хан"],
      en: ["Kasym Khan", "Abylai Khan", "Tauke Khan", "Kenesary Khan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 88,
    topic: "iron_age",
    question: {
      ru: "Какой стиль искусства был характерен для саков?",
      kz: "Сақтарға қандай өнер стилі тән болды?",
      en: "What style of art was characteristic of the Sakas?",
    },
    options: {
      ru: ["Реалистический", "Звериный стиль", "Абстрактный", "Геометрический"],
      kz: ["Реалистік", "Аң стилі", "Абстрактілі", "Геометриялық"],
      en: ["Realistic", "Animal style", "Abstract", "Geometric"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 89,
    topic: "culture",
    question: {
      ru: "Как называется казахский эпос о батырах?",
      kz: "Батырлар туралы қазақ эпосы қалай аталады?",
      en: "What is the Kazakh epic about batyrs called?",
    },
    options: {
      ru: ["Сказка", "Жыр", "Роман", "Повесть"],
      kz: ["Ертегі", "Жыр", "Роман", "Повесть"],
      en: ["Fairy tale", "Zhyr", "Novel", "Story"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 90,
    topic: "bronze_age",
    question: {
      ru: "Какое открытие сделали в Ботае?",
      kz: "Ботайда қандай ашылым жасалды?",
      en: "What discovery was made in Botai?",
    },
    options: {
      ru: ["Первая письменность", "Первое одомашнивание лошади", "Первый металл", "Первое колесо"],
      kz: ["Алғашқы жазу", "Жылқыны алғаш қолға үйрету", "Алғашқы металл", "Алғашқы дөңгелек"],
      en: ["First writing", "First horse domestication", "First metal", "First wheel"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 91,
    topic: "architecture",
    question: {
      ru: "Какой диаметр главного зала мавзолея Ходжи Ахмеда Ясави?",
      kz: "Қожа Ахмет Яссауи кесенесінің негізгі залының диаметрі қанша?",
      en: "What is the diameter of the main hall of the Mausoleum of Khoja Ahmed Yasawi?",
    },
    options: {
      ru: ["10 метров", "18 метров", "25 метров", "30 метров"],
      kz: ["10 метр", "18 метр", "25 метр", "30 метр"],
      en: ["10 meters", "18 meters", "25 meters", "30 meters"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 92,
    topic: "silk_road",
    question: {
      ru: "Сколько километров составлял Шелковый путь?",
      kz: "Жібек жолының ұзындығы неше километр болды?",
      en: "How many kilometers was the Silk Road?",
    },
    options: {
      ru: ["3000 км", "5000 км", "7000 км", "10000 км"],
      kz: ["3000 км", "5000 км", "7000 км", "10000 км"],
      en: ["3000 km", "5000 km", "7000 km", "10000 km"],
    },
    correctIndex: 2,
    points: 20,
  },
  {
    id: 93,
    topic: "medieval",
    question: {
      ru: "Какое государство предшествовало Казахскому ханству?",
      kz: "Қазақ хандығына дейін қандай мемлекет болды?",
      en: "What state preceded the Kazakh Khanate?",
    },
    options: {
      ru: ["Золотая Орда", "Ак Орда", "Могулистан", "Все перечисленные"],
      kz: ["Алтын Орда", "Ақ Орда", "Моғолстан", "Барлығы"],
      en: ["Golden Horde", "Ak Orda", "Moghulistan", "All of the above"],
    },
    correctIndex: 3,
    points: 20,
  },
  {
    id: 94,
    topic: "culture",
    question: {
      ru: "Что такое «бата»?",
      kz: "«Бата» дегеніміз не?",
      en: "What is 'bata'?",
    },
    options: {
      ru: ["Танец", "Благословение", "Песня", "Игра"],
      kz: ["Би", "Бата", "Ән", "Ойын"],
      en: ["Dance", "Blessing", "Song", "Game"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 95,
    topic: "archaeology",
    question: {
      ru: "Какой металл использовали саки для украшений?",
      kz: "Сақтар әшекейлер үшін қандай металл қолданды?",
      en: "What metal did the Sakas use for jewelry?",
    },
    options: {
      ru: ["Железо", "Золото", "Медь", "Олово"],
      kz: ["Темір", "Алтын", "Мыс", "Қалайы"],
      en: ["Iron", "Gold", "Copper", "Tin"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 96,
    topic: "kazakh_khanate",
    question: {
      ru: "Что означает слово «хан»?",
      kz: "«Хан» сөзі нені білдіреді?",
      en: "What does the word 'khan' mean?",
    },
    options: {
      ru: ["Воин", "Правитель", "Жрец", "Торговец"],
      kz: ["Жауынгер", "Билеуші", "Абыз", "Саудагер"],
      en: ["Warrior", "Ruler", "Priest", "Merchant"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 97,
    topic: "iron_age",
    question: {
      ru: "Какое оружие было характерно для саков?",
      kz: "Сақтарға қандай қару тән болды?",
      en: "What weapon was characteristic of the Sakas?",
    },
    options: {
      ru: ["Меч и лук", "Пушка", "Арбалет", "Ружье"],
      kz: ["Қылыш пен садақ", "Зеңбірек", "Арбалет", "Мылтық"],
      en: ["Sword and bow", "Cannon", "Crossbow", "Gun"],
    },
    correctIndex: 0,
    points: 15,
  },
  {
    id: 98,
    topic: "bronze_age",
    question: {
      ru: "Какой тип хозяйства был основным в бронзовом веке?",
      kz: "Қола дәуірінде қандай шаруашылық түрі негізгі болды?",
      en: "What type of economy was main in the Bronze Age?",
    },
    options: {
      ru: ["Охота", "Скотоводство", "Торговля", "Рыболовство"],
      kz: ["Аңшылық", "Мал шаруашылығы", "Сауда", "Балық аулау"],
      en: ["Hunting", "Cattle breeding", "Trade", "Fishing"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 99,
    topic: "architecture",
    question: {
      ru: "Какой элемент отсутствует в мавзолее Ходжи Ахмеда Ясави?",
      kz: "Қожа Ахмет Яссауи кесенесінде қандай элемент жоқ?",
      en: "What element is missing in the Mausoleum of Khoja Ahmed Yasawi?",
    },
    options: {
      ru: ["Купол", "Минарет", "Портал", "Айван"],
      kz: ["Күмбез", "Мұнара", "Портал", "Айуан"],
      en: ["Dome", "Minaret", "Portal", "Iwan"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 100,
    topic: "silk_road",
    question: {
      ru: "Что означает название «Шелковый путь»?",
      kz: "«Жібек жолы» атауы нені білдіреді?",
      en: "What does the name 'Silk Road' mean?",
    },
    options: {
      ru: ["Путь из шелка", "Торговый путь, по которому везли шелк", "Путь к шелку", "Шелковистая дорога"],
      kz: ["Жібектен жасалған жол", "Жібек тасымалданған сауда жолы", "Жібекке апаратын жол", "Жібектей жол"],
      en: ["Road made of silk", "Trade route along which silk was transported", "Path to silk", "Silky road"],
    },
    correctIndex: 1,
    points: 15,
  },
];

export const getQuestionsByTopic = (topic: string): QuizQuestion[] => {
  if (topic === "all") return allQuizQuestions;
  return allQuizQuestions.filter(q => q.topic === topic);
};

export const getRandomQuestions = (count: number, topic?: string): QuizQuestion[] => {
  const questions = topic && topic !== "all" ? getQuestionsByTopic(topic) : allQuizQuestions;
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};