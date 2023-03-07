import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChangePassword from './modules/Auth/ChangePassword';
import CompleteSignup from './modules/Auth/CompleteSignup';
import PrivacyPolicy from './modules/PrivacyPolicy/index';
import Support from 'modules/Support';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/completeSignup" element={<CompleteSignup />} />
          <Route path="/changePassword" element={<ChangePassword />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
