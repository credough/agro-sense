# AgroSense Development Setup

Standard workflow natin. Ito guide natin para maiwasan ang conflicts at environment issues.

---
```bash
agro-sense/
│
├── manage.py
├── requirements.txt
├── README.md
├── db.sqlite3
│
├── agrosense/
├── core/
├── ai/
├── decision/
├── risk/
└── weather/
```

## 1. Clone Repository

```bash
git clone <REPO_URL>
cd agrosense
```

## 2. Activate Virtual Environment

**Windows (CMD):**
```bash
venv\Scripts\activate
```

**Note:**  
Kailangang i-activate muna ang venv sa everytime na mag-rurun ng commands.

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

Kapag first setup o pag may bagong packages.

## 4. Environment Variables (.env)

Make sure na may `.env` file sa root folder.

**Example:**
```
DEBUG=True
SECRET_KEY=<your_secret_key>
OPEN_METEO_API_KEY=<your_key>
AGRI_LLM_API_KEY=<your_key>
```

**Huwag i-commit ang .env.**

## 5. Initial Run

```bash
python manage.py migrate
python manage.py runserver
```

## 6. Branching Rules

**Branches:**
- `main` → Stable branch (walang unfinished code, walang magpupush dito) 
- `dev` → Integration branch
- `feature branches` → Working branches (dito tayo magpaparallel development)

## 7. Creating Feature Branch

```bash
git checkout dev
git pull
git checkout -b feature/<feature-name>
```

**Example:**
- `feature/weather-api`
- `feature/risk-calculation`


## 8. Regular Workflow

**habang nagde-develop:**
```bash
git add .
git commit -m "Short description of changes"
git push origin feature/<feature-name>
```

**pagkatapos:**
- Gumawa ng Pull Request papuntang `dev`
- Huwag diretso sa `main`

## 9. Merge Flow

```
feature branch → dev → main
```

Merge to `main` only kapag stable at tested. (ako na bahala rito pre)

## 10. Folder Responsibility Reminder

**Core rule:**  
Huwag paghaluin ang logic ng apps.

**Examples:**
- Weather logic → `weather/`
- Decision logic → `decision/`
- Risk calculations → `risk/`
- AI explanation → `ai/`
- Alerts → `alerts/`

## 11. Important Notes

- ❌ Huwag i-commit ang `.env`
- ❌ Huwag i-commit ang `venv/`
- ✅ Maliit at madalas na commits
- ✅ I-test locally bago mag-PR