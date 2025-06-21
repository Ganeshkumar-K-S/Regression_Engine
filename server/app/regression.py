import statsmodels.api as sm
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error as mae, mean_squared_error as mse, r2_score as r2
from app.utils import encoding
import numpy as np

class Model:
    def __init__(self, df, target, features, test_size=0.2, random_state=42):
        self.df = df
        self.target = target
        self.features = features
        self.p = len(features)

        self.X = df[self.features]
        self.y = df[self.target]

        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X, self.y, test_size=test_size, random_state=random_state
        )

        self.X_train_encoded, self.bayes_mappings = encoding(self.y_train, self.X_train)
        self.X_test_encoded, _ = encoding(self.y_test, self.X_test, bayes_mappings=self.bayes_mappings)
        self.X_train_encoded = sm.add_constant(self.X_train_encoded)
        self.X_test_encoded = sm.add_constant(self.X_test_encoded)

        self.__model = sm.OLS(self.y_train, self.X_train_encoded).fit()

    def getModel(self):
        return self.__model

    def setModel(self, new_model):
        self.__model = new_model

    def getMetrics(self):
        y_pred = self.__model.predict(self.X_test_encoded)
        mae_val = mae(self.y_test, y_pred)
        mse_val = mse(self.y_test, y_pred)
        rmse_val = np.sqrt(mse_val)
        r2_val = r2(self.y_test, y_pred)
        n = len(self.y_test)
        adj_r2_val = 1 - ((1 - r2_val) * (n - 1)) / (n - self.p - 1)

        return {
            'MAE': mae_val,
            'MSE': mse_val,
            'RMSE': rmse_val,
            'R2': r2_val,
            'adjusted_R2': adj_r2_val
        }
