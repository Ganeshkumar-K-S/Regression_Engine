import numpy as np
import pandas as pd
from datetime import datetime
from statsmodels.stats.stattools import durbin_watson as dbw
from scipy.stats import jarque_bera as jb

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


def get_correlation_matrix(df,target,feature):
    return df[*target,feature].corr()
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
        if value < 0.1:
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