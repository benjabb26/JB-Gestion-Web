import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './Landing';
import Cursos from './CursoPage';
import FormInscripcionPage from './domains/Forms/form_inscripcion/FormInscripcionPage';
import CheckoutPage from './domains/Checkout/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" closeButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/JBImpulsa" element={<Cursos />} />
        <Route path="/inscripcion" element={<FormInscripcionPage />} />
        <Route path="/JBImpulsa/inscripcion" element={<FormInscripcionPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
