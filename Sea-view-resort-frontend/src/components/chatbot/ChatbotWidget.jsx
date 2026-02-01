import { useState } from "react";
import Chatbot from "./Chatbot";

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {open && (
                <div className="w-80 h-96 bg-white border rounded-2xl shadow-lg mb-3 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-2 bg-[#968260] text-white rounded-t-2xl">
                        <h2 className="text-sm font-semibold">Chat del Hotel</h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200"
                            aria-label="Cerrar chat"
                            title="Cerrar"
                        >
                            ✖
                        </button>
                    </div>
                    <Chatbot />
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-green-700"
                aria-label="Abrir chat"
                title="Chatear"
            >
                💬
            </button>
        </div>
    );
}


