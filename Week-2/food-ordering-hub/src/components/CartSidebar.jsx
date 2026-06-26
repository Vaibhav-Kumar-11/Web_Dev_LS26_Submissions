function CartSidebar({ cart, onIncrement, onDecrement }) {
    const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
    const totalPrice = cart.reduce((sum, c) => sum + c.qty * c.price, 0);

    return (
        <aside className="cart-sidebar">
            <h2>
                Your Cart <span className="cart-count">{totalItems}</span>
            </h2>

            {cart.length === 0 ? (
                <p className="empty-msg">Cart is empty.</p>
            ) : (
                <ul className="cart-list">
                    {cart.map((item) => (
                        <li key={item.id} className="cart-item">
                            <span>
                                {item.emoji} {item.name} x{item.qty}
                            </span>
                            <div className="cart-item-controls">
                                <button onClick={() => onDecrement(item.id)}>-</button>
                                <button onClick={() => onIncrement(item.id)}>+</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="cart-total">
                <strong>Total: ₹{totalPrice}</strong>
            </div>
        </aside>
    );
}

export default CartSidebar;