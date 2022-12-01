import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChangePassword from './modules/Auth/ChangePassword';
import CompleteSignup from './modules/Auth/CompleteSignup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/completeSignup" element={<CompleteSignup />} />
          <Route path="/changePassword" element={<ChangePassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
