
# Hypothesis AI - CRO Platform

SaaS платформа для A/B тестирования текстов.

## Настройка автоматического деплоя (GitHub Actions)

Если вы загрузили код в репозиторий, но сайт не открывается:

1. **Включите GitHub Actions для Pages:**
   - Перейдите в репозиторий на GitHub.
   - Откройте **Settings** -> **Pages**.
   - В разделе **Build and deployment** -> **Source** выберите **GitHub Actions** вместо "Deploy from a branch".

2. **Добавьте секреты (обязательно):**
   - Перейдите в **Settings** -> **Secrets and variables** -> **Actions**.
   - Нажмите **New repository secret** и добавьте три ключа:
     - `API_KEY` (Ваш ключ Gemini)
     - `SUPABASE_URL` (URL из настроек Supabase)
     - `SUPABASE_ANON_KEY` (Anon key из настроек Supabase)

3. **Запустите билд:**
   - Перейдите во вкладку **Actions**.
   - Выберите воркфлоу **Deploy to GitHub Pages**.
   - Нажмите **Run workflow**.

## Ручной деплой (если не работает автоматика)

Если вы хотите залить изменения прямо сейчас с компьютера:
```bash
npm install
npm run deploy
```
