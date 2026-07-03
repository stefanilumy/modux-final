import { RouterProvider } from 'react-router';
import { router } from './routes';
import { HistoryProvider } from './context/HistoryContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <HistoryProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </HistoryProvider>
    );
}