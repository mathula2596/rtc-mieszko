"use client";
import React, { useState, useEffect, useContext } from "react";
import StoreForm from "../components/storeForm";
import { useRouter } from "next/navigation";
import axios from "axios";
import { formatDate } from "../../../../helpers/helpers";
import { Card } from "flowbite-react";
import { io } from "socket.io-client";
import { SocketContext } from "../../context/socketContext";
import Notify from "../../../../components/toast";
import { Toaster } from "react-hot-toast";

const EditRtc = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [rtc, setRtc] = useState({
    _id: id,
    barcode: "",
    name: "",
    department: "",
    qty: "",
    expiry: "",
    price: "",
    updatedQty: "",
  });
    const socket = useContext(SocketContext).socket;

  const onUpdate = async () => {
    try {
      const response = await axios.put(`/api/rtc/${rtc._id}`, rtc);
      console.log(response);
      Notify({ message: response.data.message, success: true });

      // const socket = io("http://localhost:3005");
      // socket.emit("test", { message: "Triggeer" });
      console.log("socket",socket);
      
        socket.emit("test", { message: response.data.message });
      // router.push("/rtc")
      console.log("triggered");

    } catch (error) {
      console.log(error);
    }
  };

  const getRtc = async () => {
    // const userId = id
    try {
      const response = await axios.get(`/api/rtc/${rtc._id}`);
      console.log(response.data.data);
      setRtc(response.data.data);
      setRtc((prevRtc) => ({
        ...prevRtc,
        expiry: formatDate(response.data.data.expiry),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (rtc._id) {
      getRtc();
    }
  }, []);
  return (
    <div className="p-6">
      <section>
        <Card>
          <header>
            <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200">
              Edit Rtc {rtc.barcode}
            </h2>
          </header>
          <div className={`max-w-full`}>
            <form onSubmit={(e) => e.preventDefault()}>
              <StoreForm rtc={rtc} setRtc={setRtc} />

              <button
                type="submit"
                className="text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900"
                onClick={onUpdate}
              >
                Submit
              </button>
            </form>
            <Toaster />

          </div>
        </Card>
      </section>
    </div>
  );
};

export default EditRtc;
