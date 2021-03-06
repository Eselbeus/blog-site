import React from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import './App.scss';
import Nav from './components/Nav'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Articles from './components/Articles'
import ArticlePage from './components/ArticlePage'
import Podcasts from './components/Podcasts'
import Admin from './components/Admin'

class App extends React.Component {
  state = {
    user: {},
    articles: [],

  }

  componentDidMount = () => {
    let token = localStorage.token;
    if (token) {fetch("http://localhost:3000/api/v1/current_user", {
          method: "GET",
          headers: {
            "content-type": "application/json",
            accepts: "application/json",
            Authorization: `${token}`
          }
        })
          .then(resp => resp.json())
          .then(user => {
            this.setState({ user }, () => {
              console.log(user);
            })
          })
    };
    fetch(`http://localhost:3000/api/v1/articles`)
      .then(res => res.json())
      .then(articles => this.setState({articles: articles}))
  }

  submitHandler = (e) => {
    e.preventDefault()
    let title = e.target.title.value
    let imagelink = e.target.imagelink.value
    let imagelink2 = e.target.imagelink2.value
    let imagelink3 = e.target.imagelink3.value
    let content = e.target.content.value
    let contentpt2 = e.target.contentpt2.value
    let contentpt3 = e.target.contentpt3.value
    let user_id = this.state.user.user.id

    let config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        title: title,
        imagelink: imagelink,
        imagelink2: imagelink2,
        imagelink3: imagelink3,
        content: content,
        contentpt2: contentpt2,
        contentpt3: contentpt3,
        user_id: user_id
      })
    }

    if (title.length < 1){
      alert("Title cannot be blank")
    }
    else {
      fetch(`http://localhost:3000/api/v1/articles`, config)
        .then(res => res.json())
        .then(res => {this.setState({articles: [...this.state.articles, res], title: '',
          imagelink: '',
          imagelink2: '',
          imagelink3: '',
          content: '',
          contentpt2: '',
          contentpt3: ''})
        })
    }
  }

  signupHandler = (e) => {
    e.preventDefault()
    let token = localStorage.getItem('token')
    let name = e.target.name.value
    let email = e.target.email.value
    let password = e.target.password.value
    let key = e.target.key.value
    this.setState({sent: !this.state.sent})
    fetch(`http://localhost:3000/api/v1/signup`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          key: key
        })
      })
      .then(res => res.json())
      .then(res => {
      if (!res.error){
        localStorage.setItem('token', res.jwt)
        this.setState({user: res})
        }
      })
  }

  loginHandler = (e) => {

    e.preventDefault()
    let email = e.target.email.value
    let password = e.target.password.value
    this.setState({sent: !this.state.sent})

    fetch(`http://localhost:3000/api/v1/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: localStorage.getItem('token')},
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(res => res.json())
    .then(res => {
      if (!res.message){
        localStorage.setItem('token', res.jwt)
        this.setState({user: res})
        }
      })
  }

    logoutUser = () => {
      localStorage.clear()
      this.setState({user: {}})
    }

  render(){
    return (
      <div className="App">
        <Nav logoutUser={this.logoutUser} currentUser={this.state.user}/>
        <Switch>
          <Route exact path='/about' component={About} />
          <Route path="/admin" render={() => <Admin loginHandler={this.loginHandler} signupHandler={this.signupHandler}/>}/>
          <Route exact path='/contact' component={Contact} />
          <Route exact path="/articles" render={() => <Articles currentUser={this.state.user} articles={this.state.articles} submitHandler={this.submitHandler}/>}/>
          <Route exact path="/articles/:id" render={props => <ArticlePage currentUser={this.state.user}/>}/>
          <Route path="/podcast" render={() => <Podcasts currentUser={this.state.user}/>}/>
          <Route exact path='/' render={() => <Home articles={this.state.articles}/>}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
