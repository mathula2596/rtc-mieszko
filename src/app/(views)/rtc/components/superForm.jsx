import { Label, Select, TextInput } from "flowbite-react";
import React, { useEffect } from "react";

const SuperForm = ({ rtc, setRtc }) => {
  const findPrice = () => {
    if (rtc.verification == "Pending Approval") {
      setRtc({ ...rtc, approvedPrice: rtc.price, isPriceChanged: true });
    } else {
      setRtc({
        ...rtc,
        approvedPrice: rtc.approvedPrice,
        isPriceChanged: false,
      });
    }
  };
  useEffect(() => {
    findPrice();
  }, []);
  return (
    <>
      <div className="grid gap-6 mb-6 mt-6 md:grid-cols-2">
        <div>
          <Label
            htmlFor="approvedPrice"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Approved Price
          </Label>
          <TextInput
            id="approvedPrice"
            type="text"
            placeholder="Approved Price"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={rtc.approvedPrice}
            onChange={(e) => setRtc({ ...rtc, approvedPrice: e.target.value })}
          />
        </div>
        <div>
          <Label
            htmlFor="verification"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Verification
          </Label>

          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            onChange={(e) => setRtc({ ...rtc, verification: e.target.value })}
            value={rtc.verification || ""}
            required
          >
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Select>
        </div>
      </div>
    </>
  );
};

export default SuperForm;
