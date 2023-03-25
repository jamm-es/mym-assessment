import React, { useState } from 'react';
import ImageViewer from './ImageViewer';
import Account from "./Account";
import AuthedContext from "./AuthedContext";

function App() {
  const [authed, setAuthed] = useState(false);

  return <AuthedContext.Provider value={{ authed, setAuthed }}>
    <div className={`background overflow-y-hidden ${authed && 'authed'} position-fixed w-100 d-flex justify-content-center align-items-center flex-column p-3`}>
      <h2 className='p-2 mb-0 fw-bold text-white'>
        NASA Image Viewer
      </h2>
      <Account />
    </div>
    <ImageViewer />
  </AuthedContext.Provider>
}

export default App;
