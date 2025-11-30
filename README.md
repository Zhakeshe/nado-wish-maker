# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/4501ceef-7998-4282-87bb-f27c5d989195

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4501ceef-7998-4282-87bb-f27c5d989195) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4501ceef-7998-4282-87bb-f27c5d989195) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Жобаны жақсарту бойынша ұсыныстар

Төменде MuseoNet платформасын әрі қарай дамытуға арналған идеялар жинағы берілген. Әр бөлім нақты әсер беретін қадамдарды сипаттайды, осылайша өнімділік, қолданушы тәжірибесі және контент сапасы қатар жақсарады.

### Сайтқа дереу енгізуге болатын 10 нақты өзгеріс

1. **Басты баннерді нақты CTA-мен жаңарту:** басты бетке «3D коллекцияны қарау» және «Ойынды бастау» деген екі батырмадан тұратын айқын хиро блок қойып, фондық бейне/рендерді жеңілдетілген суретпен ауыстыру.
2. **Жылдам іздеу мен сүзгілер:** коллекция бетінде тақырып, дәуір, аймақ бойынша фильтрлері бар бір қатарлы хариуа (toolbar) және live-search қосу; нәтижелерді «N модель табылды» деген чиппен көрсету.
3. **Коллекция карточкаларын байыту:** карточкаларға 3D preview түймесі, қысқа тарихи титр және «таңдаулыларға қосу» иконкасы енгізу; hover кезінде мини-аралық анимация қосу.
4. **3D көрерменді жақсарту:** жарық/фон режимдерін ауыстыратын toggle, «камераны бастапқы күйге қайтару» және «өлшеу сызығы» (ruler overlay) батырмаларын орналастыру; модель жүктелгенше skeleton және пайыздық прогресс шығару.
5. **Ойын интерфейсі:** викторинаға прогресс жолақ, қалған сұрақ/уақыт индикаторы және «қайта ойнау» батырмасы қосу; жауаптан кейін дереккөз сілтемесі бар қысқа түсіндірме шығару.
6. **Навигация мен футерді жеңілдету:** негізгі мәзірді 5-6 негізгі пунктпен шектеу, футерге байланыс, әлеуметтік желі және тіл ауыстыру сілтемелерін қою.
7. **Кері байланыс модулі:** әр бетте оң жақ төменде «Пікір қалдыру» қалқыма түймесін шығарып, қысқа форманы Supabase вебхугіне жіберу.
8. **Қолжетімділік пен локализация:** барлық интерактивті элементтерге aria-label беру, тіл ауыстырғанда бет метадеректерін (title/description) де локализациялау, пернетақтамен толық басқаруды тексеру.
9. **Қолданушылар ағынын бақылау:** жазылу/кіру, ойын бастау, модель ашу оқиғаларын аналитикаға (Plausible/PostHog) жіберіп, дашбордта «қай беттен кетті?» кестесін шығару.
10. **Өнімділікке тез жеңістер:** басты беттегі басты шрифтті алдын ала жүктеу (preload), Hero суреттерін 1200px WebP-ке қысу, LCP аймағына жақын компоненттерді code-splitting-тен босату, ал төменгі контентті lazy-load ету.

### Контент пен қауымдастық

- **3D контентті кеңейту:** жаңа тарихи нысандарды қосып, әр модельге қысқаша тарихи анықтама мен дереккөздер тізімін тіркеу.
- **Мақала/жоба модерациясы:** пайдаланушылар ұсынған материалдарды сапаға тексеретін редактор рөлі мен чеклист енгізу.
- **Қауымдастық марапаттары:** белсенді қолданушыларға бейдждер мен ай сайынғы лидерборд жасап, әлеуметтік бөлісу батырмаларын қосу.

### Ойын және геймификация
- **Көп деңгейлі викториналар:** география, архитектура және тұлғалар тақырыптары бойынша прогрессивті қиындықтағы сұрақтар топтамасын қосу.
- **Динамикалық карта:** ойын кезінде ел картасында нысанның орналасуын интерактивті түрде көрсету, жауаптан кейін түсініктеме шығару.
- **Миссиялар мен күнделікті тапсырмалар:** күн сайынғы квесттер, сериялы кіру (streak) бонусы және маусымдық челлендждер енгізу.

### UI/UX және қолжетімділік
- **Тілді ауыстыру жақсарту:** интерфейстегі барлық мәтіндерді контекстке байланған аудармаларға көшіру және тілдер арасындағы сәйкестікті автоматты тесттермен тексеру.
- **Экран оқу құралдарына бейімдеу:** ARIA атрибуттарын толықтыру, клавиатурамен навигацияны сынау, контраст пен шрифт өлшемдерін тексеру.
- **Кері байланыс ілмегі:** әр бетке қысқа пікір/бағалау формасын орналастырып, нәтижелерді аналитикаға біріктіру.

### Өнімділік және техникалық жақсартулар
- **3D активтерді оңтайландыру:** GLTF/GLB файлдарын сығу, текстураларды WebP форматында беру және lazy-loading қолдану.
- **Кэштеу мен CDN:** статикалық ресурстарды CDN арқылы таратып, Service Worker көмегімен офлайн-кэш ұйымдастыру.
- **Мониторинг:** Sentry немесе LogRocket сияқты құралдармен қателерді, сондай-ақ Web Vitals метрикаларын жинау.

### Деректер және интеграциялар
- **Supabase ережелері:** рөлге негізделген қолжетімділікті нақтылап, жазбаларды өңдеу/өшіру саясаттарын бекіту.
- **GIS және карта сервистері:** нысан координаттарын сақтау үшін Supabase/PostGIS қолдану, ал фронтендте картаны Mapbox немесе Leaflet арқылы көрсету.
- **Аналитика:** қандай бөлімдер жиі ашылатынын түсіну үшін экран/оқиға трекингін (мысалы, Plausible немесе PostHog) қосу.

### Процестер мен сапаны бақылау
- **CI/CD толықтыру:** lint, type-check және тесттерді GitHub Actions-та міндетті қадам ету, алдын ала қарау (preview) деплойларын қосу.
- **UI тесттері:** негізгі ағымдар үшін Playwright/Jest + Testing Library тесттерін қосып, тіл ауысуы мен форма валидациясын тексеру.
- **Қауіпсіздік аудиті:** тәуелділіктерді автоматты тексеру (Dependabot), контент жүктеу шектеулері және файл өлшем/формат валидациясы.
