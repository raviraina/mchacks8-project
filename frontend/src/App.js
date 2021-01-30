import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    topics: ["Loading..."],
    question: "",
    answer: ""
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
    const { answer } = data;
    this.setState({answer})
  }

  render() {
    const { topics, question, answer } = this.state;
    return (
      <div className="App">
        <header className="App-header">
        <h1>List of topics to ask a question on</h1>
        <ul>
          {topics.map(topic => (<li key={topic}>{topic}</li>))}
        </ul>
          <form onSubmit={this.handleSubmit}>
          <label>
            Question:
            <input type="text" value={question} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <h1>shortRatio: {answer.shortRatio}</h1>
        <h1>shortPercentOfFloat: {answer.shortPercentOfFloat}</h1>
        <h1>dateShortInterest: {answer.dateShortInterest}</h1>
        <h1>averageDailyVolume10Day: {answer.averageDailyVolume10Day}</h1>
        <h1>shortTermTrend: {answer.shortTermTrend}</h1>
        </header>
      </div>
    );
  }
}

export default App;
