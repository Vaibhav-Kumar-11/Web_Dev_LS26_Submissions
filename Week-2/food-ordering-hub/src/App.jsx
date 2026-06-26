import { useState, useEffect } from "react";
import { menuItems } from "./data/menuItems";
import MenuGrid from "./components/MenuGrid";
import CartSidebar from "./components/CartSidebar";

function App() {
  // Lazy initializer: this function runs ONCE, only on the very first render,
  // to read any saved cart out of localStorage. If we wrote
  // useState(JSON.parse(localStorage.getItem("cart"))) directly (no function wrapper),
  // that read would re-run on every single re-render — wasteful and pointless.
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Side effect: writing to localStorage isn't something React tracks on its own,
  // so it goes in useEffect. This runs after every render where `cart` changed
  // (because [cart] is the dependency array), keeping storage in sync automatically.
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function handleAdd(item) {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        return prevCart.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prevCart, { ...item, qty: 1 }];
    });
  }

  function handleIncrement(id) {
    setCart((prevCart) =>
      prevCart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c))
    );
  }

  function handleDecrement(id) {
    setCart((prevCart) =>
      prevCart
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0)
    );
  }

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍴 Hostel Hub</h1>
        <input
          type="text"
          placeholder="Search food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </header>

      <div className="app-body">
        <MenuGrid items={filteredItems} onAdd={handleAdd} />
        <CartSidebar
          cart={cart}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </div>
    </div>
  );
}

export default App;