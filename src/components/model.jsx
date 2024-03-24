import { Button, Modal } from 'flowbite-react';
import React from 'react';


const Popup = ({ isOpen, onClose, header, children, footer, setOpen }) => {
  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={() => setOpen(false)}>
      <Modal.Header>
        {header}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          {children}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={footer} className='text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 text-center dark:bg-red-900 dark:hover:bg-red-600 dark:focus:ring-red-900'>Submit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
