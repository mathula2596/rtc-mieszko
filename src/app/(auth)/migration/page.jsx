"use client"
import axios  from "axios"
import React,{useEffect} from 'react'


const MigrationPage = () => {
    useEffect(()=>{
        defaultUserCreate()
    })
    
    const defaultUserCreate = async () => {
        try {
            await axios.get("/api/users/users/migration")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="p-6">
            Thank you
        </div>
    )
}

export default MigrationPage