"use client";
import { signupUser } from "@/lib/thunks/userThunk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Signup = () => {
  const { userRegistered, userRegisteredError, userRegisteredLoading } =
    useSelector((state: any) => state.user);
  const [userInfo, setUserInfo] = useState<any>({
    fullName: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  console.log(
    "userRegistered",
    userRegistered,
    userRegisteredError,
    userRegisteredLoading,
  );
  const [showPassword, setShowPassword] = useState(false);
  const dispatch: any = useDispatch();

  useEffect(() => {
    if (userRegistered) {
      router.replace("/login");
      return;
    }
    return;
  }, [userRegistered]);
  const handleSignup = (e: any) => {
    e.preventDefault();
    dispatch(signupUser(userInfo));
    setUserInfo({
      fullName: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="h-[100vh] border-2 flex items-center">
      <form
        onSubmit={handleSignup}
        className="flex flex-col gap-5 w-[400px] border-1 p-2  m-auto rounded-md"
      >
        <h2 className="text-center text-xl">Signup</h2>
        <input
          type="text"
          placeholder="Enter full name"
          value={userInfo.fullName}
          onChange={(e) =>
            setUserInfo((prev: any) => ({ ...prev, fullName: e.target.value }))
          }
          className="p-2  border-b-1"
        />
        <input
          type="email"
          placeholder="Enter email"
          value={userInfo.email}
          onChange={(e) =>
            setUserInfo((prev: any) => ({ ...prev, email: e.target.value }))
          }
          className="p-2  border-b-1"
        />
        <div className="relative">
          <input
            value={userInfo.password}
            type={showPassword ? "text" : "password"}
            placeholder="Enter passoword"
            onChange={(e) =>
              setUserInfo((prev: any) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            className="p-2 border-b-1 w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <button
          className="cursor-pointer bg-blue-300 rounded-md hover:bg-blue-400 p-2"
          type="submit"
          disabled={userRegisteredLoading}
        >
          {userRegisteredLoading ? "Loading..." : "Signup"}
        </button>

        <p className="text-center text-red-500">
          {userRegisteredError && <>{userRegisteredError}</>}
        </p>

        <p className="text-center">
          Already have an account?
          <Link className="underline" href="/login">
            {" "}
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
