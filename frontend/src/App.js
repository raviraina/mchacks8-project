import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import axios from 'axios';
import './App.css';
import logo from './logo.png'

class App extends Component {

  componentDidMount(){
    document.title = "Eat My Shorts"
  }

  state = {
    question: "",
    answer: "",
    recc: "",
    ratiofield: "",
    shortpercent: "",
    avgvol: "",
    shorttrend: ""
  }

  handleChange = (event) => {
    this.setState({question: event.target.value});
  }

  handleSubmit = (event) => {
    this.fetchAnswer();
    event.preventDefault();
  }

  fetchAnswer = async () => {
    const { question } = this.state;
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/request_stock_from_api`, { question }
    );
    this.state.hidden = !this.state.hidden;
    const { answer } = data;
    this.setState({answer});
    console.log(answer)
    this.setFields();
    this.setRecc();
  }

  setRecc = async () => {
    let recc = ""
    let score = 0;
    let shortRatio = parseFloat(this.state.answer.shortRatio)
    let shortPercentOfFloat = parseFloat(this.state.answer.shortPercentOfFloat);
    let shortTermTrend = this.state.answer.shortTermTrend;
    if(shortRatio > 1.0){score += 1};
    if(shortRatio > 1.5){score += 1};
    if(shortRatio > 2.0){score += 1};
    if(shortPercentOfFloat > 1.0){score += 1};
    if(shortPercentOfFloat > 1.5){score += 1};
    if(shortPercentOfFloat > 2.0){score += 1};
    if(shortTermTrend == "UP"){score +=1};

    if(score >= 6){
      recc = "There is a high chance for a short squeeze opportunity with this stock.";
    }else if(score>=4){
      recc = "There is a moderate chance for a short squeeze opportunity with this stock.";
    }else if(score>=1){
      recc = "There is little opportunity for a short squeeze with this stock."
    }
    
    
    this.setState({recc});
  }

  setFields = async () => {
    let ratiofield = "Short Ratio: "
    let shortpercent = "Short Percent of Float: "
    let avgvol = "Average Daily Volume (10-Day): "
    let shorttrend = "Short Term Trend:"
    this.setState({ratiofield})
    this.setState({shortpercent})
    this.setState({avgvol})
    this.setState({shorttrend})
  }

  

  render() {
    const { topics, question, answer, recc, ratiofield, shortpercent, avgvol, shorttrend} = this.state;

    return (
      <div className="App">
        <header className="App-header">
        <h1>Eat My Shorts</h1>
        <div>Find the next big short squeeze opportunity</div>
        <img src={logo} alt="BigCo Inc. logo"/>
        <form onSubmit={this.handleSubmit}>
          <label>
            <div className="enter-str">Enter a Stock Ticker (GME, AMC, etc..)</div>
            <input className="srch" type="text" value={question} onChange={this.handleChange}/>
          </label>
        <input type="submit" value="Submit" />
        </form>
        <div className="App-stock-info">
          <h1>{ratiofield} {answer.shortRatio}</h1>
          <h1>{shortpercent} {answer.shortPercentOfFloat}</h1>
          <h1>{avgvol} {answer.averageDailyVolume10Day}</h1>
          <h1>{shorttrend} {answer.shortTermTrend}</h1>
          <h2 className="App-recc">{recc}</h2>
        </div>
        </header>
      </div>
    );
  }
}

export default App;
