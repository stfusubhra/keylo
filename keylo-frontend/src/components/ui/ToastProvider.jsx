/**
 * ToastProvider – wraps the app with react-hot-toast.
 * Add once at the top level (e.g. in App.jsx) to enable toasts everywhere.
 */
import { Toaster } from 'react-hot-toast';

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1A1A2E',
            color: '#F0F0F0',
            border: '2px solid #000000',
            boxShadow: '8px 8px 0px 0px #000000',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'var(--font-body-md)',
            fontSize: 'var(--text-body-md)',
          },
          success: {
            iconTheme: {
              primary: '#C7F000',
              secondary: '#000000',
            },
            style: {
              borderColor: '#000000',
              background: '#1A1A2E',
              color: '#F0F0F0',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF4D6A',
              secondary: '#000000',
            },
            style: {
              borderColor: '#000000',
              background: '#1A1A2E',
              color: '#F0F0F0',
            },
          },
        }}
      />
    </>
  );
}