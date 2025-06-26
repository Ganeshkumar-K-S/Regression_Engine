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

inference_engine/<br>
├─ client/<br>
│  ├─ public/<br>
│  │  ├─ data_scientist_.jpeg<br>
│  │  ├─ data_scientist.avif<br>
│  │  └─ no_image_found.jpg<br>
│  ├─ src/<br>
│  │  ├─ assets/<br>
│  │  │  ├─ csv.png<br>
│  │  │  ├─ json.png<br>
│  │  │  └─ logo.svg<br>
│  │  ├─ components/<br>
│  │  │  ├─ AssumptionCard.jsx<br>
│  │  │  ├─ Assumptions.jsx<br>
│  │  │  ├─ Attributes.jsx<br>
│  │  │  ├─ BuildModel.jsx<br>
│  │  │  ├─ DragDropWrapper.jsx<br>
│  │  │  ├─ DropFiles.jsx<br>
│  │  │  ├─ FeatureSelector.jsx<br>
│  │  │  ├─ GenerateReport.jsx<br>
│  │  │  ├─ Header.jsx<br>
│  │  │  ├─ Hero.jsx<br>
│  │  │  ├─ LimitationsHero.jsx<br>
│  │  │  ├─ ModelInference.jsx<br>
│  │  │  ├─ ModelingDataCard.jsx<br>
│  │  │  ├─ NullHandling.jsx<br>
│  │  │  ├─ PredictionForm.jsx<br>
│  │  │  └─ SkeletonCard.jsx<br>
│  │  ├─ hooks/<br>
│  │  │  └─ useTooltip.jsx<br>
│  │  ├─ pages/<br>
│  │  │  ├─ ExplorePage.jsx<br>
│  │  │  └─ HomePage.jsx<br>
│  │  ├─ utils/<br>
│  │  │  └─ fetchImageList.jsx<br>
│  │  ├─ App.jsx<br>
│  │  ├─ index.css<br>
│  │  └─ main.jsx<br>
│  ├─ .gitignore<br>
│  ├─ eslint.config.js<br>
│  ├─ index.html<br>
│  ├─ package-lock.json<br>
│  ├─ package.json<br>
│  ├─ README.md<br>
│  └─ vite.config.js<br>
├─ files/<br>
│  ├─ AirPassengers.csv<br>
│  ├─ Computers.csv<br>
│  ├─ diamonds_prices_2022.csv<br>
│  ├─ hh_demographic.csv<br>
│  ├─ insurance.csv<br>
│  ├─ madrid_weather.csv<br>
│  ├─ powerconsumption.csv<br>
│  ├─ product.csv<br>
│  ├─ sf_clean.csv<br>
│  └─ taco_stands.csv<br>
├─ server/<br>
│  ├─ app/<br>
│  │  ├─ _pycache_/<br>
│  │  │  ├─ _init_.cpython-313.pyc<br>
│  │  │  ├─ cache.cpython-313.pyc<br>
│  │  │  ├─ config.cpython-313.pyc<br>
│  │  │  ├─ regression.cpython-313.pyc<br>
│  │  │  ├─ routes.cpython-313.pyc<br>
│  │  │  └─ utils.cpython-313.pyc<br>
│  │  ├─ static/<br>
│  │  │  ├─ downloads/<br>
│  │  │  │  └─ styled_report.pdf<br>
│  │  │  ├─ fonts/<br>
│  │  │  │  ├─ Montserrat-Bold.ttf<br>
│  │  │  │  ├─ Montserrat-Medium.ttf<br>
│  │  │  │  └─ Montserrat-Regular.ttf<br>
│  │  │  └─ images/<br>
│  │  │     ├─ after_removing_outliers/<br>
│  │  │     ├─ assumption_1/<br>
│  │  │     ├─ assumption_2/<br>
│  │  │     ├─ assumption_3/<br>
│  │  │     ├─ assumption_4/<br>
│  │  │     ├─ assumption_5/<br>
│  │  │     ├─ before_removing_outliers/<br>
│  │  │     └─ icon.svg<br>
│  │  ├─ templates/<br>
│  │  │  └─ report.html<br>
│  │  ├─ uploads/<br>
│  │  ├─ _init_.py<br>
│  │  ├─ cache.py<br>
│  │  ├─ config.py<br>
│  │  ├─ regression.py<br>
│  │  ├─ routes.py<br>
│  │  └─ utils.py<br>
│  ├─ .gitignore<br>
│  ├─ README.md<br>
│  ├─ requirements.txt<br>
│  └─ run.py<br>
└─ .gitignore<br>


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


