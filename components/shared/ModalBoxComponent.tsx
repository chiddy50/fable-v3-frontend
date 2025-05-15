
"use client"

import { useEffect, useRef } from 'react';
import { X, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
    // setCurrentStep: React.Dispatch<React.SetStateAction<number>>;    
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width: string;
    showCloseButton?: boolean;
    closeOnOutsideClick?: boolean;
    className?: string;
    useDefaultHeader: boolean;
}


const ModalBoxComponent: React.FC<Props> = ({
    isOpen,
    onClose,
    title,
    children,
    width = 'w-[40%]',
    // width = 'md',
    showCloseButton = true,
    closeOnOutsideClick = true,
    className = '',
    useDefaultHeader = true,
}) => {

    const modalRef = useRef(null);

    // Mapping of width props to Tailwind classes
    const widthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        full: 'max-w-full'
    };

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleEscKey = (event: any) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            // Add event listener for ESC key
            window.addEventListener('keydown', handleEscKey);
            // Prevent scrolling on the body when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            // Cleanup: remove event listener and restore scrolling
            window.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    // Handle clicks outside the modal content
    const handleOutsideClick = (e) => {
        if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    // Don't render anything if the modal is not open
    if (!isOpen) return null;

    // Use createPortal to render the modal at the document root
    return createPortal(
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex z-30 items-center justify-center ${isOpen ? '' : 'hidden'
                }`}
            onClick={handleOutsideClick}
        >
            {/* Modal Container */}
            <div
                ref={modalRef}
                className={`bg-white relative rounded-xl shadow-lg ${width} ${className}`}
                // className={`bg-white rounded-lg shadow-lg ${widthClasses[width]} ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                { useDefaultHeader === true && 
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h2 className="text-lg font-bold">{title}</h2>
                        {showCloseButton && (
                            <button onClick={onClose}>
                                <X size={24} className='cursor-pointer' />
                            </button>
                        )}
                    </div>
                }
                {
                    useDefaultHeader === false && 

                    <button 
                        onClick={onClose}
                        className="h-7 w-7 cursor-pointer hover:text-gray-600 bg-white border border-[#F5F5F5] z-20 absolute -top-1 -right-2 rounded-full flex items-center justify-center">
                        {/* <i className='bx bx-x-circle cursor-pointer text-lg'></i> */}
                        <X size={14} 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent double firing
                            onClose();
                        }} 
                        className='cursor-pointer'
                        />
                    </button>
                }

                {/* Modal Content */}
                <div>{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default ModalBoxComponent;