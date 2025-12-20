import { Toaster as Sonner } from 'sonner';

const Toaster = () => {
    return (
        <Sonner
            position="top-center"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:dark:border-gray-800 group-[.toaster]:shadow-xl',
                    description: 'group-[.toast]:text-gray-500 group-[.toast]:dark:text-gray-400',
                    actionButton: 'group-[.toast]:bg-blue-600 group-[.toast]:text-white',
                    cancelButton: 'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500',
                },
            }}
        />
    );
};

export default Toaster;
