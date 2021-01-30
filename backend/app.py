import json
import requests
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# NOTE: This route is needed for the default EB health check route
@app.route('/')
def home():
    return "ok"

# testing method
@app.route('/api/get_topics')
def get_topics():
    return {"topics": ["topic1", "other stuff", "next topic"]}

# testing method
@app.route('/api/submit_question', methods=["POST"])
def submit_question():
    question = json.loads(request.data)["question"]
    return {"answer": f"You Q was {len(question)} chars long"}

# DO NOT USE UNTIL DEPLOYMENT
@app.route('/api/display_stock_from_api')
def display_stock_from_api():

    url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-statistics"

    querystring = {"symbol":"AMRN","region":"US"}

    headers = {
        'x-rapidapi-key': "1fec4aafacmshc45c20a505b3ab7p136a93jsn1bdcad2e1278",
        'x-rapidapi-host': "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }

    response = requests.request("GET", url, headers=headers, params=querystring).json()

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

    return {"shortRatio": ratio,
            "shortPercentOfFloat": percent_float,
            "dateShortInterest": date_short_interest,
            "averageDailyVolume10Day": avg_vol_10_day,
            "shortTermTrend": short_term_trend}


# USE FOR TEST PURPOSES
@app.route('/api/display_stock_test')
def display_stock_test():
    return {"shortRatio": 2.81,
            "shortPercentOfFloat": 2.2642,
            "dateShortInterest": 1610668800,
            "averageDailyVolume10Day": 108662562,
            "shortTermTrend": "UP"}


if __name__ == '__main__':
    app.run(port=8080)