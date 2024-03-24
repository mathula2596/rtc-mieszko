"use client"
import { useRouter } from "next/navigation"
import axios from "axios"
import React, { useState } from 'react'
import toast from "react-hot-toast"
import { Button, Card, TextInput } from "flowbite-react"
import Link from "next/link"
import LoginLayout from "../layout"

const LoginPage = () => {



  const router = useRouter();


  const [user, setUser] = useState({
    password: "",
    username: "",
  })

  const onLogin = async () => {
    try {
      const response = await axios.post("/api/users/login", user)
      toast.success("login successful")
      if(!response.data.error)
      {
        router.push("/rtc")
      }
      else{
        toast.error(response.data.error)
        console.log(response.data.error)
      }      
      // trigger event

      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <LoginLayout>
      <div className="content-center">
        <section>
          <Card className="max-w-sm">
            <header>
              <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200 text-center justify-center">
                Login
              </h2>
            </header>
            <div className={`max-w-full`}>



              <form onSubmit={e => e.preventDefault()} className="m-4">
                <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <TextInput
                      id="username"
                      type="text"
                      placeholder="Username"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />

                  </div>
                  <div>
                    <TextInput
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />

                  </div>
                </div>
                <Button type="button" className="text-white  bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full  px-5 py-1 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900 items-center" onClick={onLogin}>Login</Button>
              </form>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div className="text-center">
                    <Link href="/forget-password">Forget Password</Link>
                  </div>
            </div>
          </Card>
        </section>
      </div>

    </LoginLayout>
  )
}
export default LoginPage