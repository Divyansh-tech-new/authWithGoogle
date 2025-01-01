import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

import {apiClient} from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants';

const Auth = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const validateLogin=()=>{
      if (!password.length) {
        toast({
          title: "password is required",
          description: "Please enter valid credentials",
        })
        return false;      
    }
    if (!name.length) {
      toast({
        title: "Name is required",
        description: "Please enter valid credentials",
      })
      return false;}

    return true;
  }

  const validateSignup = () => {
    console.log("2");
    if (!email.length) {
      toast({
        title: "Email is required",
        description: "Please enter valid credentials",
      })
      return false;
    }
      
      if (!password.length) {
        toast({
          title: "password is required",
          description: "Please enter valid credentials",
        })
        return false;      
    }
    if (!name.length) {
      toast({
        title: "Name is required",
        description: "Please enter valid credentials",
      })
      return false;}
      console.log(password);
      console.log(confirmPassword);
      if (password!==confirmPassword) {
        toast({
          title: "Password and Confrim Password should be same",
          description: "Please enter valid credentials",
        })
        return false;}
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
    console.log("1");
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

  return (
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
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password1" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input id="password2" placeholder="Password Again" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
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
  );
};

export default Auth;
