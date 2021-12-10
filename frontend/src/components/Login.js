import React from "react";
import { Grid, Header, Form, Segment, Button } from "semantic-ui-react";

function Login({
  user: { username, moibleNumber, verificationCode, verificationSent },
  setUser,
  sendSmsCode,
  sendVerificationCode,
}) {
  function populateFields(event, data) {
    setUser((draft) => {
      draft[data.name] = data.value;
    });
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: "100vh" }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center">
          Login into your account:
        </Header>
        <Form>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="UserName"
              value={username}
              onChange={(event, data) => populateFields(event, data)}
              name="username"
            />
            <Form.Input
              fluid
              icon="mobile alternate"
              iconPosition="left"
              placeholder="Mobile number"
              value={moibleNumber}
              onChange={(event, data) => populateFields(event, data)}
              name="mobileNumber"
            />
            {verificationSent && (
              <Form.Input
                fluid
                icon="key"
                iconPosition="left"
                placeholder="Enter your code"
                value={verificationCode}
                onChange={(event, data) => populateFields(event, data)}
                name="verificationCode"
              />
            )}
            <Button
              color="teal"
              fluid
              size="large"
              onClick={!verificationSent ? sendSmsCode : sendVerificationCode}
            >
              {!verificationSent ? "Login/Signup" : "Enter your Code"}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
