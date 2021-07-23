import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { signin, signup } from "../../action/auth";
import Icon from "./Icon";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import BlockOutlinedIcon from "@material-ui/icons/BlockOutlined";
import useStyles from "../styles/AuthStyle";
import Input from "./Input";
import { useHistory } from "react-router-dom";

function Auth() {
  const initialState = {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
  };

  const [formData, setFormData] = useState(initialState);

  const history = useHistory();
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    if (isSignUp) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const switchMode = () => {
    setIsSignUp((prev) => setIsSignUp(!prev));
    setShowPassword(false);
  };

  const googleFailure = (res) => {
    console.log(res);
  };
  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch({ type: "AUTH", data: { result, token } });
      history.push("/");
    } catch (error) {}
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <BlockOutlinedIcon />
          </Avatar>
          <Typography varient="h5">
            {isSignUp ? "Sign Up " : "Sign In"}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    handleChange={handleChange}
                    half
                  />
                </>
              )}

              <Input
                name="email"
                label="Email Address"
                handleChange={handleChange}
                type="email"
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
                handleShowPassword={handleShowPassword}
              />
              {isSignUp && (
                <Input
                  name="confirmPassword"
                  label="Repeat Password"
                  handleChange={handleChange}
                  type="password"
                />
              )}
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
            <GoogleLogin
              clientId="813086723996-v32emd994183vrosj88trv2lk2iqpq4f.apps.googleusercontent.com"
              //813086723996-v32emd994183vrosj88trv2lk2iqpq4f.apps.googleusercontent.com
              render={(renderProps) => (
                <Button
                  className={classes.googleButton}
                  fullWidth
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<Icon />}
                  variant="contained"
                  color="primary"
                >
                  Google Sign In
                </Button>
              )}
              cookiePolicy="single_host_origin"
              onSuccess={googleSuccess}
              onFailure={googleFailure}
            />
            <Grid container>
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignUp
                    ? "Already have the account ? Sign In"
                    : "Create Account ? : Sign Up "}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

export default Auth;
