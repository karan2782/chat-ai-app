"use client";

import { loginUser } from "@/lib/thunks/userThunk";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { setUser } from "@/lib/reducers/userSlice";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.user);
  const [credential, setCredential] = useState<any>({
    email: "",
    password: "",
  });

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        const user: any = jwtDecode(localStorage.getItem("token") || "");
        dispatch(setUser(user));
        router.replace("/messages");
      }
    } catch (error) {
      return;
    }
  }, [dispatch, router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credential));
      router.replace("/messages");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="h-[100vh] border-2 flex items-center">

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-5 w-[400px] border-1 p-2  m-auto rounded-md"
      >
        <h2 
        className='text-center text-xl'
        >Login</h2>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) =>
            setCredential((prev: any) => ({ ...prev, email: e.target.value }))
          }
          className="p-2  border-b-1"
        />
        <input
          type="password"
          placeholder="Enter passoword"
          onChange={(e) =>
            setCredential((prev: any) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          className="p-2 border-b-1"
        />
        <button
          className="cursor-pointer bg-blue-300 rounded-md hover:bg-blue-400 p-2"
          type="submit"
        >
          {user?.loading ? "Loading..." : 'Login'}
        </button>

        <p 
        className='text-center'
        >Don't have an account?
          <Link
          className='underline'
           href='/signup'> Signup</Link>
           </p>
      </form>
    </div>
  );
};

export default Login;
