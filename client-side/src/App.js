import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user_id: Math.round(new Date().getTime()/1000),
      coin_to_add: '',
      user_coins: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePrices = this.updatePrices.bind(this);
  }

  componentDidMount(){
    // MAke app update prices every 5 min from DB
    setInterval(this.updatePrices, 5*60*1000);
  }

  // Update prices of added coins from DB
  updatePrices(){
    var id = this.state.user_id;
    var coins = [];
    var targetUrl = 'http://localhost:3001/getCoin/'+id;
    fetch(targetUrl)
      .then(blob => blob.json())
      .then(data => {
        if (data.status === "success" ){
          var array = [].concat(data.data);
          if (array.length !== 0) {
            console.log(array.length);
            for (var elem in array)
              coins = coins.concat([{code: array[elem].code, price: array[elem].price}]);
            //console.log(coins);
            this.setState({user_coins: coins});
          }
        }
    })
    .catch(e => {
      console.log(e);
      return e;
    });
  }

  // Handle changes in input field
  handleChange(event) {
   if (!this.state.user_coins.includes(event.target.value.toUpperCase()))
    this.setState({coin_to_add: event.target.value.toUpperCase()});
 }
 // Handle click on the submit btn
  handleSubmit(event) {
    console.log('Submiting');
    var codes = [];
    for (var elem in this.state.user_coins) {
      codes.push(this.state.user_coins[elem].code);
    }
    if (!codes.includes(this.state.coin_to_add) && this.state.coin_to_add!==''){
      var targetUrl = 'http://localhost:3001/addCoin/?user_id='+this.state.user_id+'&code='+this.state.coin_to_add;
      fetch(targetUrl)
        .then(blob => blob.json())
        .then(data => {
          var price = data.price;
          this.setState({user_coins: this.state.user_coins.concat([{code: this.state.coin_to_add, price: price}]), coin_to_add: ''});
      })
      .catch(e => {
        console.log(e);
        return e;
      });
    }
    event.preventDefault();
  }

  // Handle click on delete coin btn
  deleteCoin(coin){
    var targetUrl = 'http://localhost:3001/removeCoin/?user_id='+this.state.user_id+'&code='+coin.code;
    fetch(targetUrl)
      .then(blob => blob.json())
      .then(data => {
        if (data.status === "success"){
          var arr = this.state.user_coins.filter(item => item !== coin)
          this.setState({user_coins: arr});
        }
    })
    .catch(e => {
      console.log(e);
      return e;
    });
  }

  render() {
    const userCoins = this.state.user_coins.map((coin, index)=>
      <div className="coin-container" key={index}>
        <div className="coin">{coin.code}</div>
        <div className="price">{coin.price} EUR</div>
        <button className="delete-btn" onClick={(e) => this.deleteCoin(coin, e)}>Delete Coin</button>
      </div>
    );
    return (
      <div className="App">
        <form className="coins-form" onSubmit={this.handleSubmit}>
          <label className="coin-input">
            Coin Code:
            <input type="text" value={this.state.coin_to_add} onChange={this.handleChange} />
          </label>
          <input className="submit" type="submit" value="Submit" />
        </form>
        <div className="user-coins">
          {userCoins}
        </div>
      </div>
    );
  }
}

export default App;
