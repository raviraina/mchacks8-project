import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    topics: ["Loading..."],
    question: "",
    answer: "",
    recc: ""
  }

  componentDidMount() {
    this.fetchTopics()
  }

  fetchTopics = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/get_topics`,
    );
    const { topics } = data;
    this.setState({topics})
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
      `${process.env.REACT_APP_API_URL}/request_stock_test`, { question }
    );
    this.state.hidden = !this.state.hidden;
    const { answer } = data;
    this.setState({answer});
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

  render() {
    const { topics, question, answer, recc } = this.state;

    return (
      <div className="App">
        <header className="App-header">
        <h1>Eat My Shorts</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Enter a Stock Ticker: 
            <input type="text" value={question} onChange={this.handleChange} />
          </label>
        <input type="submit" value="Submit" />
        </form>
        <div className="App-stock-info">
          <h1>Short Ratio: {answer.shortRatio}</h1>
          <h1>Short Percent of Float: {answer.shortPercentOfFloat}</h1>
          <h1>Average Daily Volume (10-Day): {answer.averageDailyVolume10Day}</h1>
          <h1>Short Term Trend: {answer.shortTermTrend}</h1>
          <h2 className="App-recc">{recc}</h2>
        </div>
        </header>
      </div>
    );
  }
}

export default App;
