"use client";
import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Card } from 'flowbite-react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';

import Popup from '../../../components/model';
import OfficeForm from './components/officeForm';
import { formatDate, formatDateTime, priceFormat } from '../../../helpers/helpers';
import { Button } from 'primereact/button';
import Link from 'next/link';
import SuperForm from './components/superForm';
import Notify from '../../../components/toast';
import { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import { SocketContext } from '../context/socketContext';
import { ProfileContext } from '../context/profileContext';

const ListRtc = () => {

  const router = useRouter();


  const [allRtc, setAllRtc] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const dt = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState('');

  const [rtc, setRtc] = useState({
    _id: "",
    barcode: "",
    name: "",
    department: "",
    qty: "",
    expiry: "",
    price: "",
    approvedPrice: "",
    isApproved: false,
    store: "",
    isCompleted: false,
    verification: ""
  });

  const getRtc = async () => {
    try {
      const response = await axios.get(`/api/rtc`);
      // console.log(response.data.data);
      setAllRtc(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const {profile} = useContext(ProfileContext)

  useEffect(() => {
    getRtc()
    
  }, []);
  
  const openModal = (id) => {
    setSelectedId(id)
    setOpen(true);
    if (allRtc != null) {
      const selectedRtc = allRtc.find((rtc) => rtc._id === id);
      // alert(id)

      if (selectedRtc) {
        setRtc(selectedRtc);
        const headerData = `${selectedRtc.barcode}`
        setModalHeader(headerData)
        // alert(modalHeader)
      }
    }
  };

  const closeModal = () => {
    setOpen(false);
  };


  const openNew = () => {
    router.push('/rtc/create')
  }
  const socket = useContext(SocketContext).socket;

  const approveMulti = async () => {
    try {
      const response = await axios.put(`/api/rtc`, selectedProducts);
      // console.log(response)
      getRtc()
      Notify({ message: response.data.message, success: true });

      const socket = io('http://localhost:3005');
      socket.emit("test",{message:"Triggeer"})
      // socket.emit("test", { message: response.data.message });

    } catch (error) {
      console.log(error);
    }
  }

  const deleteExpired = async () => {
    try {
      const response = await axios.get(`/api/rtc/delete`);
      // console.log(response)
      getRtc()
      Notify({ message: response.data.message, success: true });

    } catch (error) {
      console.log(error);
    }
  }


  const exportCSV = () => {
    dt.current !== null ? dt.current.exportCSV() : 0;
  }

  const onPriceUpdate = async () => {
    try {

      const response = await axios.put(`/api/rtc/${selectedId}`, rtc);
      console.log(socket);

      socket.emit("test", { message: "triggered" });
      if(response.data.success){
        console.log("socket");

        closeModal()

      }
      getRtc()
      // const socket = io('http://localhost:3005');
    //   socket.emit("test",{message:"Triggeer"})
    //   const socket = useContext(SocketContext);
      
    } catch (error) {
      console.log(error);
    }
  }

  const actionBodyTemplate = (rowData) => (
    <React.Fragment>
      {(profile.userType === "Admin") ? (
        (profile.userType === "Admin" && (rowData.verification === "Pending" || rowData.verification === "Pending Approval")) ? (
          <Link href="#" onClick={() => openModal(rowData._id)} key={rowData._id} className="font-medium text-red-800 hover:underline dark:text-red-900" id={rowData._id}>
            <Button icon="pi pi-pencil" />
          </Link>
        ) : (
          <Link href="#" className="font-medium text-red-800 hover:underline dark:text-red-900" id={rowData._id}>
            <Button icon="pi pi-pencil" />
          </Link>
        )
      ) : (
        (profile.userType === "Super") ? (
          <Link href="#" onClick={() => openModal(rowData._id)} key={rowData._id} className="font-medium text-red-800 hover:underline dark:text-red-900" id={rowData._id}>
            <Button icon="pi pi-pencil" />
          </Link>
        ) : (
          <Link href={`/rtc/${rowData._id}`} className="font-medium  text-red-800 hover:underline dark:text-red-900" id={rowData._id}>
            <Button icon="pi pi-pencil" />
          </Link>
        )
      )}

    </React.Fragment>


  )

  const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.expiry)
  }
  const createdDateBodyTemplate = (rowData) => {
    return formatDateTime(rowData.dateCreated)
  }
  const priceDateBodyTemplate = (rowData) => {
    return formatDateTime(rowData.priceDate)
  }
  const approvedDateBodyTemplate = (rowData) => {
    return (<div className='barcode'>
      {formatDateTime(rowData.approvedDate)}
    </div>)
    // return formatDateTime(rowData.approvedDate)
  }
  const priceTemplate = (rowData) => {
    return priceFormat(rowData.price)
  }

  const qtyTemplate = (rowData) => {
    return rowData.updatedQty != null ? rowData.updatedQty : rowData.qty
  } 
  
  const verificationBodyTemplate = (rowData) => {
    return(
      <div>
        {rowData.verification === "Approved with New Price" ? "Approved":rowData.verification}
      </div>
    )
  }
  const barcodeBodyTemplate = (rowData) => {
    return(
      <div className='barcode'>
        {rowData.barcode}
      </div>
    )
  }
  
  const verificationTemplate = (data) => {
    // console.log(data)
    if (data === "Pending") {
      return "pending"
    }
    else if (data === "Approved") {
      return "approved"
    }
    else if (data === "Rejected") {
      return "rejected"
    }
    else if (data === "Approved with New Price") {
      return "approved_new"
    }
    else if (data === "Pending Approval") {
      return "pending_approval"
    }
  }
  const approvedPriceTemplate = (rowData) => {
    return priceFormat(rowData.approvedPrice)
  }
  const header = (
    <div className="flex flex-column md:flex-row md:align-items-center justify-between">
      <div className='flex flex-column md:flex-row md:align-items-center'>
        <div className='text-sm w-5'>
          <i className="pi pi-search mt-2" />
        </div>

        <div>
          <span className="p-input-icon-left w-full md:w-auto">
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500" />
          </span>
        </div>
      </div>
    
      <div className="md:mt-0 flex justify-content-end">
        
        
        {profile.userType === "Super" ? (
         <>
          <div className='mr-1'>
            <Button icon="pi pi-check" className="p-2 bg-red-900 text-white" onClick={approveMulti}/>
            </div>
            <div className='ml-1'>
            <Button icon="pi pi-trash" className="p-2 bg-red-900 text-white" onClick={deleteExpired}/>
            </div>
            </>
        ) : (
            profile.userType === "Store"
        )?(
          <div>
          <Button icon="pi pi-plus" className="p-2 bg-red-900 text-white p-button-rounded" onClick={openNew} tooltip="New" tooltipOptions={{ position: 'bottom' }} />
        </div>
        ):(null)}
        {/* <div>
        <Button icon="pi pi-upload" className="p-button-help p-button-rounded" onClick={exportCSV} tooltip="Export" tooltipOptions={{ position: 'bottom' }} />
        </div> */}
      </div>
    </div>
  );

  const manageSelection = (e) => {
    // console.log(e)
    // console.log(e.value)
    setSelectedProducts(e.value)
  }
  const rowClass = (rowData) => {
    const dateCreated = new Date(rowData.dateCreated);
    const priceDate = new Date(rowData.priceDate);
    const approvedDate = new Date(rowData.approvedDate);
    const eightHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 8 hours ago

    if (
      dateCreated < eightHoursAgo ||
      priceDate < eightHoursAgo ||
      approvedDate < eightHoursAgo
    ) {
      return 'highlighted-row';
    }
    return '';
  }
  return (
    <div className="p-6">
      <section>
        <Card>
          <header>
            <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200">
              All RTC List
            </h2>
       
          </header>
          <div className={`max-w-full`}>
            {allRtc === null ? (
              <p>Loading...</p>
            ) : (
              <>
                {(profile.userType === "Admin") ? (
                  <DataTable ref={dt} value={allRtc} selection={selectedProducts}
                    dataKey="_id" paginator rows={20} rowsPerPageOptions={[5, 10, 25]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} RTC List" header={header}
                    globalFilter={globalFilter} paginatorClassName='bg-red' className=''
                    cellClassName={verificationTemplate}
                    showGridlines
                    rowClassName={rowClass}
                    stripedRows
                  >
                    <Column field="store" header="Store" sortable ></Column>
                    <Column field="department" header="Department" sortable ></Column>
                    <Column field="barcode" header="Barcode" body={barcodeBodyTemplate} sortable ></Column>
                    <Column field="name" header="Name" sortable ></Column>
                    <Column field="count" header="Count" ></Column>
                    <Column field="expiry" header="Expiry" style={{minWidth: '9rem'}}  body={dateBodyTemplate} sortable ></Column>
                    <Column field="updatedQty" header="NewQty"></Column>
                    <Column field="qty" header="Qty"></Column>
                    <Column field="price" header="Price" sortable body={priceTemplate} ></Column>
                    <Column field="approvedPrice" header="AppPrice" body={approvedPriceTemplate} sortable></Column>
                    <Column field="verification" header="Status" sortable body={verificationBodyTemplate}  ></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false}></Column>
                  </DataTable>

                ) : (profile.userType === "Super") ? (
                  <DataTable ref={dt}
                    value={allRtc}
                    selection={selectedProducts}
                    selectionMode={profile.userType === "Super" ? 'checkbox' : null}
                    onSelectionChange={(e) => manageSelection(e)}
                    dataKey="_id"
                    paginator
                    rows={20}
                    rowsPerPageOptions={[5, 10, 25]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} RTC List"
                    header={header}
                    globalFilter={globalFilter}
                    paginatorClassName='bg-red'
                    className=''
                    rowClassName={rowClass}
                    cellClassName={verificationTemplate}
                    showGridlines
                    stripedRows
                  >
                    <Column selectionMode="multiple" exportable={false} className='checkable'></Column>
                    <Column field="store" header="Store" sortable ></Column>
                    <Column field="department" header="Department" sortable ></Column>
                    <Column field="barcode" header="Barcode" sortable body={barcodeBodyTemplate} ></Column>
                    <Column field="verification" header="Status" sortable body={verificationBodyTemplate} ></Column>
                    <Column field="name" header="Name" sortable ></Column>
                    <Column field="count" header="Count" ></Column>
                    <Column field="expiry" style={{minWidth: '9rem'}} header="Expiry" body={dateBodyTemplate} sortable ></Column>
                    <Column field="updatedQty" header="NewQty" ></Column>
                    <Column field="qty" header="Qty" ></Column>
                    <Column field="price" header="Price" sortable body={priceTemplate} ></Column>
                    <Column field="approvedPrice" header="App.Price" body={approvedPriceTemplate} sortable></Column>
                    <Column field="dateCreated" header="Created" body={createdDateBodyTemplate} sortable></Column>
                    <Column field="priceDate" header="PriceDate" body={priceDateBodyTemplate} sortable></Column>
                    <Column field="approvedDate" header="AppDate" body={approvedDateBodyTemplate} sortable></Column>

                    <Column body={actionBodyTemplate} header="Action" exportable={false}></Column>
                  </DataTable>

                ) : (
                  <DataTable ref={dt} value={allRtc} selection={selectedProducts}
                    dataKey="_id" paginator rows={20} rowsPerPageOptions={[5, 10, 25]}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} RTC List" header={header}
                    globalFilter={globalFilter} paginatorClassName='bg-red' className='' cellClassName={verificationTemplate}
                    showGridlines
                    stripedRows
                  >
                    <Column field="department" header="Department" sortable ></Column>
                    <Column field="barcode" header="Barcode" sortable body={barcodeBodyTemplate} ></Column>
                    <Column field="name" header="Name" sortable ></Column>
                    <Column field="count" header="Count" ></Column>
                    <Column field="expiry" header="Expiry" body={dateBodyTemplate} sortable ></Column>
                    <Column field="updatedQty" header="Qty" body={qtyTemplate}></Column>
                    {/* <Column field="qty" header="Qty" sortable></Column> */}
                    <Column field="approvedPrice" header="AppPrice" body={approvedPriceTemplate} sortable></Column>
                    <Column field="verification" header="Status" sortable body={verificationBodyTemplate} ></Column>
                    <Column body={actionBodyTemplate} header="Action" exportable={false}></Column>
                  </DataTable>
                )}
                <Popup isOpen={isOpen} onClose={closeModal} header={modalHeader} footer={onPriceUpdate} setOpen={setOpen}>
                  {profile.userType == "Admin" ? (
                    <OfficeForm rtc={rtc} setRtc={setRtc} />

                  ) : (
                    <SuperForm rtc={rtc} setRtc={setRtc} />
                  )}
                </Popup>
              </>
            )}
          </div>
          <Toaster />

        </Card>
      </section>
    </div>
  );
};

export default ListRtc;
