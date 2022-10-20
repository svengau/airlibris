import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface ModalProps {
  children: any;
  className?: string;
  bgClassName?: string;
  title?: string;
  open: boolean;
  onClose: (value: boolean) => void;
  render?: (data: any) => any;
  showHeader?: boolean;
}

function Modal({
  title,
  children,
  className = "max-w-2xl",
  bgClassName = "bg-white shadow-lg",
  onClose,
  open,
  showHeader = true,
}: ModalProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="flex fixed inset-0 flex-col justify-center z-10"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div>
            <Dialog.Description
              as="div"
              data-cy="modal"
              className={`overflow-y-auto relative mx-auto max-h-full border border-black shadow-xl ${bgClassName} z-9 ${className}`}
            >
              <div className="flex flex-col">
                {showHeader && (
                  <div
                    className={`flex justify-between items-center px-4 py-2 ${
                      title ? "border-b" : ""
                    }`}
                  >
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                      className="text-black"
                      onClick={onClose}
                      aria-label="Close"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}
                <div className="flex flex-col items-center mx-2 h-full">
                  {children}
                </div>
                <button />
              </div>
            </Dialog.Description>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

export default Modal;
