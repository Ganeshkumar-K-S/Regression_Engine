import statsmodels.api as sm
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error as mae, mean_squared_error as mse, r2_score as r2
import numpy as np
from app.utils import preprocess_onehot, bayesian_target_encoding

class Model:
    def __init__(self, df, target, features, test_size=0.2, random_state=42):
        self.df = df
        self.target = target
        self.features = features
        self.p = len(features)
        self.encoded_features=[]

        self.X = df[self.features]
        self.y = df[self.target]

        self.X_encoded, self.bayes_features, self.onehot_mapping, self.encoded_features = preprocess_onehot(self.X)

        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            self.X_encoded, self.y, test_size=test_size, random_state=random_state
        )

        self.bayes_mappings = {}
        for col in self.bayes_features:
            x_train_raw = self.X.loc[self.X_train.index, col]
            x_test_raw = self.X.loc[self.X_test.index, col]
            encoded_train, mapping = bayesian_target_encoding(x_train_raw, self.y_train, col)
            encoded_test = x_test_raw.map(mapping).fillna(mapping.mean())
            self.X_train[col] = encoded_train
            self.X_test[col] = encoded_test
            self.bayes_mappings[col] = mapping

        self.X_train = sm.add_constant(self.X_train)
        self.X_test = sm.add_constant(self.X_test)

        self.__model = sm.OLS(self.y_train, self.X_train).fit()

    def getModel(self):
        return self.__model
    
    def setModel(self,model):
        self.__model=model

    def setModel(self, new_model):
        self.__model = new_model

    def getMetrics(self):
        y_pred = self.__model.predict(self.X_test)
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

    def getBayesMappings(self):
        return self.bayes_mappings
    
    def getOneHotMappings(self):
        return self.onehot_mapping
    
def generateModel(y,X):
    return sm.OLS(y,X).fit()

def generateGLSModel(y,X):
    return sm.GLS(y,X).fit()