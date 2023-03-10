import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTrashAlt } from 'react-icons/fa';

interface Props {
  onClose?: () => void;
  opened: boolean;
  className?: string;
  children: ReactNode;
}

const Modal = ({ onClose, opened, className, children }: Props) => {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!ref.current) {
      ref.current = document.querySelector<HTMLElement>('div#modal');
    }

    if (opened) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [opened]);
  return opened && ref.current
    ? createPortal(
        <div
          className={`fixed left-0 top-0 z-[1500] flex h-screen w-full items-center justify-center overflow-auto bg-black bg-opacity-50 ${className}`}
        >
          {onClose && (
            <div className="w-full items-center justify-end">
              <button onClick={onClose}>
                <FaTrashAlt />
              </button>
            </div>
          )}
          <div className="max-h-[70vh] overflow-y-auto">{children}</div>
        </div>,
        ref.current
      )
    : null;
};

export default Modal;
