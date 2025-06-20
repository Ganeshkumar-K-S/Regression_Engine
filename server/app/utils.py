import numpy as np
import pandas as pd
from datetime import datetime
from statsmodels.stats.stattools import durbin_watson as dbw
import statsmodels.api as sm
from scipy.stats import jarque_bera as jb, boxcox
import matplotlib.pyplot as plt

def treat_null(df,cols,method,values=[]):
    try:
        if method==1: #drop null values
            df.dropna(subset=cols,inplace=True)

        elif method==2: #fill with give values
            if values is None:
                raise ValueError("No values provided")
            
            if len(cols)!=len(values):
                raise IndexError("Length of columns and fill values are different")

            for (col,val) in zip(cols,values):
                if not (pd.api.types.is_numeric_dtype(df[col]) and isinstance(val,(int,float))
                or (df[col].dtype == object or pd.api.types.is_string_dtype(df[col])) and isinstance(val, str)
                or pd.api.types.is_datetime64_any_dtype(df[col]) and isinstance(val,datetime)):
                    raise ValueError("Value miss match in columns and given values")
                else:
                    df[col]=df[col].fillna(val)

        elif method==3: #forward fill
            df[cols]=df[cols].fillna(method='ffill')

        elif method==4: #backward fill
            df[cols]=df[cols].fillna(method='bfill') 

        elif method==5: #mean for numeric data and mode for other types
            for col in cols:
                if pd.api.types.is_numeric_dtype(df[col]):
                    df[col]=df[col].fillna(df[col].mean())
                else:
                    df[col]=df[col].fillna(df[col].mode()[0])

        elif method==6: #median for numeric data and mode for other types
            for col in cols:
                if pd.api.types.is_numeric_dtype(df[col]):
                    df[col]=df[col].fillna(df[col].median())
                else:
                    df[col]=df[col].fillna(df[col].mode()[0])
        else:
            raise ValueError('Invalid Option')
      
    except ValueError as e:
        print(e)
    except IndexError as e:
        print(e)
    finally:
        return df
    
def treat_outliers():
    pass

def get_correlation_matrix(df,target,feature):
    return df[target,*feature].corr()
#diagnose
def get_correlation_feature(df,target,feature):
    res={}
    for feat in feature:
        corr_value=df[feat].corr(df[target])
        res[feat]=corr_value
    return res
#assumption-1 Linearity of feature-target relationship
def linearity_test(df,target,feature):
    failed=[]
    res=get_correlation_feature(df,target,feature)
    for key,value in res.items():
        if abs(value) < 0.1:
            failed.append(key)
    if not failed :
        return {
            'result':'success'
            }
    else:
        return {
            'result':'failure',
            'features':failed
            }
    
#assumption-2 Independence of errors
def independence_of_errors_test(model):
    test_val=dbw(model.resid)
    return {
        'result':'success' if 1.5<test_val<2.5 else 'failure',
        'test_val_dbw':test_val
    }

#assumption-3 Normality of errors
def normality_of_errors_test(model):
    stat,p=jb(model.resid)
    return {
        'result':'success' if 0.05 <= p <0.05 else 'failure',
        'test_val_jb':p
    }

#assumption-4 No Perfect Multicollinearity
def perfect_multicollinearity_test(model):
    pass

#assumption-5 Equal Variance of errors
def equal_variance_test(model):
    pass

#Fix
#assumption-1 Linearity of feature-target relationship
def fix_linearity(df,feature,method,degree=2):
    try:
        if method==1: # logarithimic transformation 
            df[f'log({feature})']=np.log(df[feature]+1)
        elif method==2: # exponential transformation
            df[f'exp({feature})']=np.exp(df[feature])
        elif method==3: # polynomial transformation
            for i in range(2,degree+1):
                df[f'__{feature}^{degree}__']= df[feature] ** i
        else:
            raise ValueError('Invalid method')
    except ValueError as e:
        print(e)
    finally:
        return df

#assumption-2 Independence of errors
def fix_independence_of_errors(y,X):
    y=y.sample(frac=1)
    X=X.sample(frac=1)
    return sm.GLS(y,X).fit()

#assumption-3 Normality of errors
def fix_normality_of_errors(df,feature,method):
    try:
        if method==1:
            df[f'log({feature})']=np.log(df[feature]+1)
        elif method==2:
            df[f'sqrt({feature})']=np.sqrt(df[feature])
        elif method==3:
            if (df[feature] <= 0).any():
                raise ValueError("value can't be negative for boxcox transformation")
            df[f'boxcox({feature})'],_=boxcox(df[feature])
    except ValueError as e:
        print(e)
    finally:
        return df
    
#assumption-4 No Perfect Multicollinearity
def fix_perfect_collinearity():
    pass

#assumption-5 Equal Variance of errors
def fix_equal_variance():
    pass

def get_category_vars(df):
    res={}
    for col in df.columns:
        if df[col].dtype==object :
            res[col]=list(df[col].unique())
    return res

def get_attributes(df):
    res = {}
    for col in df.columns:
        res[col] = df[col].dtype == object
    return res

def bayesian_target_encoding(df, target, feature, alpha=5):
    overall_mean = df[target].mean()
    agg = df.groupby(feature)[target].agg(['mean', 'count'])
    agg['encoded'] = (agg['mean'] * agg['count'] + overall_mean * alpha) / (agg['count'] + alpha)
    return df[feature].map(agg['encoded'])

def encoding(df, target, features):
    for col in features:
        if not pd.api.types.is_numeric_dtype(df[col]):
            unique_vals = df[col].nunique()
            if unique_vals < 5:
                for val in df[col].unique():
                    df[f'{col}_{val}'] = (df[col] == val).astype(int)
                df.drop(columns=[col], inplace=True)
            else:
                df[col] = bayesian_target_encoding(df, target, col)
    return df

def to_dataframe(filepath,format):
    if format=='json':
        return pd.read_json(filepath)
    else:
        return pd.read_csv(filepath)
    
def from_dataframe(df,format):
    if format=='json':
        return df.to_json(orient='records')
    else:
        return df.to_csv('data.csv')
    
    