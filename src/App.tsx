// import ResetPassword from './pages/reset-password';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Auth from './components/Auth';
// import ResetPasswordPage from './pages/reset-password';

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import { MobileNavigation } from "./components/MobileNavigation";
// import Index from "./pages/Index";
// import About from "./pages/About";
// import Programs from "./pages/Programs";
// import ProgramDetails from "./pages/ProgramDetails";
// import NotFound from "./pages/NotFound";
// import Auth from "./pages/Auth";
// import Tests from "./pages/Tests";
// import TestCreate from "./pages/TestCreate";
// import TestEdit from "./pages/TestEdit";
// import TestAttempt from "./pages/TestAttempt";
// import TestResults from "./pages/TestResults";
// import Admission from "./pages/Admission";
// import { useIsMobile } from "./hooks/use-mobile";

// const queryClient = new QueryClient();

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/auth"           element={<Auth />} />
//         <Route path="/reset-password" element={<ResetPasswordPage />} />
//         <Route path="*"                element={<Auth />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }


// const App = () => {
//   const isMobile = useIsMobile();
  
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Navbar />
//           <main className="min-h-screen safe-area-top">
//             <Routes>
//               <Route path="/" element={<Index />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/programs" element={<Programs />} />
//               <Route path="/programs/:id" element={<ProgramDetails />} />
//               <Route path="/auth" element={<Auth />} />
//               <Route path="/tests" element={<Tests />} />
//               <Route path="/tests/create" element={<TestCreate />} />
//               <Route path="/tests/:id/edit" element={<TestEdit />} />
//               <Route path="/tests/:id/attempt" element={<TestAttempt />} />
//               <Route path="/tests/:id/results" element={<TestResults />} />
//               <Route path="/admission" element={<Admission />} />
//               <Route path="/auth" element={<Auth />} />
//               <Route path="/reset-password" element={<ResetPassword />} />
      
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </main>
//           <MobileNavigation />
//           {!isMobile && <Footer />}
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;

// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import { useIsMobile } from './hooks/use-mobile';

import Index from './pages/Index';
import About from './pages/About';
import Programs from './pages/Programs';
import ProgramDetails from './pages/ProgramDetails';
import Tests from './pages/Tests';
import TestCreate from './pages/TestCreate';
import TestEdit from './pages/TestEdit';
import TestAttempt from './pages/TestAttempt';
import TestResults from './pages/TestResults';
import Admission from './pages/Admission';
import NotFound from './pages/NotFound';

import Auth from './components/Auth';
import ResetPasswordPage from './pages/reset-password';

const queryClient = new QueryClient();

export default function App() {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ShadcnToaster />
        <SonnerToaster />
        <BrowserRouter>
          <Navbar />

          <main className="min-h-screen safe-area-top">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/programs/:id" element={<ProgramDetails />} />

              {/* Auth routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Tests routes */}
              <Route path="/tests" element={<Tests />} />
              <Route path="/tests/create" element={<TestCreate />} />
              <Route path="/tests/:id/edit" element={<TestEdit />} />
              <Route path="/tests/:id/attempt" element={<TestAttempt />} />
              <Route path="/tests/:id/results" element={<TestResults />} />

              <Route path="/admission" element={<Admission />} />

              {/* Catch‑all: show 404 or redirect to home/auth */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <MobileNavigation />
          {!isMobile && <Footer />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

