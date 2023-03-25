import React from "react";

const AuthedContext = React.createContext({ authed: false, setAuthed: (_: boolean) => {} });

export default AuthedContext;