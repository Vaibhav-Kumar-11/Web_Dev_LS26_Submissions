import FoodCard from "./FoodCard";

function MenuGrid({ items, onAdd }) {
    if (items.length === 0) {
        return <p className="empty-msg">No items match your search.</p>;
    }

    return (
        <div className="menu-grid">
            {items.map((item) => (
                <FoodCard key={item.id} item={item} onAdd={onAdd} />
            ))}
        </div>
    );
}

export default MenuGrid;