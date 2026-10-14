[Uploading README.md…]()
# TACTICAL TEAM — сайт

## Структура
```
index.html        — страница
css/style.css     — оформление (цвета в :root)
js/main.js        — данные и логика (участники, треки, работы)
assets/logo.png   — ваш логотип (положите файл — он появится сам)
assets/avatars/   — аватары участников (по желанию)
music/            — mp3: bpla.mp3, holodny-nozh.mp3, mertvetsy.mp3, zolotoy-ekran.mp3, strela.mp3
```

## Запуск
Откройте `index.html` в браузере. Для проверки аудио удобнее локальный сервер: `python -m http.server`.

## GitHub Pages
1. Создайте репозиторий и загрузите все файлы в корень (вместе с папкой `music` и mp3).
2. Settings → Pages → Branch: `main`, папка `/ (root)` → Save.
3. Сайт откроется по адресу `https://ВАШ-ЛОГИН.github.io/ИМЯ-РЕПОЗИТОРИЯ/`.

## Что менять
Всё в начале `js/main.js`:
- `LEADER`, `MEMBERS` — имена; `avatar: 'assets/avatars/файл.jpg'` — аватар.
- `TRACKS` — названия и пути к трекам.
- `WORKS` — работы: `{ title: 'Название', platform: 'YouTube', url: 'https://...' }`. Пока список пуст, показываются заглушки «Скоро».
Ссылки Telegram и текст контактов — в `index.html`.
