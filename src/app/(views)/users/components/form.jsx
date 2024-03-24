import { Label, Select, TextInput } from "flowbite-react";
import React, {useEffect } from "react";

const UserForm = ({ user, setUser }) => {
    
  const handleStoreChange = (e) => {
    const selectedStores = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setUser({ ...user, store: JSON.stringify(selectedStores) });
  };
  const handleStoreValue = () => {
    try {
      const storeArray = JSON.parse(user.store);
      setUser({ ...user, store: storeArray });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };
  useEffect(() => {
    handleStoreValue();
  }, [user.store]);

  return (
    <>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <Label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Full Name
          </Label>
          <TextInput
            id="name"
            type="text"
            placeholder="Full Name"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
        <div>
          <Label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Username
          </Label>
          <TextInput
            id="username"
            type="text"
            placeholder="Username"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </div>
        <div>
          <Label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </Label>
          <TextInput
            id="email"
            type="email"
            placeholder="Email"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        {}
        {user.password == null ? (
          ""
        ) : (
          <div>
            <Label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </Label>
            <TextInput
              id="password"
              type="password"
              placeholder="Password"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
        )}

        <div>
          <Label
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Role
          </Label>
          <Select
            id="type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={user.type || ""}
            onChange={(e) => setUser({ ...user, type: e.target.value })}
            required
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="Admin">Admin</option>
            <option value="Store">Store</option>
            <option value="Super">Super Admin</option>
          </Select>
        </div>
        <div>
          <Label
            htmlFor="store"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Store
          </Label>
          {/* {handleStoreValue()} */}
          <Select
            id="store"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
            value={user.store}
            onChange={handleStoreChange}
            required
            multiple
          >
            <option value="" disabled>
              Select a store
            </option>
            <option value="Perivale">Perivale</option>
            <option value="Hounslow">Hounslow</option>
            <option value="Sadbury">Sadbury</option>
            <option value="Budgens">Budgens</option>
            <option value="Hays">Hays</option>
            <option value="Stretham">Stretham</option>
            <option value="Gravesend">Gravesend</option>
            <option value="Swindon">Swindon</option>
            <option value="Watford">Watford</option>
            <option value="Eastham">Eastham</option>
            <option value="All">All</option>
          </Select>
        </div>
        {user.isActive == false || user.isActive ? (
          <div>
            <Label
              htmlFor="isActive"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Status
            </Label>
            <Select
              id="isActive"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
              value={user.isActive || ""}
              onChange={(e) => setUser({ ...user, isActive: e.target.value })}
              required
            >
              <option value="" disabled>
                Select the status
              </option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default UserForm;
