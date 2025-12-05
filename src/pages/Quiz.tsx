import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Award, CheckCircle, XCircle, Clock, Play, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useLanguage } from "@/contexts/LanguageContext";

const QUIZ_TIME_SECONDS = 300; // 5 minutes

interface QuizQuestion {
  id: number;
  question: { ru: string; kz: string; en: string };
  options: { ru: string[]; kz: string[]; en: string[] };
  correctIndex: number;
  points: number;
}

const quizQuestions: QuizQuestion[] = [
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
];

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
  const { toast } = useToast();
  const { language } = useLanguage();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
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
  }, [isTimerRunning, timeLeft, score, language, toast]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(QUIZ_TIME_SECONDS);
    setIsTimerRunning(true);
    setScore(0);
    setCorrectAnswers(0);
    setTotalAttempts(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
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
          const { data: profile } = await supabase
            .from('profiles')
            .select('points')
            .eq('user_id', user.id)
            .single();

          if (profile) {
            await supabase
              .from('profiles')
              .update({ points: (profile.points || 0) + points })
              .eq('user_id', user.id);

            await supabase
              .from('points_history')
              .insert({
                user_id: user.id,
                points,
                action: 'quiz_correct_answer',
                description: `Правильный ответ в квизе`
              });
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
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      setIsTimerRunning(false);
      toast({
        title: language === 'ru' ? "Квиз завершен!" : language === 'kz' ? "Квиз аяқталды!" : "Quiz completed!",
        description: language === 'ru' ? `Итоговый счёт: ${score}` : language === 'kz' ? `Жалпы ұпай: ${score}` : `Final score: ${score}`,
      });
      setGameStarted(false);
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
      next: "Следующий вопрос",
      howToPlay: "Как играть:",
      step1: "Прочитайте вопрос",
      step2: "Выберите один из вариантов ответа",
      step3: "Получите очки за правильный ответ",
      step4: "+30 секунд за каждый правильный ответ",
      startGame: "Начать квиз",
      timeLeft: "Осталось времени",
    },
    kz: {
      title: "Тарихи викторина",
      subtitle: "Қазақстан тарихы бойынша білімдеріңізді тексеріңіз",
      points: "Ұпай",
      question: "Сұрақ",
      accuracy: "Дәлдік",
      correct: "Дұрыс",
      check: "Тексеру",
      next: "Келесі сұрақ",
      howToPlay: "Қалай ойнау керек:",
      step1: "Сұрақты оқыңыз",
      step2: "Жауап нұсқаларының бірін таңдаңыз",
      step3: "Дұрыс жауап үшін ұпай алыңыз",
      step4: "Әр дұрыс жауап үшін +30 секунд",
      startGame: "Бастау",
      timeLeft: "Қалған уақыт",
    },
    en: {
      title: "History Quiz",
      subtitle: "Test your knowledge about the history of Kazakhstan",
      points: "Points",
      question: "Question",
      accuracy: "Accuracy",
      correct: "Correct",
      check: "Check",
      next: "Next question",
      howToPlay: "How to play:",
      step1: "Read the question",
      step2: "Select one of the answer options",
      step3: "Get points for correct answers",
      step4: "+30 seconds for each correct answer",
      startGame: "Start Quiz",
      timeLeft: "Time left",
    },
  };

  const t = translations[language];

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-sand">
        <Navigation />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <Card className="max-w-lg w-full mx-4 p-8 text-center gradient-archaeology shadow-elegant">
            <div className="mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold mb-2">{t.title}</h1>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-3">{t.howToPlay}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
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

      <main className="flex-1 pt-20">
        {/* Header with Timer */}
        <section className="py-8 bg-gradient-archaeology">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full mb-4 border border-primary/20">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{t.title}</span>
              </div>
              
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                timeLeft <= 60 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-primary/10 text-primary border-primary/20'
              } border`}>
                <Clock className="w-5 h-5" />
                <span className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-4 border-y border-primary/10 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
              <Card className="p-3 text-center gradient-archaeology">
                <Star className="w-5 h-5 text-primary mx-auto mb-1 fill-primary" />
                <div className="text-xl font-bold">{score}</div>
                <div className="text-xs text-muted-foreground">{t.points}</div>
              </Card>
              <Card className="p-3 text-center gradient-archaeology">
                <Target className="w-5 h-5 text-secondary mx-auto mb-1" />
                <div className="text-xl font-bold">{currentQuestionIndex + 1}/{quizQuestions.length}</div>
                <div className="text-xs text-muted-foreground">{t.question}</div>
              </Card>
              <Card className="p-3 text-center gradient-archaeology">
                <Trophy className="w-5 h-5 text-accent mx-auto mb-1" />
                <div className="text-xl font-bold">{accuracy}%</div>
                <div className="text-xs text-muted-foreground">{t.accuracy}</div>
              </Card>
              <Card className="p-3 text-center gradient-archaeology">
                <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-xl font-bold">{correctAnswers}</div>
                <div className="text-xs text-muted-foreground">{t.correct}</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Quiz Area */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="p-6 gradient-archaeology shadow-elegant">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  {t.question} {currentQuestionIndex + 1} • +{currentQuestion.points} {t.points.toLowerCase()}
                </Badge>

                <h2 className="font-serif text-xl font-bold mb-6">
                  {currentQuestion.question[language]}
                </h2>

                <div className="space-y-3 mb-6">
                  {currentQuestion.options[language].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showResult && setSelectedOption(index)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-lg text-left transition-all border-2 ${
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