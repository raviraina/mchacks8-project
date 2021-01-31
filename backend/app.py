import json
import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Do not delete
@app.route('/')
def home():
    return "ok"

#testing method on deploy
@app.route('/api/get_test')
def get_topics():
    return {"test": ["a", "b", "c"]}

# testing method
# @app.route('/api/submit_question', methods=["POST"])
# def submit_question():
#     question = json.loads(request.data)["question"]
#     return {"answer": "nice input!"}

# DO NOT USE UNTIL DEPLOYMENT
@app.route('/api/request_stock_from_api', methods=["POST"])
def request_stock_from_api():

    # change "question" with whatever named in App.js
    requested_stock = json.loads(request.data)["question"]

    try:
    # get stock info
        url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-statistics"
        querystring = {"symbol":f"{requested_stock.upper()}","region":"US"}
        headers = {
            'x-rapidapi-key': "1fec4aafacmshc45c20a505b3ab7p136a93jsn1bdcad2e1278",
            'x-rapidapi-host': "apidojo-yahoo-finance-v1.p.rapidapi.com"
            }
        response = requests.request("GET", url, headers=headers, params=querystring).json()
    except:
        return 'No stock found with requested symbol. Please enter an exact symbol like "GME".'

    try:
        ratio = response["defaultKeyStatistics"]["shortRatio"]["raw"]
    except(KeyError):
        ratio = 0

    try:
        percent_float = response["defaultKeyStatistics"]["shortPercentOfFloat"]["raw"]
    except(KeyError):
        percent_float = 0
    
    try:
        date_short_interest = response["defaultKeyStatistics"]["dateShortInterest"]["raw"]
    except(KeyError):
        date_short_interest = 0

    try:
        avg_vol_10_day = response["summaryDetail"]["averageVolume10days"]["raw"]
    except(KeyError):
        avg_vol_10_day = 0
    
    try:
        short_term_trend = response["pageViews"]["shortTermTrend"]
    except:
        short_term_trend = "None"

    return {"answer": {"shortRatio": ratio,
            "shortPercentOfFloat": percent_float,
            "dateShortInterest": date_short_interest,
            "averageDailyVolume10Day": avg_vol_10_day,
            "shortTermTrend": short_term_trend}}

    # temp return for functionality test
    #return {"answer": [ratio, percent_float, date_short_interest, avg_vol_10_day, short_term_trend]}


# USE FOR TEST PURPOSES
@app.route('/api/request_stock_test', methods=["POST"])
def request_stock_test():

    requested_stock = json.loads(request.data)["question"]

    return {"answer": {"shortRatio": 2.81,
            "shortPercentOfFloat": 2.2642,
            "dateShortInterest": 1610668800,
            "averageDailyVolume10Day": 108662562,
            "shortTermTrend": "UP"}}


if __name__ == '__main__':
    app.run(port=8080)