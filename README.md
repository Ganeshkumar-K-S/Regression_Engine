<p align="center">
  <img src="client/src/assets/logo.svg" alt="Regression Engine Logo" width="120"/>
</p>

<h2 align="center">REGRESSION ENGINE</h2>
<p align="center">
   Unveiling insights from data, one line at a time with Linear Regression!
</p>


## Project description

Developed a web-based regression engine that enables users to upload their own datasets and perform linear regression with ease. The system includes automated handling of null values and outliers, ensuring cleaner data preprocessing. It conducts rigorous statistical assumption checks (linearity, independence of error, normality, homoscedasticity, multicollinearity) and visualizes these assumptions using Matplotlib and Seaborn.

Users can interactively predict the target variable by providing custom input features, and receive detailed regression metrics such as R², MAE, and RMSE. A professionally styled, downloadable PDF report is generated summarizing the model, assumptions, and performance insights.


## Features

- Upload your dataset (CSV, JSON format)
- Automatically detect attribute keys
- Enter the target and features
- Enter the method to treat null values
- Automatically detects and treats outliers
- Fit a linear regression model
- Generate model summary with R², MAE, MSE, RMSE
- Check linear regression assumptions (linearity, normality, multicollinearity,  Homoscedasticity, Independence of error) and visualize it
- Predict the target for user input
- Download a PDF report of the model
- User session management with caching for quick reuse

## Built with


* [![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
* [![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org/)
* [![Statsmodels](https://img.shields.io/badge/Statsmodels-Statistical%20Modeling-004B87?style=for-the-badge)](https://www.statsmodels.org/)
* [![NumPy](https://img.shields.io/badge/NumPy-Numerical%20Computing-013243?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org/)
* [![Matplotlib](https://img.shields.io/badge/Matplotlib-Plotting-orange?style=for-the-badge)](https://matplotlib.org/)
* [![Seaborn](https://img.shields.io/badge/Seaborn-Statistical%20Plots-579ACA?style=for-the-badge)](https://seaborn.pydata.org/)
* [![SciPy](https://img.shields.io/badge/SciPy-Scientific%20Computing-8CAAE6?style=for-the-badge&logo=scipy&logoColor=white)](https://scipy.org/)
* [![Scikit-learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
* [![Flask](https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
* [![Jinja2](https://img.shields.io/badge/Jinja2-Templating-B41717?style=for-the-badge)](https://jinja.palletsprojects.com/)
* [![WeasyPrint](https://img.shields.io/badge/WeasyPrint-PDF%20Generator-CC0000?style=for-the-badge)](https://weasyprint.org/)
* [![React.js](https://img.shields.io/badge/React.js-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)


## File structure

```bash
Regression_Engine/
├─ client/
│  ├─ public/
│  │  ├─ data_scientist_.jpeg
│  │  ├─ data_scientist.avif
│  │  └─ no_image_found.jpg
│  ├─ src/
│  │  ├─ assets/
│  │  │  ├─ csv.png
│  │  │  ├─ json.png
│  │  │  └─ logo.svg
│  │  ├─ components/
│  │  │  ├─ AssumptionCard.jsx
│  │  │  ├─ Assumptions.jsx
│  │  │  ├─ Attributes.jsx
│  │  │  ├─ BuildModel.jsx
│  │  │  ├─ DragDropWrapper.jsx
│  │  │  ├─ DropFiles.jsx
│  │  │  ├─ FeatureSelector.jsx
│  │  │  ├─ GenerateReport.jsx
│  │  │  ├─ Header.jsx
│  │  │  ├─ Hero.jsx
│  │  │  ├─ LimitationsHero.jsx
│  │  │  ├─ ModelInference.jsx
│  │  │  ├─ ModelingDataCard.jsx
│  │  │  ├─ NullHandling.jsx
│  │  │  ├─ PredictionForm.jsx
│  │  │  └─ SkeletonCard.jsx
│  │  ├─ hooks/
│  │  │  └─ useTooltip.jsx
│  │  ├─ pages/
│  │  │  ├─ ExplorePage.jsx
│  │  │  └─ HomePage.jsx
│  │  ├─ utils/
│  │  │  └─ fetchImageList.jsx
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .gitignore
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  └─ vite.config.js
├─ server/
│  ├─ app/
│  │  ├─ static/
│  │  │  ├─ downloads/
│  │  │  ├─ fonts/
│  │  │  │  ├─ Montserrat-Bold.ttf
│  │  │  │  ├─ Montserrat-Medium.ttf
│  │  │  │  └─ Montserrat-Regular.ttf
│  │  │  └─ images/
│  │  │     ├─ after_removing_outliers/
│  │  │     ├─ assumption_1/
│  │  │     ├─ assumption_2/
│  │  │     ├─ assumption_3/
│  │  │     ├─ assumption_4/
│  │  │     ├─ assumption_5/
│  │  │     ├─ before_removing_outliers/
│  │  │     └─ icon.svg
│  │  ├─ templates/
│  │  │  └─ report.html
│  │  ├─ uploads/
│  │  ├─ __init__.py
│  │  ├─ cache.py
│  │  ├─ config.py
│  │  ├─ regression.py
│  │  ├─ routes.py
│  │  └─ utils.py
│  ├─ .gitignore
│  ├─ requirements.txt
│  └─ run.py
├─ .gitignore
└─ README.md
```

## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

* Download GTK for Windows at [https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases](https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases)

### Installation and usage

1. Clone the repository
  ```sh
   git clone https://github.com/Ganeshkumar-K-S/Regression_Engine.git
  ```
2. Create & Activate a Virtual Environment at server(Optional but Recommended)

```sh
# Windows
cd server
python -m venv venv
venv\Scripts\activate

# macOS/Linux
cd server
python3 -m venv venv
source venv/bin/activate
```
3. Install Backend Dependencies
```sh
pip install -r requirements.txt
```
4. Install Frontend Dependencies
```sh
cd client
npm install tailwindcss @tailwindcss/vite tailwind-scrollbar
npm install react-dropzone @heroicons/react @hello-pangea/dnd
npm install react-loading-skeleton
npm install react-tooltip
npm install react-select framer-motion lucide-react
```

5. Run the Backend Server
```sh
# From the root directory (where Flask app is located)
python app.py
```
6. Run the frontend react
```sh
cd client
npm run dev
```
7. Open the link in browser


## Acknowledgments

* [Python Data Analysis: NumPy & Pandas Masterclass](https://www.udemy.com/share/106QPS3@BYoFy006YfktNQLcqcxjrvwlbnNf8xWr8VUKMl7a9NUIDFdNoi8mPLcRtrQacikmsg==/)
* [Python Data Visualization: Matplotlib & Seaborn Masterclass](https://www.udemy.com/share/107yGY3@xZsu-x_GJjjC0CszJ9_VUdYvQKfIJnKA15ysXpPr1JqVtlgeOt3UwachY2ZyZA_B2g==/)
* [Python Data Science: Regression & Forecasting](https://www.udemy.com/share/109ZsU3@pLSD0tPTuz22ky4C3xukoFjMZPFsSIJjEWAFfs0aJczF669J9nNlqnMfVdwBE1oNMA==/)

## Contributors

* Harivansh B
* Ganesh Kumar K S
* Harish D


