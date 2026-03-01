# AgroSense

> **"Minimizing Crop Loss, Water Wastage, while Maximizing Crop Growth and Profit"**

AgroSense is a web-based decision-support system that converts 3–5 day weather forecasts into growth-stage-specific irrigation advisories for smallholder rice farmers in rain-prone areas of the Philippines. Built on IRRI's **Alternate Wetting and Drying (AWD)** framework, it delivers a transparent 0–100 Risk Score and plain-Filipino recommendations — requiring no sensors, no technical knowledge, and no special equipment.

🔗 **Live Prototype:** [agrsense.netlify.app](https://agrsense.netlify.app/)

---

## Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Module Responsibilities](#-module-responsibilities)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Development Workflow](#-development-workflow)
- [Contributors](#-contributors)
- [Status](#-project-status)

---

## 🔍 Overview

Philippine smallholder rice farmers frequently suffer crop losses due to uninformed irrigation decisions. Despite publicly available weather data from PAGASA and open-access forecast APIs, no accessible tool existed to translate that data into clear, farm-level guidance.

AgroSense addresses this by:

- Providing **growth-stage-specific irrigation recommendations** (OK to Irrigate / Reduce Irrigation / Stop Irrigation)
- Delivering a **transparent composite Risk Score (0–100)** broken into Flood Risk, Water Stress, and Forecast Uncertainty sub-scores
- Generating **plain-Filipino explanations** accessible to farmers at a Grade 6 literacy level
- Supporting **SMS delivery** for farmers without smartphones or internet access
- Serving both **individual farmers** and **agricultural technicians / LGUs**

---

## Key Features

-  **Weather Integration** — Pulls 3–5 day forecasts from Open-Meteo with confidence ratings per day
-  **Composite Risk Scoring** — Deterministic scoring engine based on IRRI/PhilRice AWD thresholds
-  **AI-Assisted Explanation** — LLM generates plain-Filipino summaries of the computed recommendation
-  **Field Photo Analysis** *(upcoming)* — AI-inferred field water status from farmer-uploaded images
-  **SMS Alert Delivery** — Reaches farmers without smartphones or internet access
-  **LGU/Technician Dashboard** — Shareable advisory cards for barangay-level relay

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Backend     | Python, Django                    |
| Frontend    | Vanilla HTML, CSS, JavaScript     |
| Weather API | Open-Meteo                        |
| AI/LLM      | *(to be documented)*              |
| Deployment  | Netlify *(prototype)*             |
| Config      | python-decouple                   |

---

## System Architecture

```
                        ┌─────────────────┐
                        │   Farmer Input  │
                        │  Location       │
                        │  Growth Stage   │
                        │  Field Condition│
                        │  Field Photo    │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                                     ▼
     ┌────────────────┐                  ┌────────────────────┐
     │  Weather Module│                  │     AI Module      │
     │  (Open-Meteo)  │                  │  LLM Explanation   │
     │  3–5 Day Data  │                  │  Photo Analysis    │
     └────────┬───────┘                  │  (upcoming)        │
              │                          └────────┬───────────┘
              ▼                                   │
     ┌────────────────┐                           │
     │  Risk Module   │                           │
     │  Flood Risk    │                           │
     │  Water Stress  │                           │
     │  Uncertainty   │                           │
     │  Score: 0–100  │                           │
     └────────┬───────┘                           │
              │                                   │
              ▼                                   │
     ┌────────────────────────────────────────────┴──┐
     │               Decision Engine                 │
     │   OK to Irrigate / Reduce / Stop Irrigation   │
     └────────────────────────┬──────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
     ┌──────────────┐  ┌───────────┐  ┌─────────────┐
     │   Farmer     │  │   LGU /   │  │  SMS Alert  │
     │  Dashboard   │  │Technician │  │  (Offline)  │
     └──────────────┘  └───────────┘  └─────────────┘
```

---

## Project Structure

```
agro-sense/
│
├── agrosense/                  # Django project configuration
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── ai/                         # AI module — LLM explanation & photo analysis
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── core/                       # Core app — shared UI, base templates, routing
│   ├── migrations/
│   ├── static/
│   ├── templates/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── decision/                   # Decision engine — irrigation recommendation logic
│   ├── migrations/
│   ├── static/
│   ├── templates/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── risk/                       # Risk module — composite risk scoring (0–100)
│   ├── migrations/
│   ├── static/
│   ├── templates/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── weather/                    # Weather module — Open-Meteo integration
│   ├── migrations/
│   ├── static/
│   ├── templates/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── venv/                       # Virtual environment (not tracked in Git)
├── .gitignore
├── .gitattributes
├── manage.py
├── requirements.txt
└── README.md
```

---

## Module Responsibilities

### `weather/` — Weather Module
Handles all external weather data fetching and normalization.

- Integrates with **Open-Meteo API** for 3–5 day ensemble forecasts
- Handles geocoding and location-based queries
- Normalizes raw data (rainfall probability, intensity, temperature, humidity)
- Generates daily **confidence ratings** (High / Medium / Low) based on hourly precipitation variance
- Provides a stable output contract consumed by other modules:

```json
{
  "rain_probability": ...,
  "rain_intensity": ...,
  "confidence": ...
}
```

---

### `risk/` — Risk Module
Handles all scoring and risk evaluation. No AI calls, no external API calls.

- Calculates **Flood / Waterlogging Risk** sub-score
- Calculates **Water Stress Risk** sub-score
- Calculates **Forecast Uncertainty** sub-score
- Produces **Composite Risk Score (0–100)** using the formula:

```
R = (0.4 × F) + (0.4 × W) + (0.2 × U)

Where:
  F = Flood Risk sub-score (0–100)
  W = Water Stress sub-score (0–100)
  U = Forecast Uncertainty sub-score (0–100)
```

| Risk Score (R) | Recommendation      |
|----------------|---------------------|
| 0 – 35         | OK to Irrigate      |
| 36 – 65        | Reduce Irrigation   |
| 66 – 100       | Stop Irrigation     |

Key files: `calculators.py` / `services.py`, `constants.py`

---

### `decision/` — Decision Engine
The system's core logic layer. No AI calls, no external API calls.

- Maps growth stage to corresponding AWD irrigation rules
- Orchestrates inputs from the Weather and Risk modules
- Produces one of three recommendations: **OK to Irrigate**, **Reduce Irrigation**, or **Stop Irrigation**

Key files: `engine.py`, `rules.py`

---

### `ai/` — AI Module
Handles language generation and (upcoming) visual field analysis.

- **LLM Explanation** — Converts the deterministic decision output into plain-Filipino guidance accessible at a Grade 6 literacy level. The LLM does not drive the decision; it only explains it.
- **Photo Analysis** *(upcoming)* — Infers field water status from a farmer-uploaded image when manual input is unavailable.

---

### `core/` — Core App
Shared UI layer, base templates, and general routing.

---

## Installation

### Prerequisites
- Python 3.10+
- pip
- Git

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/credough/agro-sense.git
cd agro-sense
```

**2. Create and activate a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install -r requirements.txt
```

**4. Set up environment variables**

Create a `.env` file in the root directory. See [Environment Variables](#-environment-variables) below.

**5. Apply migrations**
```bash
python manage.py migrate
```

**6. Run the development server**
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` in your browser.

---

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
# Django
SECRET_KEY=your_django_secret_key_here
DEBUG=True

# Add other required keys here as the project develops
```

> **Note:** This project uses [`python-decouple`](https://pypi.org/project/python-decouple/) to manage environment variables. Never commit your `.env` file to version control.

---

## Usage

1. Open the app in your browser
2. Navigate to the **Get Advisory** section
3. Select your **province**, **crop growth stage**, and **planting date**
4. Describe your current **field condition** (Flooded / Saturated / Moist / Dry)
5. Optionally upload a **field photo** for AI-assisted condition detection
6. Click **Generate Advisory**
7. Review your irrigation recommendation, risk score breakdown, and 5-day weather outlook

---

## Development Workflow

This project follows an **Agile + Human-Centered Design (HCD)** approach across six development phases:

| Phase | Focus |
|-------|-------|
| 1 | Research & Design |
| 2 | Backend Core |
| 3 | Frontend MVP |
| 4 | AI Integration |
| 5 | Validation & Testing |
| 6 | Demo Preparation |

### Developer Assignments

| Developer | Module | Folder |
|-----------|--------|--------|
| TBD | Weather Module Lead | `weather/` |
| TBD | Risk Module Lead | `risk/` |
| TBD | Decision Engine Lead | `decision/` |
| TBD | AI Module / Core Lead | `ai/`, `core/` |

### Module Contract Rules
- `weather/` must maintain a **stable output format** — other modules depend on it
- `risk/` consumes weather outputs and field inputs — **no AI or API calls**
- `decision/` consumes weather data, risk scores, and field status — **no AI or API calls**
- `ai/` handles explanation only — **does not override or modify the decision engine output**

---

## 👥 Contributors

| Name | Role |
|------|------|
| Celindro, Aaron Creed P. | Team Member |
| Magday, John Paul E. | Team Member |
| Navarrosa, Cedric I. | Team Member |
| Novela, Ronald S. | Team Member |

---

## Project Status

> **This project is currently a work in progress.**

| Feature | Status |
|---------|--------|
| Weather Module | 🔄 In Progress |
| Risk Scoring Engine | 🔄 In Progress |
| Decision Engine | 🔄 In Progress |
| LLM Explanation | 🔄 In Progress |
| Field Photo Analysis | 🔲 Planned |
| SMS Alert Delivery | 🔲 Planned |
| Frontend UI | 🔄 In Progress |
| Deployment | ✅ Prototype Live |

---

## References

- [IRRI — Alternate Wetting and Drying (AWD)](http://www.knowledgebank.irri.org/training/fact-sheets/water-management/saving-water-alternate-wetting-drying-awd)
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [PhilRice — AWD for Mindoro Farmer](https://www.philrice.gov.ph/awd-slashes-irrigation-costs-boosts-yields-for-mindoro-farmer/)
- [FAO — Alternate Wetting and Drying](https://openknowledge.fao.org/server/api/core/bitstreams/de4695f2-a313-4ef0-b84b-1fb5d088033d/content)
- [Climate Tracker Asia — Filipino Rice Farmers and AWD](https://climatetracker.asia/filipino-rice-farmers-to-earn-extra-cash-while-cutting-methane-emissions/)

---

*Built with purpose for Filipino rice farmers. 🌾*