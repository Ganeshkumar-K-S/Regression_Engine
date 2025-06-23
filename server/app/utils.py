import numpy as np
import pandas as pd
from datetime import datetime
from statsmodels.stats.stattools import durbin_watson as dbw
import statsmodels.api as sm
from scipy.stats import jarque_bera as jb, boxcox
import matplotlib.pyplot as plt
from statsmodels.stats.diagnostic import het_breuschpagan
from scipy.stats import zscore
from statsmodels.stats.outliers_influence import variance_inflation_factor as vif

def treat_null(df,col,method,value=None):
    try:
        if method==1: #drop null values
            df.dropna(subset=[col],inplace=True)

        elif method==2: #fill with give values
            if value is None:
                raise ValueError("No values provided")
            
            if not (pd.api.types.is_numeric_dtype(df[col]) and isinstance(value,(int,float))
                or (df[col].dtype == object or pd.api.types.is_string_dtype(df[col])) and isinstance(value, str)
                or pd.api.types.is_datetime64_any_dtype(df[col]) and isinstance(value,datetime)):
                    raise ValueError("Value miss match in columns and given values")
            else:
                    df[col]=df[col].fillna(value)

        elif method==3: #forward fill
            df[col]=df[col].fillna(method='ffill')

        elif method==4: #backward fill
            df[col]=df[col].fillna(method='bfill') 

        elif method==5: #mean for numeric data and mode for other types
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col]=df[col].fillna(df[col].mean())
            else:
                df[col]=df[col].fillna(df[col].mode()[0])

        elif method==6: #median for numeric data and mode for other types
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
    
def outliers(df, method, features,model=None):
    try:
        if method == 1:
            # Cook's Distance (requires model)
            if model is None:
                raise ValueError("Model is required for method 1 (Cook's Distance)")
            influence = model.get_influence()
            cooks_d, _ = influence.cooks_distance
            outliers = np.where(cooks_d > 1)[0].tolist()

        elif method == 2:
            # IQR method
            if features is None:
                features = df.select_dtypes(include=[np.number]).columns

            outlier_indices = set()

            for col in features:
                if not pd.api.types.is_numeric_dtype(df[col]):
                    continue  # Skip non-numeric columns

                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR

                outliers_in_col = df[(df[col] < lower_bound) | (df[col] > upper_bound)].index
                outlier_indices.update(outliers_in_col)

            outliers = list(outlier_indices)

        elif method == 3:
            # Z-score method
            zscores = df.select_dtypes(include=[np.number]).apply(zscore)
            outlier_rows = (zscores.abs() > 3).any(axis=1)
            outliers = df[outlier_rows].index.tolist()

        else:
            raise ValueError("Invalid Option: method must be 1 (Cook), 2 (IQR), or 3 (Z-score)")

    except ValueError as e:
        print("ValueError:", e)
        outliers = []

    return df.drop(index=outliers).reset_index(drop=True)


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
def perfect_multicollinearity_test(df, features, threshold=5.0):
    X = df[features]
    X = sm.add_constant(X)

    vif_values = {}
    for i in range(1,X.shape[1]):  # skip the constant
        vif_score = vif(X.values, i)
        vif_values[features[i-1]] = round(vif_score, 1)

    high_vif = [feat for feat, v in vif_values.items() if v > threshold]

    return {
        'result': 'success' if not high_vif else 'failure',
        'vif': vif_values,
        'high_vif_features': high_vif
    }

def equal_variance_test(df, features, target, alpha=0.05):
    violating_features = {}
    for feature in features:
        X = sm.add_constant(df[[feature]])
        y = df[target]

        model = sm.OLS(y, X).fit()
        residuals = model.resid
        exog = model.model.exog

        bp_test = het_breuschpagan(residuals, exog)
        p_value = bp_test[1]  # p-value

        if p_value < alpha:
            violating_features[feature]=p_value

    return violating_features

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
def fix_perfect_collinearity(df, method, feature):
    try:
        if len(method) != len(feature):
            raise IndexError("Length of columns and methods to resolve are different")

        for i in range(len(method)):
            if method[i] == 1:
                continue  # Keep the feature
            elif method[i] == 2:
                df.drop(columns=[feature[i]], inplace=True)  # Drop the feature
            else:
                raise ValueError("Invalid Option: Only 1 (keep) or 2 (drop) allowed")

    except ValueError as e:
        print("ValueError:", e)
    except IndexError as e:
        print("IndexError:", e)
    finally:
        return df

#assumption-5 Equal Variance of errors
def fix_equal_variance_test(df,method,feature):
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

def get_category_vars(df):
    res={}
    for col in df.columns:
        if df[col].dtype==object :
            res[col]=list(df[col].unique())
    return res

def get_attributes(df):
    res = {}
    for col in df.columns:
        res[col] = pd.api.types.is_numeric_dtype(df[col])
    return res

def bayesian_target_encoding(x, y, feature, alpha=5):
    temp = pd.DataFrame({feature: x[feature], 'target': y})
    overall_mean = y.mean()
    agg = temp.groupby(feature)['target'].agg(['mean', 'count'])
    agg['encoded'] = (agg['mean'] * agg['count'] + overall_mean * alpha) / (agg['count'] + alpha)
    mapping = agg['encoded']
    return x[feature].map(mapping), mapping

def encoding(y, x, ignore_first=False, bayes_mappings=None):
    res = pd.DataFrame(index=x.index)
    new_bayes_mappings = {} if bayes_mappings is None else bayes_mappings

    for col in x.columns:
        if pd.api.types.is_numeric_dtype(x[col]):
            res[col] = x[col]

        else:
            unique_vals = x[col].nunique()

            if unique_vals == 1:
                unique_val = x[col].unique()[0]
                res[col] = 1

            elif 1 < unique_vals < 5:
                unique_categories = list(x[col].unique())
                if ignore_first:
                    unique_categories = unique_categories[1:]
                for val in unique_categories:
                    res[f'{col}_{val}'] = (x[col] == val).astype(int)

            else:
                if bayes_mappings is None:
                    res[col], mapping = bayesian_target_encoding(x, y, col)
                    new_bayes_mappings[col] = mapping
                else:
                    mapping = bayes_mappings[col]
                    res[col] = x[col].map(mapping).fillna(mapping.mean()) 

    return res, new_bayes_mappings

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
    
    