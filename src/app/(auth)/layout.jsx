import React from "react";

const LoginLayout = function ({ children }) {
    return (
            <LoginLayoutContent>{children}</LoginLayoutContent>
    );
};

const LoginLayoutContent = function ({ children }) {

    return (
        <>
            <div className="h-screen flex items-center justify-center">
                {children}
            </div>
        </>
    );
};

export default LoginLayout;
