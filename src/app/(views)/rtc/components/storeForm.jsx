import { Label, Select, TextInput } from "flowbite-react";
import React from "react";

const StoreForm = ({ rtc, setRtc }) => {
  return (
    <>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <Label
            htmlFor="barcode"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Barcode
          </Label>
          <TextInput
            id="barcode"
            type="text"
            placeholder="Barcode"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={rtc.barcode}
            onChange={(e) => setRtc({ ...rtc, barcode: e.target.value })}
          />
        </div>
        <div>
          <Label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Product Name
          </Label>
          <TextInput
            id="name"
            type="text"
            placeholder="Product Name"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={rtc.name}
            onChange={(e) => setRtc({ ...rtc, name: e.target.value })}
          />
        </div>
        {rtc._id !== "" ? (
          <div>
            <Label
              htmlFor="qty"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Updated Quantity
            </Label>
            <TextInput
              id="qty"
              type="text"
              placeholder="Quantity"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              value={rtc.updatedQty}
              onChange={(e) => setRtc({ ...rtc, updatedQty: e.target.value })}
            />
          </div>
        ) : (
          <div>
            <Label
              htmlFor="qty"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Quantity
            </Label>
            <TextInput
              id="qty"
              type="text"
              placeholder="Quantity"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              value={rtc.qty}
              onChange={(e) => setRtc({ ...rtc, qty: e.target.value })}
            />
          </div>
        )}

        <div>
          <Label
            htmlFor="expiry"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Expiry Date
          </Label>
          <TextInput
            id="expiry"
            type="date"
            placeholder="Expiry Date"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={rtc.expiry}
            onChange={(e) => setRtc({ ...rtc, expiry: e.target.value })}
          />
        </div>
        <div>
          <Label
            htmlFor="department"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Department
          </Label>

          <Select
            id="department"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            onChange={(e) => setRtc({ ...rtc, department: e.target.value })}
            value={rtc.department || ""}
            required
          >
            <option value="" disabled>
              Select a department
            </option>
            <option value="Deli">Deli</option>
            <option value="Dairy">Dairy</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruits">Fruits</option>
            <option value="Grocery">Grocery</option>
            <option value="Drinks">Drinks</option>
          </Select>
        </div>
      </div>
    </>
  );
};

export default StoreForm;
