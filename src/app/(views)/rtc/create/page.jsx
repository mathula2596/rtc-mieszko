"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import StoreForm from "../components/storeForm";
import { Button, Card } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import Notify from "../../../../components/toast";
import { io } from "socket.io-client";
import { SocketContext } from "../../context/socketContext";

const CreateRtc = () => {
  const [rtc, setRtc] = useState({
    _id: "",
    barcode: "",
    name: "",
    department: "",
    qty: "",
    expiry: "",
    price: "",
    updatedQty: "",
  });
  // const socket = useContext(SocketContext).socket;

  const onCreate = async () => {
    try {
      const response = await axios.post("/api/rtc", rtc);

      console.log(response);
      if (response.data.success) {
        Notify({ message: response.data.message, success: true });
        setRtc({
          barcode: "",
          name: "",
          department: "",
          qty: "",
          expiry: "",
          price: "",
          updatedQty: "",
          _id: "",
        });

        const socket = io("http://localhost:3005");
        socket.emit("test", { message: response.data.message });
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
              New RTC
            </h2>
          </header>
          <div className={`max-w-full`}>
            <form onSubmit={(e) => e.preventDefault()}>
              <StoreForm rtc={rtc} setRtc={setRtc} />

              <Button
                type="button"
                className="text-white rounded-full bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={onCreate}
              >
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

export default CreateRtc;
