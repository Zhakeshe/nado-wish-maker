import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Award, CheckCircle, XCircle, Clock, Play, Brain, RotateCcw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";

const QUIZ_TIME_SECONDS = 300; // 5 minutes
const QUESTIONS_PER_LEVEL = 10;

interface QuizQuestion {
  id: number;
  question: { ru: string; kz: string; en: string };
  options: { ru: string[]; kz: string[]; en: string[] };
  correctIndex: number;
  points: number;
}

const allQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
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
    id: 12,
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
    points: 20,
  },
  {
    id: 13,
    question: {
      ru: "Какой древний город был разрушен монголами в 1219 году?",
      kz: "1219 жылы моңғолдар қай ежелгі қаланы қиратты?",
      en: "Which ancient city was destroyed by the Mongols in 1219?",
    },
    options: {
      ru: ["Туркестан", "Отрар", "Сауран", "Сыганак"],
      kz: ["Түркістан", "Отырар", "Сауран", "Сығанақ"],
      en: ["Turkestan", "Otrar", "Sauran", "Syganak"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 14,
    question: {
      ru: "Как называется традиционное казахское жилище?",
      kz: "Қазақтың дәстүрлі тұрғын үйі қалай аталады?",
      en: "What is the traditional Kazakh dwelling called?",
    },
    options: {
      ru: ["Изба", "Юрта", "Чум", "Типи"],
      kz: ["Изба", "Киіз үй", "Чум", "Типи"],
      en: ["Izba", "Yurt", "Chum", "Tipi"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 15,
    question: {
      ru: "Какой хан принял свод законов «Жеты Жаргы»?",
      kz: "«Жеті Жарғы» заңдар жинағын қай хан қабылдады?",
      en: "Which khan adopted the code of laws 'Zheti Zhargy'?",
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
    id: 16,
    question: {
      ru: "К какому веку относится культура Андроново?",
      kz: "Андронов мәдениеті қай ғасырға жатады?",
      en: "To which millennium does the Andronovo culture belong?",
    },
    options: {
      ru: ["I тыс. до н.э.", "II тыс. до н.э.", "III тыс. до н.э.", "IV тыс. до н.э."],
      kz: ["б.з.д. I мыңжылдық", "б.з.д. II мыңжылдық", "б.з.д. III мыңжылдық", "б.з.д. IV мыңжылдық"],
      en: ["1st millennium BC", "2nd millennium BC", "3rd millennium BC", "4th millennium BC"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 17,
    question: {
      ru: "Какое животное было священным у саков?",
      kz: "Сақтарда қандай жануар қасиетті болды?",
      en: "Which animal was sacred to the Sakas?",
    },
    options: {
      ru: ["Лев", "Олень", "Медведь", "Волк"],
      kz: ["Арыстан", "Бұғы", "Аю", "Қасқыр"],
      en: ["Lion", "Deer", "Bear", "Wolf"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 18,
    question: {
      ru: "Где находится мавзолей Арыстан-Баба?",
      kz: "Арыстанбаб кесенесі қайда орналасқан?",
      en: "Where is the Arystan-Bab mausoleum located?",
    },
    options: {
      ru: ["Алматы", "Туркестан", "Шымкент", "Тараз"],
      kz: ["Алматы", "Түркістан", "Шымкент", "Тараз"],
      en: ["Almaty", "Turkestan", "Shymkent", "Taraz"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 19,
    question: {
      ru: "Какой знаменитый учёный родился в городе Отрар?",
      kz: "Қай атақты ғалым Отырар қаласында туылды?",
      en: "Which famous scientist was born in the city of Otrar?",
    },
    options: {
      ru: ["Ибн Сина", "Аль-Фараби", "Аль-Хорезми", "Улугбек"],
      kz: ["Ибн Сина", "Әл-Фараби", "Әл-Хорезми", "Ұлықбек"],
      en: ["Ibn Sina", "Al-Farabi", "Al-Khwarizmi", "Ulugbek"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 20,
    question: {
      ru: "Сколько жузов в казахском обществе?",
      kz: "Қазақ қоғамында неше жүз бар?",
      en: "How many zhuzes are there in Kazakh society?",
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
    id: 21,
    question: {
      ru: "Какой инструмент является символом казахской музыки?",
      kz: "Қазақ музыкасының символы қандай аспап?",
      en: "Which instrument is a symbol of Kazakh music?",
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
    id: 22,
    question: {
      ru: "В каком году был найден Золотой человек?",
      kz: "Алтын адам қай жылы табылды?",
      en: "In what year was the Golden Man found?",
    },
    options: {
      ru: ["1969", "1970", "1978", "1985"],
      kz: ["1969", "1970", "1978", "1985"],
      en: ["1969", "1970", "1978", "1985"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 23,
    question: {
      ru: "Какой город был столицей Западно-Тюркского каганата?",
      kz: "Батыс Түрік қағанатының астанасы қай қала болды?",
      en: "Which city was the capital of the Western Turkic Khaganate?",
    },
    options: {
      ru: ["Тараз", "Суяб", "Отрар", "Баласагун"],
      kz: ["Тараз", "Суяб", "Отырар", "Баласағұн"],
      en: ["Taraz", "Suyab", "Otrar", "Balasagun"],
    },
    correctIndex: 1,
    points: 25,
  },
  {
    id: 24,
    question: {
      ru: "Кто такой Коркыт-ата?",
      kz: "Қорқыт ата кім?",
      en: "Who is Korkyt-ata?",
    },
    options: {
      ru: ["Поэт", "Легендарный музыкант и мыслитель", "Военачальник", "Хан"],
      kz: ["Ақын", "Аңызға айналған музыкант және ойшыл", "Қолбасшы", "Хан"],
      en: ["Poet", "Legendary musician and thinker", "Military commander", "Khan"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 25,
    question: {
      ru: "Какое государство существовало на территории Казахстана в VI-VIII веках?",
      kz: "VI-VIII ғасырларда Қазақстан аумағында қандай мемлекет болды?",
      en: "Which state existed on the territory of Kazakhstan in the 6th-8th centuries?",
    },
    options: {
      ru: ["Золотая Орда", "Тюркский каганат", "Казахское ханство", "Монгольская империя"],
      kz: ["Алтын Орда", "Түрік қағанаты", "Қазақ хандығы", "Моңғол империясы"],
      en: ["Golden Horde", "Turkic Khaganate", "Kazakh Khanate", "Mongol Empire"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 26,
    question: {
      ru: "Что означает слово «казах»?",
      kz: "«Қазақ» сөзі нені білдіреді?",
      en: "What does the word 'Kazakh' mean?",
    },
    options: {
      ru: ["Воин", "Свободный, вольный", "Кочевник", "Охотник"],
      kz: ["Жауынгер", "Еркін, азат", "Көшпенді", "Аңшы"],
      en: ["Warrior", "Free, independent", "Nomad", "Hunter"],
    },
    correctIndex: 1,
    points: 15,
  },
  {
    id: 27,
    question: {
      ru: "В каком году Казахстан провозгласил независимость?",
      kz: "Қазақстан тәуелсіздігін қай жылы жариялады?",
      en: "In what year did Kazakhstan declare independence?",
    },
    options: {
      ru: ["1990", "1991", "1992", "1993"],
      kz: ["1990", "1991", "1992", "1993"],
      en: ["1990", "1991", "1992", "1993"],
    },
    correctIndex: 1,
    points: 10,
  },
  {
    id: 28,
    question: {
      ru: "Какой мавзолей находится рядом с городом Тараз?",
      kz: "Тараз қаласының жанында қай кесене орналасқан?",
      en: "Which mausoleum is located near the city of Taraz?",
    },
    options: {
      ru: ["Ходжи Ахмеда Ясави", "Айша-Биби", "Арыстан-Баба", "Жусупа Баласагуни"],
      kz: ["Қожа Ахмет Яссауи", "Айша бибі", "Арыстанбаб", "Жүсіп Баласағұни"],
      en: ["Khoja Ahmed Yasawi", "Aisha-Bibi", "Arystan-Bab", "Yusuf Balasaguni"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 29,
    question: {
      ru: "Какой хан объединил три жуза в XVIII веке?",
      kz: "XVIII ғасырда үш жүзді қай хан біріктірді?",
      en: "Which khan united the three zhuzes in the 18th century?",
    },
    options: {
      ru: ["Тауке хан", "Абылай хан", "Касым хан", "Кенесары хан"],
      kz: ["Тәуке хан", "Абылай хан", "Қасым хан", "Кенесары хан"],
      en: ["Tauke Khan", "Abylai Khan", "Kasym Khan", "Kenesary Khan"],
    },
    correctIndex: 1,
    points: 20,
  },
  {
    id: 30,
    question: {
      ru: "Какой древний город находился на пути Великого Шёлкового пути в Южном Казахстане?",
      kz: "Оңтүстік Қазақстанда Ұлы Жібек жолы бойында қай ежелгі қала орналасқан?",
      en: "Which ancient city was located on the Great Silk Road in Southern Kazakhstan?",
    },
    options: {
      ru: ["Семей", "Испиджаб", "Актобе", "Караганда"],
      kz: ["Семей", "Испиджаб", "Ақтөбе", "Қарағанды"],
      en: ["Semey", "Ispidzhab", "Aktobe", "Karaganda"],
    },
    correctIndex: 1,
    points: 25,
  },
];

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(allQuizQuestions);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  const questionsInLevel = Math.min(QUESTIONS_PER_LEVEL, quizQuestions.length);
  const levelProgress = ((currentQuestionIndex % questionsInLevel) + 1) / questionsInLevel * 100;

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0 && !showLevelComplete) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      toast({
        title: language === 'ru' ? "Время вышло!" : language === 'kz' ? "Уақыт бітті!" : "Time's up!",
        description: language === 'ru' ? `Ваш счёт: ${score}` : language === 'kz' ? `Сіздің ұпайыңыз: ${score}` : `Your score: ${score}`,
        variant: "destructive",
      });
      setGameStarted(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, score, language, toast, showLevelComplete]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const startGame = () => {
    setQuizQuestions(shuffleArray(allQuizQuestions));
    setGameStarted(true);
    setTimeLeft(QUIZ_TIME_SECONDS);
    setIsTimerRunning(true);
    setScore(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setCurrentLevel(1);
    setShowLevelComplete(false);
  };

  const continueToNextLevel = () => {
    setQuizQuestions(shuffleArray(allQuizQuestions));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setCurrentLevel(prev => prev + 1);
    setShowLevelComplete(false);
    setTimeLeft(prev => prev + 60); // Bonus time for next level
    toast({
      title: language === 'ru' ? `Уровень ${currentLevel + 1}!` : language === 'kz' ? `${currentLevel + 1}-деңгей!` : `Level ${currentLevel + 1}!`,
      description: language === 'ru' ? "+60 секунд бонус" : language === 'kz' ? "+60 секунд бонус" : "+60 seconds bonus",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const checkAnswer = async () => {
    if (selectedOption === null) {
      toast({
        title: language === 'ru' ? "Выберите ответ" : language === 'kz' ? "Жауапты таңдаңыз" : "Select an answer",
        variant: "destructive",
      });
      return;
    }

    const correct = selectedOption === currentQuestion.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
    setTotalAttempts(prev => prev + 1);

    if (correct) {
      const points = currentQuestion.points;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setTimeLeft(prev => prev + 30); // Add 30 seconds for correct answer

      if (user) {
        try {
          // Use secure RPC function to award points
          const { data, error } = await supabase.rpc('award_game_points', {
            action_type: 'quiz_correct_answer',
            description_text: `Правильный ответ в квизе`
          });

          if (error) {
            console.error('Error awarding points:', error);
          } else {
            console.log('Points awarded:', data);
          }
        } catch (error) {
          console.error('Error updating points:', error);
        }
      }

      toast({
        title: language === 'ru' ? "Правильно!" : language === 'kz' ? "Дұрыс!" : "Correct!",
        description: language === 'ru' ? `+${points} очков` : language === 'kz' ? `+${points} ұпай` : `+${points} points`,
      });
    } else {
      toast({
        title: language === 'ru' ? "Неправильно" : language === 'kz' ? "Қате" : "Incorrect",
        description: language === 'ru' 
          ? `Правильный ответ: ${currentQuestion.options.ru[currentQuestion.correctIndex]}` 
          : language === 'kz' 
          ? `Дұрыс жауап: ${currentQuestion.options.kz[currentQuestion.correctIndex]}`
          : `Correct answer: ${currentQuestion.options.en[currentQuestion.correctIndex]}`,
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    const isLevelComplete = (nextIndex % QUESTIONS_PER_LEVEL === 0) || nextIndex >= quizQuestions.length;
    
    if (isLevelComplete) {
      setShowLevelComplete(true);
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const translations = {
    ru: {
      title: "Исторический квиз",
      subtitle: "Проверьте свои знания о истории Казахстана",
      points: "Очки",
      question: "Вопрос",
      accuracy: "Точность",
      correct: "Верно",
      check: "Проверить",
      next: "Дальше",
      howToPlay: "Как играть:",
      step1: "Прочитайте вопрос",
      step2: "Выберите один из вариантов ответа",
      step3: "Получите очки за правильный ответ",
      step4: "+30 секунд за каждый правильный ответ",
      startGame: "Начать квиз",
      timeLeft: "Осталось",
      level: "Уровень",
      levelComplete: "Уровень пройден!",
      continueGame: "Продолжить",
      endGame: "Завершить",
      bonusTime: "+60 секунд бонус",
    },
    kz: {
      title: "Тарихи викторина",
      subtitle: "Қазақстан тарихы бойынша білімдеріңізді тексеріңіз",
      points: "Ұпай",
      question: "Сұрақ",
      accuracy: "Дәлдік",
      correct: "Дұрыс",
      check: "Тексеру",
      next: "Келесі",
      howToPlay: "Қалай ойнау керек:",
      step1: "Сұрақты оқыңыз",
      step2: "Жауап нұсқаларының бірін таңдаңыз",
      step3: "Дұрыс жауап үшін ұпай алыңыз",
      step4: "Әр дұрыс жауап үшін +30 секунд",
      startGame: "Бастау",
      timeLeft: "Қалды",
      level: "Деңгей",
      levelComplete: "Деңгей өтілді!",
      continueGame: "Жалғастыру",
      endGame: "Аяқтау",
      bonusTime: "+60 секунд бонус",
    },
    en: {
      title: "History Quiz",
      subtitle: "Test your knowledge about the history of Kazakhstan",
      points: "Points",
      question: "Question",
      accuracy: "Accuracy",
      correct: "Correct",
      check: "Check",
      next: "Next",
      howToPlay: "How to play:",
      step1: "Read the question",
      step2: "Select one of the answer options",
      step3: "Get points for correct answers",
      step4: "+30 seconds for each correct answer",
      startGame: "Start Quiz",
      timeLeft: "Left",
      level: "Level",
      levelComplete: "Level Complete!",
      continueGame: "Continue",
      endGame: "End Game",
      bonusTime: "+60 seconds bonus",
    },
  };

  const t = translations[language];

  // Level Complete Screen
  if (showLevelComplete && gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-sand">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center px-4">
          <Card className="max-w-md w-full p-6 sm:p-8 text-center gradient-archaeology shadow-elegant animate-scale-in">
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <Badge className="mb-2 bg-primary text-primary-foreground">
                {t.level} {currentLevel}
              </Badge>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">{t.levelComplete}</h1>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="p-3 text-center bg-muted/30">
                <Star className="w-5 h-5 text-primary mx-auto mb-1 fill-primary" />
                <div className="text-xl font-bold">{score}</div>
                <div className="text-xs text-muted-foreground">{t.points}</div>
              </Card>
              <Card className="p-3 text-center bg-muted/30">
                <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                <div className="text-xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">{t.accuracy}</div>
              </Card>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6 p-2 bg-green-500/10 rounded-lg">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-medium">{t.bonusTime}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={continueToNextLevel} className="flex-1 gap-2">
                <Play className="w-4 h-4" />
                {t.continueGame}
              </Button>
              <Button onClick={() => setGameStarted(false)} variant="outline" className="flex-1 gap-2">
                <RotateCcw className="w-4 h-4" />
                {t.endGame}
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-sand">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center px-4">
          <Card className="max-w-lg w-full p-6 sm:p-8 text-center gradient-archaeology shadow-elegant">
            <div className="mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-2">{t.title}</h1>
              <p className="text-muted-foreground text-sm sm:text-base">{t.subtitle}</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">{t.howToPlay}</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  {t.step1}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  {t.step2}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  {t.step3}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  {t.step4}
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Clock className="w-4 h-4" />
              <span>{t.timeLeft}: {formatTime(QUIZ_TIME_SECONDS)}</span>
            </div>

            <Button onClick={startGame} size="lg" className="w-full gap-2">
              <Play className="w-5 h-5" />
              {t.startGame}
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-sand">
      <Navigation />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Header with Timer */}
        <section className="py-4 sm:py-6 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <Badge className="bg-primary text-primary-foreground">
                  {t.level} {currentLevel}
                </Badge>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-background rounded-full border border-primary/20">
                  <Brain className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium">{t.title}</span>
                </div>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full ${
                timeLeft <= 60 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-primary/10 text-primary border-primary/20'
              } border`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xl sm:text-2xl font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
              
              {/* Level Progress Bar */}
              <div className="mt-3 max-w-xs mx-auto">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-3 sm:py-4 border-y border-primary/10 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-2xl mx-auto">
              <Card className="p-2 sm:p-3 text-center gradient-archaeology">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1 fill-primary" />
                <div className="text-base sm:text-xl font-bold">{score}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{t.points}</div>
              </Card>
              <Card className="p-2 sm:p-3 text-center gradient-archaeology">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-secondary mx-auto mb-1" />
                <div className="text-base sm:text-xl font-bold">{(currentQuestionIndex % QUESTIONS_PER_LEVEL) + 1}/{QUESTIONS_PER_LEVEL}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{t.question}</div>
              </Card>
              <Card className="p-2 sm:p-3 text-center gradient-archaeology">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-accent mx-auto mb-1" />
                <div className="text-base sm:text-xl font-bold">{accuracy}%</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{t.accuracy}</div>
              </Card>
              <Card className="p-2 sm:p-3 text-center gradient-archaeology">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1" />
                <div className="text-base sm:text-xl font-bold">{correctAnswers}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{t.correct}</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Quiz Area */}
        <section className="py-4 sm:py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="p-4 sm:p-6 gradient-archaeology shadow-elegant">
                <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 text-xs">
                  {t.question} {(currentQuestionIndex % QUESTIONS_PER_LEVEL) + 1} • +{currentQuestion.points} {t.points.toLowerCase()}
                </Badge>

                <h2 className="font-serif text-base sm:text-xl font-bold mb-4 sm:mb-6">
                  {currentQuestion.question[language]}
                </h2>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {currentQuestion.options[language].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && setSelectedOption(index)}
                      disabled={showResult}
                      className={`w-full p-3 sm:p-4 rounded-lg text-left transition-all border-2 text-sm sm:text-base ${
                        showResult
                          ? index === currentQuestion.correctIndex
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : index === selectedOption
                            ? 'bg-red-50 border-red-500 text-red-700'
                            : 'bg-muted/30 border-muted'
                          : selectedOption === index
                          ? 'bg-primary/10 border-primary'
                          : 'bg-muted/30 border-muted hover:bg-primary/5 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          showResult && index === currentQuestion.correctIndex
                            ? 'bg-green-500 text-white'
                            : showResult && index === selectedOption && index !== currentQuestion.correctIndex
                            ? 'bg-red-500 text-white'
                            : selectedOption === index
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && index === currentQuestion.correctIndex && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {showResult && index === selectedOption && index !== currentQuestion.correctIndex && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  {!showResult ? (
                    <Button onClick={checkAnswer} className="flex-1" disabled={selectedOption === null}>
                      {t.check}
                    </Button>
                  ) : (
                    <Button onClick={nextQuestion} className="flex-1">
                      {t.next}
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Quiz;