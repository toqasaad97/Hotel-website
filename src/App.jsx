import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './components/LandingPage';
import HotelList from './components/HotelList';
import HotelDetails from './components/HotelDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
