import React from 'react'

class Form extends React.Component {
  constructor(props) {
    super(props)
	
    this.initialState = {
      username: '',
      password: '',
    }
    this.state = this.initialState
  }
  
  handleChange = event => {
  const { name, value } = event.target
  
  this.setState({
    [name]: value,
  })
  }
  
  submitForm = () => {
  this.props.onSubmit(this.state)
  this.setState(this.initialState)
  }
  
  render() {
  const { username, password } = this.state;
  
  return (
    <form>
      <label>Username</label>
      <input
        type="text"
        name="username"
        id="username"
        value={username}
        onChange={this.handleChange} />
      <label>Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={this.handleChange} />
	  <input type="button" value="Submit" onClick={this.submitForm} />
    </form>
  );
  }
  
}


export default Form;