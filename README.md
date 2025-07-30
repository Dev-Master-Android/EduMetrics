<<<<<<< HEAD
# EduMetrics - Инструмент для расчёта успеваемости

Веб-приложение для расчёта среднего балла и качества знаний учащихся.

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

Откройте [http://localhost:8080](http://localhost:8080) в браузере.

### Запуск через batch файл (Windows)

Дважды кликните на файл `start.bat` в корне проекта.

## 📊 Возможности

- **Анализ по предмету** - расчёт среднего балла и качества знаний для конкретного предмета
- **Анализ по классу** - комплексный анализ успеваемости по всем предметам
- **Визуализация данных** - графики и диаграммы результатов
- **Экспорт данных** - сохранение результатов в Excel и PDF

## 🛠 Технологии

- **React 18** - современный UI фреймворк
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый сборщик
- **Tailwind CSS** - утилитарный CSS фреймворк
- **Shadcn/ui** - компоненты UI
- **Recharts** - библиотека для графиков
- **React Router** - клиентская маршрутизация

## 📦 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── ui/             # UI компоненты (shadcn/ui)
│   ├── SubjectCalculator.tsx
│   └── ClassCalculator.tsx
├── pages/              # Страницы приложения
│   ├── Index.tsx       # Главная страница
│   └── NotFound.tsx    # 404 страница
├── hooks/              # React хуки
├── lib/                # Утилиты
└── fonts/              # Шрифты
```

## 🌐 Деплой

### GitHub Pages

Проект автоматически деплоится на GitHub Pages при пуше в ветку `main`.

**URL сайта:** `https://dev-master-android.github.io/knowledge-metrics-hub/`

### Ручной деплой

```bash
# Сборка проекта
npm run build

# Просмотр сборки
npm run preview
```

## 🔧 Настройка

### Переменные окружения

Создайте файл `.env.local` для локальных настроек:

```env
VITE_APP_TITLE=EduMetrics
```

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📞 Поддержка

Если у вас есть вопросы или проблемы, создайте Issue в репозитории.
=======
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/6c1799da-1055-4341-b3fd-7633a14f4cbc

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6c1799da-1055-4341-b3fd-7633a14f4cbc) and start prompting.

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

Simply open [Lovable](https://lovable.dev/projects/6c1799da-1055-4341-b3fd-7633a14f4cbc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
>>>>>>> 8154a7e (first commit)
