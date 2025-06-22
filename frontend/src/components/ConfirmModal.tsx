import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClose={onCancel}
      >
        <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
          <Dialog.Title className="text-lg font-medium text-gray-900">
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
