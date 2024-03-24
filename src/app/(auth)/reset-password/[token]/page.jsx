"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoginLayout from '../../layout'
import { Button, Card, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation'

const ResetPassword = ({params}) => {
  
  const [token,setToken] = useState("")
  const router = useRouter()

  const [verified,setVerified]=useState(false)
  const [error, setError] = useState("")
  const [validation, setValidation] = useState("")
  const [user,setUser] = useState({
    password:"",
    confirmPassword:"",
    email:""
  })

  const verifyToken = async () => {
    try {
      console.log(token)

      const response = await axios.post(`/api/users/verify-password/${token}`)
      console.log(response)
      if(response.data.success){
        setVerified(true)
        setUser({
          ...user,
          email:response.data.message.email
        })
      }
      else{
        setVerified(false)
        setError(response.data.error)
        console.log("Not valid to change password")

      }
    } catch (error) {
      console.log(error)
      setError("Try again later!")

    }
  }

  useEffect(() => {
    if (params && params.token) {
      
      setToken(params.token);
      router.push("/login")
    } else {
      console.error("Token is undefined");
    }

    if(token!="")
    {
      verifyToken();

    }
  }, [params,token]);

  
const onSubmit = async () =>{
  if(user.password != user.confirmPassword)
  {
    setValidation("Please check your passwords!")
  }
  else{
    setValidation("")
    try {
      const response = await axios.post(`/api/users/reset-password/${token}`,user)
      console.log(response)
    
    } catch (error) {
      console.log(error)
      setError("Try again later!")

    }

  }
}
  return (
    <>
    {verified?(
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
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />

                  </div>
                  <div>
                    <TextInput
                      id="confirmPassword"
                      type="password"
                      placeholder="Re enter your password"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
                      value={user.confirmPassword} onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                    />

                  </div>
                  {validation!=""?(
                    <div>
                    <span className=' text-red-800 m-2'>{validation}</span>  
                    </div>
                  ):
                  ""}
                  
                  
                </div>
                <Button type="button" className="text-white  bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full  px-5 py-1 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900 items-center " onClick={onSubmit}>Change Password</Button>
              </form>
            </div>
         
          </Card>
        </section>
      </div>

    </LoginLayout>

    ):(
      <div>
        {error}
      </div>

    )}
    </>
  )
}

export default ResetPassword