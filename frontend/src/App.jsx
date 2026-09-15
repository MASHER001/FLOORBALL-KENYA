import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
    return (
        <BrowserRouter>
            <div className="app">

                <Navbar />

                <main className="app-main">
                    <AppRoutes />
                </main>

                <Footer />

            </div>
        </BrowserRouter>
    );
}

export default App;