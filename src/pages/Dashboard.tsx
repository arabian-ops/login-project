import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";

const products = [
  { name: "Aurora Lamp", desc: "Soft ambient lighting for calm vibes.", img: "https://m.media-amazon.com/images/I/71DsoDSaE4L.jpg", price: "$45", badge: "New" },
  { name: "Zen Chair", desc: "Ergonomic and comfy for long work sessions.", img: "https://dignity.co.ke/wp-content/uploads/2025/02/ZEN-ACCENT-CHAIR-3054-BROWN.jpg", price: "$120", badge: "Hot" },
  { name: "Notebook", desc: "Premium leather notebook for ideas.", img: "https://m.media-amazon.com/images/I/718vM+75UNL._AC_UF1000,1000_QL80_.jpg", price: "$25", badge: "Sale" },
  { name: "Headphones", desc: "Noise cancelling for focus and chill.", img: "https://www.cnet.com/a/img/resize/1d9b4699d31b82ea6342e9db0c6971a31a0ea703/hub/2023/10/17/7830396e-9be2-4a2e-800b-699a181a9faf/bose-quietcomfort-ultra-headpones-orange-background.jpg?auto=webp&fit=crop&height=1200&width=1200", price: "$75" },
  { name: "Coffee Mug", desc: "Keeps your drink warm all day.", img: "https://karacreates.com/wp-content/uploads/2016/09/Coffee-Mug-Herb-Garden-4.jpg", price: "$15" },
  { name: "Desk Plant", desc: "Green vibes for relaxation.", img: "https://plantsolutions.com/wp-content/uploads/2024/03/desk-plants-clayco-phoenix-az.webp", price: "$30", badge: "New" },
];

const Dashboard = () => {
  const [modalProduct, setModalProduct] = useState(null);

  const particlesInit = async (engine) => { await loadFull(engine); };

  const addToCart = (product) => { toast.success(`${product.name} added to cart!`); };
  const addToWishlist = (product) => { toast(`${product.name} added to wishlist!`, { icon: "💖" }); };

  return (
    <div className="min-h-screen relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('https://w0.peakpx.com/wallpaper/600/891/HD-wallpaper-midnight-calm-stars-dark-peaceful-beautiful-reflections-sky-night.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Toaster position="top-right" />
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: { number: { value: 60 }, size: { value: { min: 2, max: 4 } }, move: { enable: true, speed: 0.15 }, opacity: { value: 0.15 }, shape: { type: 'circle' }, color: { value: "#ffffff" } },
        }}
        className="absolute inset-0 z-0"
      />

      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-bold text-center my-10 z-10 relative">
        🌌 Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-10 relative z-10">
        {products.map((p, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255,255,255,0.2)" }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center text-center relative cursor-pointer transition"
            onClick={() => setModalProduct(p)}
          >
            {p.badge && (
              <span className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">{p.badge}</span>
            )}
            <div className="relative group w-32 h-32 mb-4">
              <img src={p.img} alt={p.name} className="w-32 h-32 object-cover rounded-xl" />
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                whileHover={{ opacity: 1, y: -10 }}
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs rounded px-2 py-1 pointer-events-none"
              >
                Click for more details
              </motion.div>
            </div>
            <h2 className="font-bold text-xl">{p.name}</h2>
            <p className="text-white/70 mb-2">{p.desc}</p>
            <div className="flex gap-1 mb-2 justify-center">
              {[...Array(5)].map((_, j) => <FaStar key={j} className="text-yellow-400" />)}
            </div>
            <p className="font-semibold mb-4">{p.price}</p>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl flex items-center gap-2 transition relative overflow-hidden">
                <FaShoppingCart /> Add
              </button>
              <button onClick={(e) => { e.stopPropagation(); addToWishlist(p); }} className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl flex items-center gap-2">💖 Wishlist</button>
            </div>
          </motion.div>
        ))}
      </div>

      {modalProduct && (
        <motion.div
          initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setModalProduct(null)}
        >
          <motion.div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl max-w-md text-center" onClick={(e) => e.stopPropagation()}>
            <img src={modalProduct.img} alt={modalProduct.name} className="w-48 h-48 object-cover rounded-xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-2">{modalProduct.name}</h2>
            <p className="text-white/70 mb-2">{modalProduct.desc}</p>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, j) => <FaStar key={j} className="text-yellow-400" />)}
            </div>
            <p className="font-semibold mb-4">{modalProduct.price}</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => addToCart(modalProduct)} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl">Add to Cart</button>
              <button onClick={() => addToWishlist(modalProduct)} className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-xl">Wishlist</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
