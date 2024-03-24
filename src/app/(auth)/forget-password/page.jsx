"use client"
import { Card, TextInput, Button } from 'flowbite-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import LoginLayout from '../layout'
import toast from 'react-hot-toast'
import axios from 'axios'
import Link from 'next/link'

const ForgetPassword = () => {
  const route = useRouter()

  const [user, setUser] = useState({
    email: "",
  })

  const onSubmit = async () => {
    try {
      const response = await axios.post("/api/users/forget-password", user)
      console.log(response)
      toast.success("Please check your email")
    
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
                Forget Password
              </h2>
            </header>
            <div className={`max-w-full`}>



              <form onSubmit={e => e.preventDefault()} className="m-4">
                <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div>
                    <TextInput
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />

                  </div>
                  
                </div>
                <Button type="button" className="text-white  bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full  px-5 py-1 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900 items-center " onClick={onSubmit}>Submit</Button>
              </form>
            </div>
            <div className="grid gap-6 mb-6 md:grid-cols-1">
                  <div className="text-center">
                    <Link href="/login">Login</Link>
                  </div>
            </div>
         
          </Card>
        </section>
      </div>  

    </LoginLayout>
  )
}

export default ForgetPassword