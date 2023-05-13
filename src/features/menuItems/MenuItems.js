import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMenuItems } from "./menuItemsSlice";

const MenuItems = () => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state) => state.menuItems);

  useEffect(() => {
    dispatch(getMenuItems());
  }, [dispatch]);

  console.log (menuItems.menuItems)

  if (menuItems.status === "loading") {
    return (
      <div>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  if (menuItems.status === "failed") {
    return (
      <div>
        <p className="error-msg">
          Error while loading categories. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="menu-section">
      <h2>Menu Items</h2>
      <div className="menu-content">
        {menuItems.menuItems.map((menuItem) => {
          const { _id, image, cat_title } = menuItem;
          return (
            <div className="menu" key={_id}>
              <img
                src={image.url}
                alt={cat_title}
                width={image.width}
                height={image.height}
                className="img-responsive reveal-inline-block"
              />
              <Link
                to={`/products?search=${cat_title.toLowerCase()}`}
                className="menu-link"
              >
                {cat_title.charAt(0) + cat_title.substring(1)}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuItems;
