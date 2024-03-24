"use client";
import { useRouter } from "next/navigation";
import axios from "axios";
import React, {useState } from "react";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import Notify from "../../../../components/toast";

const ChangePassword = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  const onSubmit = async () => {
    try {
      const response = await axios.post("/api/users/change-password", user);
      if (response.data.success) {
        Notify({ message: response.data.message, success: true });
        await axios.get("/api/users/logout");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      Notify({
        message: "Sorry, error occurred. Please contact the admin!",
        success: false,
      });
    }
  };

  return (
    <div className="p-6">
      <section>
        <Card>
          <header>
            <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200">
              Change Password
            </h2>
          </header>
          <div className={`max-w-full`}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <Label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </Label>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm Password
                  </Label>
                  <TextInput
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                    value={user.confirmPassword}
                    onChange={(e) =>
                      setUser({ ...user, confirmPassword: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="button"
                className="text-white rounded-full bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={onSubmit} >
                Submit
              </Button>
            </form>
            <Toaster />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default ChangePassword;
