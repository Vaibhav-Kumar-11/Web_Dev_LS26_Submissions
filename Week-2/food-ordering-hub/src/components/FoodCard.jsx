function FoodCard({ item, onAdd }) {
    return (
        <div className="food-card">
            <div className="food-emoji">{item.emoji}</div>
            <h3 className="food-name">{item.name}</h3>
            <p className="food-price">₹{item.price}</p>
            <button className="add-btn" onClick={() => onAdd(item)}>
                Add to Cart
            </button>
        </div>
    );
}

export default FoodCard;