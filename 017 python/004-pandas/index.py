import numpy as np
import pandas as pd

s = pd.Series(data=[1,2,3,np.nan],name="title",)

dates = pd.date_range('20130101', periods=6)

df = pd.DataFrame(np.random.randn(6, 4), index=dates, columns=['A', 'B', 'C', 'D'])

df2 = pd.DataFrame(data={
    'A': 1.,
    'B': pd.Timestamp('20130102'),
    'C': pd.Series(1, index=pd.date_range('20130101', periods=4), dtype='float32'),
    'D': np.array([3] * 4, dtype='int32'),
    #'E': pd.Categorical(["test", "train", "test", "train"]),
    #'F': 'foo',
})

df2 = df.copy()

df2['E'] = ['one', 'one', 'two', 'three', 'four', 'three']

s1 = pd.Series([1, 2, 3, 4, 5, 6], index=pd.date_range('20130101', periods=6))

df['F'] = s1

df.loc['20130101':'20130101', ['F']] = pd.Series(np.random.randn(6), index=dates)


print(type(df[df > 0]))