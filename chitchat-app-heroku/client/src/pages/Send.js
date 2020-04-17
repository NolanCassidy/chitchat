import React, { Component } from 'react';
import Header from "../components/Header";

import { auth } from "../services/firebase";

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      message: {
        to: '',
        body: ''
      },
      submitting: false,
      error: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true });
    fetch('/outone', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({to:this.state.message.to,content:this.state.message.body})
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.setState({
            error: false,
            submitting: false,
            message: {
              to: '',
              body: ''
            }
          });
        } else {
          this.setState({
            error: true,
            submitting: false
          });
        }
      });
  }

  onHandleChange(event) {
    const name = event.target.getAttribute('name');
    this.setState({
      message: { ...this.state.message, [name]: event.target.value }
    });
  }

  render() {
    return (
      <div>
        <Header />

        <div className="chat-area" ref={this.myRef}>
        <form
          onSubmit={this.onSubmit}
          className="mx-3"
        >
          <div>
            <label htmlFor="to">To:</label>
            <input
            className="form-control"
              name="to"
              id="to"
              value={this.state.message.to}
              onChange={this.onHandleChange}
            />
          </div>
          <div>
            <label htmlFor="body">Message:</label>
            <textarea
            className="form-control"
              name="body"
              id="body"
              value={this.state.message.body}
              onChange={this.onHandleChange}
            />
          </div>
          <button type="submit" className="btn btn-submit px-5 mt-4" disabled={this.state.submitting}>
            Send message
          </button>
        </form>
        </div>

        <div className="py-5 mx-3">
          Login in as: <strong className="text-info">{this.state.user.email}</strong>
        </div>
      </div>

    );
  }
}
