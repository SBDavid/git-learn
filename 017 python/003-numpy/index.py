import numpy as np
import pandas as pd

dates = pd.date_range('20130101', periods=6)

test = pd.DataFrame(np.random.randn(6,4), dates, ['a', 'b', 'c', 'd'])

print(test * 0)