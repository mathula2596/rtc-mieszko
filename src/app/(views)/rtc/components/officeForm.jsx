import { Label, Select, TextInput } from "flowbite-react";
import React, { useEffect } from "react";

const OfficeForm = ({ rtc, setRtc }) => {
  const findPrice = () => {
    if (rtc.approvedPrice != null) {
      setRtc({ ...rtc, price: rtc.approvedPrice });
    } else {
      setRtc({ ...rtc, price: rtc.price });
    }
  };
  useEffect(() => {
    findPrice();
  }, [rtc.approvedPrice]);
  return (
    <>
      <div className="grid gap-6 mb-6 mt-6 md:grid-cols-2">
        <div>
          <Label
            htmlFor="price"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Suggested Price
          </Label>
          <TextInput
            id="price"
            type="text"
            placeholder="Suggested Price"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={rtc.price}
            onChange={(e) => setRtc({ ...rtc, price: e.target.value })}
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

export default OfficeForm;
