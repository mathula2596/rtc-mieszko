"use client"
import { useRouter } from "next/navigation"
import axios  from "axios"
import React,{useState} from 'react'
import UserForm from "../components/form"
import { Button, Card } from "flowbite-react"
import { Toaster } from "react-hot-toast"
import Notify from "../../../../components/toast"


const UserRegisterPage = () => {
    const router = useRouter()
    const [user, setUser] = useState({
        email: "",
        name:"",
        password: "",
        username: "",
        type: "",
        store: [],
    })
 
    const onCreate = async () => {
        try {
            const response = await axios.post("/api/users/users",user)
            router.push("/users")
            if(response.data.success){
                Notify({ message: response.data.message, success:true });
                setUser({
                    email: "",
                    name:"",
                    password: "",
                    username: "",
                    type: "",
                    store: [],
                })

            }

        } catch (error) {
            console.log(error)
            Notify({ message: "Sorry, error occurred. Please contact the admin!", success:false });

        }
    }
   
    return (
        <div className="p-6">
        <section>
            <Card>
                <header>
                    <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200">
                    New User
                    </h2>
                </header>
                <div className={`max-w-full`}>
                    <form onSubmit={e=>e.preventDefault()}>
                        <UserForm user={user} setUser={setUser}  />

                        <Button type="button" className="text-white rounded-full bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={onCreate}>Submit</Button>
                    </form>
                    <Toaster />
                </div>
            </Card>
        </section>
    </div>
    )
}

export default UserRegisterPage