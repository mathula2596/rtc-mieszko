"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { Slider } from "primereact/slider";
import { Card } from "flowbite-react";
import { InputText } from "primereact/inputtext";

const UserPage = () => {
  const router = useRouter();

  const [users, setUsers] = useState(null);

  const [role, setRole] = useState("");
  const [globalFilter, setGlobalFilter] = useState();
  const dt = useRef(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/users/users");
      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    userRole();
  }, []);

  const userRole = async () => {
    try {
      const response = await axios.get("/api/users/login");
      setRole(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const openNew = () => {
    router.push("/users/create");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {role !== "Admin" && role !== "Super" ? (
          <Link
            href="#"
            key={rowData._id}
            className="font-medium text-red-800 hover:underline dark:text-red-900"
            id={rowData._id}
          >
            <Button icon="pi pi-pencil" />
          </Link>
        ) : (
          <Link
            href={`/users/${rowData._id}`}
            className="font-medium text-red-800 hover:underline dark:text-red-900"
            id={rowData._id}
          >
            <Button icon="pi pi-pencil" />
          </Link>
        )}
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:align-items-center justify-between">
      <span className="p-input-icon-left w-full md:w-auto">
        <i className="pi pi-search " />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="w-full lg:w-auto pl-10"
        />
      </span>
      <div className="mt-3 md:mt-0 flex justify-content-end">
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-2 bg-red-900 text-white"
          onClick={openNew}
          tooltip="New"
          tooltipOptions={{ position: "bottom" }}
        />
      </div>
    </div>
  );
  const template3 = {
    layout:
      "RowsPerPageDropdown PrevPageLink PageLinks NextPageLink CurrentPageReport",
    RowsPerPageDropdown: (options) => {
      return (
        <div className="flex align-items-center">
          <Tooltip
            target=".slider>.p-slider-handle"
            content={`${options.value} / page`}
            position="top"
            event="focus"
          />

          <span
            className="mr-3"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Slider
            className="slider"
            value={options.value}
            onChange={options.onChange}
            min={10}
            max={120}
            step={30}
            style={{ width: "10rem" }}
          />
        </div>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };
  const storeTemplate = (rowData) => {
    const parsedStore = JSON.parse(rowData.store);
    const formattedStore = parsedStore.join(", ");
    return formattedStore;
  };

  return (
    <div className="p-6">
      <section>
        <Card>
          <header>
            <h2 className="mb-3 mt-5 text-4xl font-bold dark:text-gray-200">
              All Users
            </h2>
          </header>
          <div className={`max-w-full overflow-x-scroll`}>
            {users === null ? (
              <p>Loading...</p>
            ) : (
              <>
                <DataTable
                  ref={dt}
                  value={users}
                  dataKey="_id"
                  paginator
                  rows={20}
                  rowsPerPageOptions={[5, 10, 25]}
                  paginatorTemplate={`FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown`}
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} User List"
                  header={header}
                  globalFilter={globalFilter}
                  responsiveLayout="scroll"
                  paginatorClassName="bg-blue"
                  className=""
                  showGridlines
                  stripedRows
                >
                  <Column field="email" header="Email" sortable></Column>
                  <Column field="name" header="Full Name" sortable></Column>
                  <Column field="username" header="Username" sortable></Column>
                  <Column field="type" header="Type" sortable></Column>
                  <Column
                    field="store"
                    header="Store"
                    sortable
                    body={storeTemplate}
                  ></Column>
                  <Column field="isActive" header="Active" sortable></Column>

                  <Column
                    body={actionBodyTemplate}
                    header="Action"
                    exportable={false}
                  ></Column>
                </DataTable>
              </>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default UserPage;
