import requests
import pandas as pd
import numpy as np
import cfscrape
import os.path
from bs4 import BeautifulSoup


#Filter Rows and Column
def filter_func(rawarr,i):
	filter_arr=np.delete(rawarr,0,0) # Deleting 1st Row
	filter_arr=np.delete(filter_arr,1,1) # Deleting 2nd Col
	filter_arr=np.delete(filter_arr,5,1) # Deleting 7th Col[new 6th]
	filter_arr=np.delete(filter_arr,5,1) # Deleting 8th Col[new 6th]
	filter_arr=np.delete(filter_arr,-1,0) # Deleting last row
	filter_arr=np.delete(filter_arr,-1,0) # Deleting last row
	filter_arr=np.delete(filter_arr,-1,0) # Deleting last row
	filter_arr=np.delete(filter_arr,0,1) # Deleting first col
	filter_arr=np.delete(filter_arr,0,0) # Deleting 1st Row
	return filter_arr

#Extract No. of pages
def get_pageno():
	url = 'http://www.nepalstock.com/main/floorsheet/index/1/?_limit=500'
	html = requests.get(url).content
	data_list = pd.read_html(html)
	data = data_list[-1]
	rawarr=np.array(data)
	pg=rawarr[-3][0]
	pg=pg.split("/")[1]
	pg=pg.split(" ")[0]
	return pg

#extract Data
def extract_data(n):
	final_arr=np.empty(shape=(1,6))
	for i in range (n+1):
		url = 'http://www.nepalstock.com/main/floorsheet/index/'+str(i)+'/?_limit=500'
		html = requests.get(url).content
		data_list = pd.read_html(html)
		data = data_list[-1]
		rawarr=np.array(data)
		filtered=filter_func(rawarr,i)
		final_arr = np.concatenate([final_arr,filtered])
	final_arr=np.delete(final_arr,0,0)
	return final_arr

#convert to csv
def convert(final_arr,date):
	pd.DataFrame(final_arr).to_csv(os.path.join('Data',f'{date}.csv'),index=False)


# Get Date
def date():
	scraper = cfscrape.create_scraper()
	html = scraper.get('http://www.nepalstock.com/floorsheet')
	soup = BeautifulSoup(html.text, "lxml")
	tdate = soup.find('div',{'id':'date'}).text
	tdate=tdate.split("   ")[0]
	tdate=tdate.split("As of ")[1]
	return tdate

# Convert back to Panda Dataframe
def convert_df(filtered):
	df=pd.DataFrame(filtered, columns = ['Stock','Buyer','Seller','Qty','Temp','Temp'])
	df.__delitem__('Temp')
	buyer_df=df[['Stock','Buyer','Qty']].copy()
	seller_df=df[['Stock','Seller','Qty']].copy()
	buyer_df['Qty']=buyer_df['Qty'].astype(str).astype(int)
	seller_df['Qty']=seller_df['Qty'].astype(str).astype(int)
	buyer_df=buyer_df.groupby(['Stock','Buyer'],as_index=False)['Qty'].sum()
	seller_df=seller_df.groupby(['Stock','Seller'],as_index=False)['Qty'].sum()
	df= pd.concat([buyer_df, seller_df], axis=1)
	return df

date=date()
pg_no=get_pageno()
print(pg_no)
filtered=extract_data(int(pg_no))
filtered_df=convert_df(filtered)

convert(filtered,date) #full data
filtered_df.to_csv(os.path.join('Data',f'{date}-data.csv'),index=False)




