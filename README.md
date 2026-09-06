This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





# SkyFitnessPro — Онлайн-платформа тренировок

Фронтенд-приложение для фитнеса, разработанное на **Next.js 14+ (App Router)** и **TypeScript** с использованием **Tailwind CSS**.

## 🛠️ Текущий стек и архитектура
- **Фреймворк:** Next.js (клиент-серверная архитектура, параллельные и перехваченные роуты `@auth/(.)auth`).
- **Стилизация:** Tailwind CSS.
- **Глобальный стейт:** React Context (`AuthContext`) для реактивного SPA-управления авторизацией без перезагрузок страниц.
- **База данных/API:** Реальный внешний бэкенд, запросы выполняются через централизованный метод `apiFetch` с автоматическим прикреплением Bearer-токена из `localStorage`.

---

## 🔥 Реализованный функционал

1. **Главная страница (`/`)**
   - Динамический вывод 5 курсов с бэкенда.
   - Железная сортировка карточек по полю `order` на уровне API.
   - Подстановка уникальных локальных картинок и цветов фонов из папки `public/images/` на основе соответствия `nameRU`.
   - Защита от падения Next.js при отсутствии изображений в базе данных (фолбек на фронтенде).
   - Интерактивная кнопка **«Плюс»** для добавления курса текущему пользователю в реальном времени.

2. **Модальное окно Авторизации (`/auth/signin` и `/auth/signup`)**
   - Реализовано через **Intercepting Routes** (`@auth/(.)auth`) поверх главной страницы.
   - Фон плавно затемняется с размытием (`backdrop-blur`).
   - Окно автоматически закрывается по клику на темную область вокруг или по клику на логотип.
   - Переключение между режимами «Войти» и «Зарегистрироваться» происходит бесшовно (SPA-стиль) без перезагрузки вкладки.

3. **Личный кабинет (`/profile`)**
   - Страница защищена клиентским редиректом (`router.replace('/')`), если токен отсутствует.
   - Шапка (`Header`) динамически отображает аватар и имя пользователя (вырезается из Email до `@`) вместо кнопки «Войти».
   - Реализовано выпадающее меню пользователя с кнопками «Мой профиль» и «Выйти» (в круглой обводке, закрывается по клику вокруг).
   - Блок **«Мои курсы»** выводит строго те карточки, ID которых сохранены в массиве `profile.selectedCourses` на бэкенде.
   - Кнопка **«Минус»** точечно отправляет `DELETE` запрос на сервер и мгновенно убирает карточку из стейта без перезагрузки страницы.
