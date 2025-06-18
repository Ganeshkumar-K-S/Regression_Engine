import statsmodels.api as sm
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error as mae, mean_squared_error as mse, r2_score as r2

class Model:
    def __init__(self,df,target,features,test_size=0.2,random_state=42):
        self.df=df
        self.target=target
        self.features=features

        self.X=sm.add_constant(self.df[*self.features])
        self.y=self.df[self.target]

        self.X_train,self.X_test,self.Y_train,self.Y_test=train_test_split(self.X,self.y,test_size=test_size,random_state=random_state)
        self.__model=sm.OLS(self.y_train,self.X_train)

    def getModel(self):
        return self.__model
    
    def setModel(self,new_model):
        self.__model=new_model

    def getMetrics(self):
        return self.__mode