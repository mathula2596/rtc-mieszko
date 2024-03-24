import React from 'react'
import toast from 'react-hot-toast';

const Notify = ({ message, success } ) => {
  if (success) {
    return (
      toast.success(
        <div className="flex items-center">
          <div>{message}</div>
        </div>
      )
    )
  }
  else {
    return (
      toast.error(
        <div className="flex items-center">
          <div>{message}</div>
        </div>
      )
    )
  }

}

export default Notify