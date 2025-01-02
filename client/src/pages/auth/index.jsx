import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants';

const GOOGLE_CLIENT_ID ="857779810805-sbojmllvthbp03kjeuanbjn0a0neugfq.apps.googleusercontent.com"

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1]; // Extract the payload part of the JWT.
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Adjust for Base64 URL encoding.
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload); // Return the payload as a JSON object.
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null; // Return null if decoding fails.
  }
};


const Auth = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleVerified, setGoogleVerified] = useState(false);
  
const handleGoogleSuccess = (response) => {
  const token = response.credential; // This contains the ID token.
  const decoded = parseJwt(token); // Use the custom decoder.

  if (decoded && decoded.email) {
    const userEmail = decoded.email; // Extract the email.
    setEmail(userEmail);
    setGoogleVerified(true);

    toast({
      title: "Google Sign-In Successful",
      description: `Logged in as ${userEmail}`,
    });
  } else {
    toast({
      title: "Invalid Token",
      description: "Failed to extract email from the Google token.",
      variant: "destructive",
    });
  }

};

const handleGoogleFailure = (error) => {
  console.error("Google Sign-In Failed:", error);

  toast({
    title: "Google Sign-In Failed",
    description: "There was an issue logging in with Google.",
    variant: "destructive",
  });
};


  const validateLogin = () => {
    if (!password.length) {
      toast({
        title: "Password is required",
        description: "Please enter valid credentials",
      });
      return false;
    }
    if (!name.length) {
      toast({
        title: "Name is required",
        description: "Please enter valid credentials",
      });
      return false;
    }

    return true;
  };

  const validateSignup = () => {
    if (!email.length) {
      toast({
        title: "Email is required",
        description: "Please enter valid credentials",
      });
      return false;
    }

    if (!password.length) {
      toast({
        title: "Password is required",
        description: "Please enter valid credentials",
      });
      return false;
    }
    if (!name.length) {
      toast({
        title: "Name is required",
        description: "Please enter valid credentials",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password and Confirm Password should be the same",
        description: "Please enter valid credentials",
      });
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { username: name, password }, { withCredentials: true });

        toast({
          title: "Login Successful",
          description: `Welcome back, ${response.data.user.username}!`,
        });
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Login failed. Please check your credentials.";

        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleSignup = async () => {
    if (validateSignup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTE, { username: name, email, password }, { withCredentials: true });

        toast({
          title: "Signup Successful",
          description: "Your account has been created successfully.",
        });
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Signup failed. Please try again.";

        toast({
          title: "Signup Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleGoogleVerify = () => {
    setGoogleVerified(true);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <div className="w-screen h-screen flex items-center justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Register</TabsTrigger>
          <TabsTrigger value="password">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Please enter the following credentials to make an Account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Username</Label>
                <Input id="name" placeholder="Username" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password1" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input id="password2" placeholder="Password Again" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className="mt-4">
              {!googleVerified ? (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleFailure}
                      render={(renderProps) => (
                        <Button
                          className="w-full flex items-center justify-center space-x-2 bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <FcGoogle size={20} />
                          <span>Continue with Google</span>
                        </Button>
                      )}
                    />
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <AiOutlineCheckCircle size={20} />
                      <span>Email Verified</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignup}>Sign Up</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login using your credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Username</Label>
                <Input id="current" type="name" placeholder="Username" onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleLogin}>Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
