import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useLoginViewModel = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();

  const loginApi = async () => {

    // VALIDATION
    if (!email.trim()) {
      toast.error('Please enter email');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter password');
      return;
    }

    setLoginLoading(true);

    try {

      // LOGIN API
      const response = await apiClient.post(
        ENDPOINTS.LOGIN,
        {
          email: email.trim(),
          password: password,
        }
      );

      console.log("FULL RESPONSE =>", response);

      // STATUS CODE
      console.log("STATUS CODE =>", response.status);

      // SUCCESS
      if (response.status === 200) {

        // RESPONSE DATA
        const responseData = response.data?.data;

        // USER
        const user = responseData?.user;

        // TOKEN
        const token = responseData?.token;

        // USER ID
        const userId = user?.id;

        // SAVE TOKEN
        localStorage.setItem("token", token);

        // SAVE USER
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        // SAVE USER ID
        localStorage.setItem(
          "userId",
          userId
        );

        // PRINT
        console.log("TOKEN SAVED =>", token);

        console.log("USER SAVED =>", user);

        console.log("USER ID =>", userId);

        console.log(
          "LOCAL TOKEN =>",
          localStorage.getItem("token")
        );

        console.log(
          "LOCAL USER =>",
          JSON.parse(localStorage.getItem("user"))
        );

        toast.success(
          response.data?.message || "Login Successful"
        );

        // NAVIGATE
        navigate("/dashboard", {
          replace: true,
        });

      } else {

        toast.error("Invalid credentials");

      }

    } catch (error) {

      console.log("LOGIN ERROR =>", error);

      // API ERROR
      if (error.response) {

        console.log(
          "ERROR STATUS =>",
          error.response.status
        );

        console.log(
          "ERROR DATA =>",
          error.response.data
        );

        toast.error(
          error.response.data?.message ||
          "Login Failed"
        );

      } else if (error.request) {

        toast.error(
          "No response from server"
        );

      } else {

        toast.error(
          "Something went wrong"
        );

      }

    } finally {

      setLoginLoading(false);

    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loginLoading,
    loginApi,
  };
};