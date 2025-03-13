"use client";

import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { FaBrain } from "react-icons/fa"; // Ganti ikon ke FaBrain
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(5); // Jumlah pesan per halaman

  // Ambil data pesan dari Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  // Hitung pesan yang akan ditampilkan di halaman saat ini
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        message: message,
        timestamp: serverTimestamp(),
      });
      setSubmitted(true);
      setMessage(""); // Reset input setelah submit
      setTimeout(() => setSubmitted(false), 3000); // Hilangkan alert setelah 3 detik
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  // Animasi untuk halaman
  const pageVariants = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };

  // Animasi untuk alert
  const alertVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex justify-center bg-gradient-to-br from-gray-900 to-black sm:p-0 md:p-12"
    >
      {/* Alert */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 bg-gray-800/50 backdrop-blur-md p-4 rounded-lg border border-gray-700/50 shadow-2xl shadow-cyan-500/10"
          >
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Thank you for your message!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konten Utama */}
      <div className="max-w-xl w-full p-6">
        {/* Judul dengan Ikon Pesan (Sticky) */}
        <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-black/90 backdrop-blur-md py-6 mb-6 border-b-2 border-gray-700/50">
          <h1 className="text-[25px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
            <FaBrain className="mr-3 text-purple-500" />
            give advice
          </h1>
        </div>

        {/* Formulir Pengiriman Pesan */}
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full h-40 p-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg shadow-cyan-500/20"
          >
            Send
          </button>
        </form>

        {/* Tampilkan Pesan Terkirim */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
            Messages
          </h2>
          <div className="space-y-4">
            {currentMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-700/50 p-4 rounded-lg border border-gray-600/50"
              >
                <p className="text-white">{msg.message}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(msg.timestamp?.toDate()).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({
              length: Math.ceil(messages.length / messagesPerPage),
            }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-700/50 text-gray-400 hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
