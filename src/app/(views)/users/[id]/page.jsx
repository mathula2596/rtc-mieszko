"use client"
import React,{useEffect} from 'react'
import { useRouter } from "next/navigation"
import UserForm from '../components/form';
import axios from 'axios';
import { Button, Card } from 'flowbite-react';
import { Toaster } from 'react-hot-toast';

const EditUser = ({ params }) => {
    const {id} =params 
    const router = useRouter()
    const [user, setUser] = React.useState({
        _id:id,
        email: "",
        name:"",
        // password: "",
        username: "",
        type: "",
        store: [],
        isActive:Boolean
    })

    const getUserById = async () => {
        try {
            const response = await axios.get(`/api/users/users/${user._id}`);
            console.log(response.data.data);
            setUser(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const onUpdate = async () => {
        try {
            const response = await axios.put(`/api/users/users/${user._id}`,user)
            // console.log(response)
            router.push("/users")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(user._id){
            getUserById()
        }
    }, []);
    

    return(
        <div className="p-6">
        <section>
            <Card>
                <header>
                    <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200">
                    Edit User {user.username}
                    </h2>
                </header>
                <div className={`max-w-full`}>



                    <form onSubmit={e=>e.preventDefault()}>
                    <UserForm user={user} setUser={setUser} />


                        <Button type="button" className="text-white rounded-full bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium  text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900" onClick={onUpdate}>Submit</Button>
                    </form>
                    <Toaster />
                    
                </div>
            </Card>
        </section>
    </div>
      
    )
}

export default EditUser