import React, { Component } from 'react';
import './../App.css';
import config from '../config.js';
import utils from '../utils.js';
import { toaster, Pane, majorScale, minorScale, Heading, Alert, TextInputField, Button, Text, Link  } from 'evergreen-ui';
import axios from 'axios';
import logo from '../logo.png';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      company: '',
      emailValidationMessage: null,
      passwordValidationMessage: null,
      passwordConfirmationValidationMessage: null,
      firstNameValidationMessage: null,
      lastNameValidationMessage: null,
      registerError: null
    };
  }

  handleUpdateEmail = (event) => {
    this.setState({
      email: event.target.value
    });
  }

  handleUpdatePassword = (event) => {
    this.setState({
      password: event.target.value
    });
  }

  handleUpdatePasswordConfirmation = (event) => {
    this.setState({
      passwordConfirmation: event.target.value
    });
  }

  handleUpdateFirstName = (event) => {
    this.setState({
      firstName: event.target.value
    });
  }

  handleUpdateLastName = (event) => {
    this.setState({
      lastName: event.target.value
    });
  }

  handleUpdateCompany = (event) => {
    this.setState({
      company: event.target.value
    });
  }

  handleSubmit = () => {
    var firstNameValidationMessage = null;
    var lastNameValidationMessage = null;
    var emailValidationMessage = null;
    var passwordValidationMessage = null;
    var passwordConfirmationValidationMessage = null;


    if (!utils.usernameRegex.test(this.state.firstName)) {
      firstNameValidationMessage = 'Please enter a valid first name. Only letters are allowed.'
    }

    if (!utils.usernameRegex.test(this.state.lastName)) {
      lastNameValidationMessage = 'Please enter a valid last name. Only letters are allowed.'
    }

    if (!utils.emailRegex.test(this.state.email)) {
      emailValidationMessage = 'Please enter a valid email.'
    }

    if (!utils.passwordRegex.test(this.state.password)) {
      passwordValidationMessage = 'Please enter a valid password.'
    }

    if (this.state.passwordConfirmation === '' || this.state.password !== this.state.passwordConfirmation) {
      passwordConfirmationValidationMessage = 'Passwords must match.'
    }

    this.setState({
      firstNameValidationMessage: firstNameValidationMessage,
      lastNameValidationMessage: lastNameValidationMessage,
      emailValidationMessage: emailValidationMessage,
      passwordValidationMessage: passwordValidationMessage,
      passwordConfirmationValidationMessage: passwordConfirmationValidationMessage,
      registerError: null
    });

    if (firstNameValidationMessage === null && lastNameValidationMessage === null && emailValidationMessage === null && passwordValidationMessage === null && passwordConfirmationValidationMessage === null) {
      axios.post(`${config.endpoint}/register`, {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        company: this.state.company
      }, {
        withCredentials: true
      })
        .then((response) => {
          toaster.success('Please check your email to confirm your registration.');
          this.props.history.push(`/login`)
        })
        .catch((error) => {
          if (utils.is4xx(error.response.status)) {
            this.setState({
              registerError: utils.convertErrorMessage(error.response.data)
            });
          } else {
            toaster.danger('Something went wrong with your registration. Please contact us at support@deviceplane.com.')
            console.log(error);
          }
        });
    }
  }

  render() {
    return (
      <Pane
        display="flex"
        flexDirection="column"
        padding={majorScale(6)}
        width={majorScale(50)}
        marginX="auto"
        marginY={200}
        elevation={2}
      >
        <Pane
          display="flex"
          alignItems="center"
          paddingBottom={majorScale(2)}
          marginX="auto"
        >
          <Pane paddingRight={minorScale(3)}>
            <img src={logo} alt="Logo" height="40px" width="45px" />
          </Pane>
          <Heading size={600}>Device Plane</Heading>
        </Pane>
        {this.state.registerError && (
          <Alert marginBottom={majorScale(2)} paddingTop={majorScale(2)} paddingBottom={majorScale(2)} intent="warning" title={this.state.registerError} />
        )}
        <TextInputField
          label="First Name"
          required
          onChange={this.handleUpdateFirstName}
          value={this.state.firstName}
          isInvalid={this.state.firstNameValidationMessage !== null}
          validationMessage={this.state.firstNameValidationMessage}
        />
        <TextInputField
          label="Last Name"
          required
          onChange={this.handleUpdateLastName}
          value={this.state.lastName}
          isInvalid={this.state.lastNameValidationMessage !== null}
          validationMessage={this.state.lastNameValidationMessage}
        />
        <TextInputField
          label="Company"
          onChange={this.handleUpdateCompany}
          value={this.state.company}
        />
        <TextInputField
          label="Email"
          required
          onChange={this.handleUpdateEmail}
          value={this.state.email}
          isInvalid={this.state.emailValidationMessage !== null}
          validationMessage={this.state.emailValidationMessage}
        />
        <TextInputField
          type="password"
          label="Password"
          hint="Password must be at least 8 characters, contain at least one lower case letter, one upper case letter, and no spaces."
          required
          onChange={this.handleUpdatePassword}
          value={this.state.password}
          isInvalid={this.state.passwordValidationMessage !== null}
          validationMessage={this.state.passwordValidationMessage}
        />
        <TextInputField
          type="password"
          label="Re-enter Password"
          required
          onChange={this.handleUpdatePasswordConfirmation}
          value={this.state.passwordConfirmation}
          isInvalid={this.state.passwordConfirmationValidationMessage !== null}
          validationMessage={this.state.passwordConfirmationValidationMessage}
        />
        <Button appearance="primary" justifyContent="center" onClick={this.handleSubmit}>Submit</Button>
        <Pane
          display="flex"
          flexDirection="row"
          justifyContent="center"
          paddingTop={majorScale(3)}
        >
          <Text color="muted">Already have an account?</Text><Link paddingLeft={majorScale(1)} href='/login'>Login</Link>
        </Pane>
      </Pane>
    );
  }
}