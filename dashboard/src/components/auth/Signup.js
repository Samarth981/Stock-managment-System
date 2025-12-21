import React, { useState } from "react";
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
import "../../index.css";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      return;
    }
    try {
      const { data } = await axiosInstance.post("/auth/signup", {
        ...inputValue,
      });

      const { success } = data;
      if (success) {
        navigate("/login");
      }
    } catch (error) {
      showErrorPopup("An error occurred. Please try again later.");
    }

    setInputValue({
      ...inputValue,
      email: "",
      password: "",
      username: "",
    });
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
            Sign Up
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="email"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              variant="outlined"
              margin="dense"
              sx={{ backgroundColor: "#1b263b", input: { color: "white" } }}
              InputLabelProps={{ style: { color: "#a8dadc" } }}
            />

            <TextField
              fullWidth
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              variant="outlined"
              margin="dense"
              sx={{ backgroundColor: "#1b263b", input: { color: "white" } }}
              InputLabelProps={{ style: { color: "#a8dadc" } }}
            />

            <TextField
              fullWidth
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              variant="outlined"
              margin="dense"
              sx={{ backgroundColor: "#1b263b", input: { color: "white" } }}
              InputLabelProps={{ style: { color: "#a8dadc" } }}
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
              Submit
            </Button>

            <Typography textAlign="center" sx={{ mt: 2, fontSize: "14px" }}>
              Already have an account?{" "}
              <Link className="loginSingup" to={"/login"}>
                Login
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
            Sign Up with Google
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
            Sign Up with Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
