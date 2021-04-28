# %% [markdown]
# # Step 1 - Narrow down the json dataset into PA

# %% [code] {"jupyter":{"outputs_hidden":false}}
import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

file_path_business = '/kaggle/input/yelp-dataset/business.json'
file_path_tip = '/kaggle/input/yelp-dataset/tip.json'
file_path_user = '/kaggle/input/yelp-dataset/user.json'
file_path_review = '/kaggle/input/yelp-dataset/review.json'
file_path_photo = '/kaggle/input/yelp-dataset/photo.json'

business = pd.read_json(file_path_business, lines = True)
business_Phili = business[business['state']=='PA']
business_Phili.to_csv(r'/kaggle/working/business_Phili.csv')
#business_Phili.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
business_Phili.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
import json
import numpy as np # linear algebra
import pandas as pd  

def init_ds(json):
    ds= {}
    keys = json.keys()
    for k in keys:
        ds[k]= []
    return ds, keys

def read_json(file):
    dataset = {}
    keys = []
    with open(file) as file_lines:
        for count, line in enumerate(file_lines):
            data = json.loads(line.strip())
            if count ==0:
                dataset, keys = init_ds(data)
            for k in keys:
                dataset[k].append(data[k])
                
        return pd.DataFrame(dataset)
    
yelp_review= read_json('/kaggle/input/yelp-dataset/review.json')

file_path_business_Phili = '/kaggle/working/business_Phili.csv'
business_Phili = pd.read_csv(file_path_business_Phili)
business_id_Phili = business_Phili['business_id']

yelp_review_Phili = yelp_review[yelp_review['business_id'].isin(business_id_Phili)]
yelp_review_Phili.to_csv(r'/kaggle/working/yelp_review_Phili.csv')

# %% [code] {"jupyter":{"outputs_hidden":false}}
import json
import numpy as np # linear algebra
import pandas as pd  

def init_ds(json):
    ds= {}
    keys = json.keys()
    for k in keys:
        ds[k]= []
    return ds, keys

def read_json(file):
    dataset = {}
    keys = []
    with open(file) as file_lines:
        for count, line in enumerate(file_lines):
            data = json.loads(line.strip())
            if count ==0:
                dataset, keys = init_ds(data)
            for k in keys:
                dataset[k].append(data[k])
                
        return pd.DataFrame(dataset)
    
yelp_user= read_json('/kaggle/input/yelp-dataset/user.json')

file_path_review_Phili = '/kaggle/working/yelp_review_Phili.csv'
review_Phili = pd.read_csv(file_path_review_Phili)
user_id_Phili = review_Phili['user_id']

yelp_user_Phili = yelp_user[yelp_user['user_id'].isin(user_id_Phili)]
yelp_user_Phili.to_csv(r'/kaggle/working/yelp_user_Phili.csv')

# %% [code] {"jupyter":{"outputs_hidden":false}}
import json
import numpy as np # linear algebra
import pandas as pd  

def init_ds(json):
    ds= {}
    keys = json.keys()
    for k in keys:
        ds[k]= []
    return ds, keys

def read_json(file):
    dataset = {}
    keys = []
    with open(file) as file_lines:
        for count, line in enumerate(file_lines):
            data = json.loads(line.strip())
            if count ==0:
                dataset, keys = init_ds(data)
            for k in keys:
                dataset[k].append(data[k])
                
        return pd.DataFrame(dataset)
    
yelp_checkin = read_json('/kaggle/input/yelp-dataset/checkin.json')

file_path_business_Phili = '/kaggle/working/business_Phili.csv'
business_Phili = pd.read_csv(file_path_business_Phili)
business_id_Phili = business_Phili['business_id']

yelp_checkin_Phili = yelp_checkin[yelp_checkin['business_id'].isin(business_id_Phili)]
yelp_checkin_Phili.to_csv(r'/kaggle/working/yelp_checkin_Phili.csv')

# %% [markdown]
# # Step 2 - clean up the PA data

# %% [code] {"jupyter":{"outputs_hidden":false}}
import pandas as pd 
yelp_user_Phili= pd.read_csv('/kaggle/input/phili-yelp-data-mid-point/yelp_user_Phili.csv')

yelp_user_Phili = yelp_user_Phili[['user_id','name','review_count','useful','funny','cool','fans','average_stars']]

yelp_user_Phili = yelp_user_Phili.dropna()
yelp_user_Phili.to_csv(r'/kaggle/working/yelp_user_Phili2.csv')
yelp_user_Phili.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
import pandas as pd 
yelp_review_Phili= pd.read_csv('/kaggle/input/phili-yelp-data-mid-point/yelp_review_Phili.csv')
yelp_review_Phili["date"]=  pd.to_datetime(yelp_review_Phili['date'])
yelp_review_Phili['year'] = yelp_review_Phili.date.dt.year
yelp_review_Phili['month'] = yelp_review_Phili.date.dt.month
yelp_review_Phili['day'] = yelp_review_Phili.date.dt.day
yelp_review_Phili['weekday'] = yelp_review_Phili.date.dt.weekday
yelp_review_Phili['hour'] = yelp_review_Phili.date.dt.hour

yelp_review_Phili = yelp_review_Phili[['review_id','user_id','business_id','stars','useful','funny','cool','text','year','month','day','weekday','hour']]
yelp_review_Phili = yelp_review_Phili.dropna()
yelp_review_Phili.to_csv(r'/kaggle/working/yelp_review_Phili2.csv')
yelp_review_Phili.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
import pandas as pd 
yelp_business_Phili= pd.read_csv('/kaggle/input/phili-yelp-data-mid-point/yelp_business_Phili.csv')

yelp_business_Phili = yelp_business_Phili[['business_id','name','address','city','state','postal_code','latitude','longitude','stars','review_count','is_open','attributes','categories','hours']]
yelp_business_Phili = yelp_business_Phili.dropna()

yelp_business_Phili.to_csv(r'/kaggle/working/yelp_business_Phili2.csv')
yelp_business_Phili.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
# Create a table for business / categories combination 

import pandas as pd 
yelp_business_Phili= pd.read_csv('/kaggle/working/yelp_business_Phili2.csv')


df=pd.DataFrame(yelp_business_Phili[['business_id',"name","categories"]].values,
                    columns=['business_id',"Business name","categories"])

df = df.dropna()

dflist = []

for index, row in df.iterrows():
    all_categories= row['categories'].split(",")
    for x in all_categories:
        dflist.append([row.business_id, x])

yelp_categories_Phili = pd.DataFrame(dflist, columns=['business_id','category'])
yelp_categories_Phili = yelp_categories_Phili.dropna()
yelp_categories_Phili.to_csv(r'/kaggle/working/yelp_categories_Phili2.csv')
yelp_categories_Phili.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
import pandas as pd 
yelp_checkin_Phili= pd.read_csv('/kaggle/input/phili-yelp-data-mid-point/yelp_checkin_Phili.csv')
yelp_checkin_Phili = yelp_checkin_Phili.dropna()



df=pd.DataFrame(yelp_checkin_Phili[['business_id',"date"]].values,
                    columns=['business_id',"date"])

df = df.dropna()

dflist = []

for index, row in df.iterrows():
    all_categories= row['date'].split(",")
    for x in all_categories:
        dflist.append([row.business_id, x])


yelp_checkin_Phili2 = pd.DataFrame(dflist, columns=['business_id','date'])

yelp_checkin_Phili2["date"]=  pd.to_datetime(yelp_checkin_Phili2['date'])
yelp_checkin_Phili2['weekday'] = yelp_checkin_Phili2.date.dt.weekday
yelp_checkin_Phili2['hour'] = yelp_checkin_Phili2.date.dt.hour


yelp_checkin_Phili2 = yelp_checkin_Phili2.dropna()
yelp_checkin_Phili2.to_csv(r'/kaggle/working/yelp_checkin_Phili2.csv')
yelp_checkin_Phili2.head()

# %% [markdown]
# # Step 3 check again for SQL set up

# %% [code] {"jupyter":{"outputs_hidden":false}}
import pandas as pd 
yelp_review= pd.read_csv('/kaggle/working/yelp_review_Phili2.csv')
yelp_review.head()

# %% [code] {"jupyter":{"outputs_hidden":false}}
#Schema yelp_review

CREATE TABLE `new_schema`.`Yelp_review` (
  `review_id` VARCHAR(45) NOT NULL,
  `user_id` VARCHAR(45) NOT NULL,
  `business_id` VARCHAR(45) NOT NULL,
  `stars` FLOAT NOT NULL,
  `useful` INT NOT NULL,
  `funny` INT NOT NULL,
  `cool` INT NOT NULL,
  `text` VARCHAR(300) NOT NULL,
  `year` YEAR(4) NOT NULL,
  `month` INT NOT NULL,
  `day` INT NOT NULL,
  `weekday` INT NOT NULL,
  `hour` INT NOT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE INDEX `review_id_UNIQUE` (`review_id` ASC) VISIBLE);