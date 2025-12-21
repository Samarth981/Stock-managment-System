import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance, { showErrorPopup } from "../../utils/axiosInstance";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Google from "@mui/icons-material/Google";
import Facebook from "@mui/icons-material/Facebook";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import AuthContext from "../../context/AuthContext";
import "../../index.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleTogglePassword = (event) => {
    event.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { success, user } = data;

      if (success) {
        login(user);
        navigate("/");
      }
    } catch (error) {
      showErrorPopup("An error occurred. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
    setInputValue({ email: "", password: "" });
  };

  return (
    <div className="singUpContainer">
      <Card
        sx={{
          width: { xs: "100%", sm: 400 },
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          backgroundColor: "#0d1b2a",
          color: "white",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            mb={3}
            sx={{ color: "#f0f0f0" }}
          >
            Login Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              variant="outlined"
              margin="dense"
              sx={{ backgroundColor: "#1b263b", input: { color: "white" } }}
              InputLabelProps={{ style: { color: "#a8dadc" } }}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              variant="outlined"
              margin="dense"
              sx={{ backgroundColor: "#1b263b", input: { color: "white" } }}
              InputLabelProps={{ style: { color: "#a8dadc" } }}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="remember">
              <FormControlLabel
                control={<Checkbox sx={{ color: "#a8dadc" }} />}
                label={
                  <Typography sx={{ color: "#a8dadc", fontSize: "14px" }}>
                    Remember me
                  </Typography>
                }
              />
              <Typography
                sx={{ fontSize: "14px", color: "#ff758c", cursor: "pointer" }}
              >
                Forgot your password?
              </Typography>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: "#ff758c",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#ff5a7b" },
              }}
            >
              Login
            </Button>

            <Typography textAlign="center" sx={{ mt: 2, fontSize: "14px" }}>
              Don't have an account?{" "}
              <Link className="loginSignup" to={"/Signup"}>
                Signup
              </Link>
            </Typography>
          </form>
          <Divider
            sx={{
              display: "flex",
              alignItems: "center",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "bold",
              fontSize: "14px",
              my: 2,
              "&::before, &::after": {
                borderTop: "2px solid rgba(255, 255, 255, 0.3)", // Make the lines slightly thicker
                flex: 1,
                content: '""',
              },
              "& span": {
                px: 1.5,
                backgroundColor: "#0D1B2A", // Match with your background
              },
            }}
          >
            or
          </Divider>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            sx={{
              textTransform: "none",
              mb: 2,
              color: "white",
              borderColor: "#a8dadc",
              "&:hover": { borderColor: "#ff758c", color: "#ff758c" },
              borderRadius: 3,
            }}
          >
            Login with Google
          </Button>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<Facebook />}
            sx={{
              textTransform: "none",
              color: "white",
              borderColor: "#a8dadc",
              "&:hover": { borderColor: "#ff758c", color: "#ff758c" },
              borderRadius: 3,
            }}
          >
            Login with Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
