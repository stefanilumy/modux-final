import { RouterProvider } from 'react-router';
import { router } from './routes';
import { HistoryProvider } from './context/HistoryContext';

export default function App() {
  return (
    <HistoryProvider>
      <RouterProvider router={router} />
    </HistoryProvider>
    );
}