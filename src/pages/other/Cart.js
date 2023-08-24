import { Fragment, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  deleteAllFromCart,
} from "../../store/slices/cart-slice";
import { cartItemStock } from "../../helpers/product";
import CartAPI from "../../api/CartAPI";

const Cart = () => {
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  function handleCartItemSelection(cartItem) {
    if (cartItem.product.storeId !== selectedStoreId) {
      // Select a new store and reset the selected items
      setSelectedStoreId(cartItem.product.storeId);
      setSelectedItems([cartItem]);
    } else {
      // Toggle the selected item
      setSelectedItems((prevSelectedItems) => {
        const isItemSelected = prevSelectedItems.some(
          (selectedItem) => selectedItem.Id === cartItem.Id
        );
        return isItemSelected
          ? prevSelectedItems.filter(
              (selectedItem) => selectedItem.Id !== cartItem.Id
            )
          : [...prevSelectedItems, cartItem];
      });
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const handleSelectItem = (itemId) => {
    const index = selectedItems.indexOf(itemId);
    if (index === -1) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems([
        ...selectedItems.slice(0, index),
        ...selectedItems.slice(index + 1),
      ]);
    }
  };

  const dispatch = useDispatch();
  const getCart = async () => {
    try {
      const params = { skip: 0, limit: 10 };
      const response = await CartAPI.getCartItems(params);
      console.log(response.data.data);
      if (response.data.data) {
        dispatch(deleteAllFromCart());
        setIsLoading(false);
        response.data.data.forEach((Item) => {
          if (Item.cartItems.length > 0) {
            const isStoreInCart = storeList.find(
              (item) => item.store.Id === Item.store.Id
            );
            if(!isStoreInCart) setStoreList((prevStoreList) => [...prevStoreList, Item.store]);
            Item.cartItems.forEach((cartItem) => {
              const isProductInCart = cartItems.find(
                (item) => item.Id === cartItem.Id
              );
              if (!isProductInCart) {
                setCartItems((prevCartItems) => [...prevCartItems, cartItem]);
                dispatch(
                  addToCart({
                    ...cartItem.product,
                    Id: cartItem.Id,
                    quantity: cartItem.quantity,
                    cartItem: cartItem,
                  })
                );
              }
            });
          }
        });
      }
    } catch {}
    setIsLoading(false);
  };

  const deleteProductInCart = async (cartItem) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.Id !== cartItem.Id
    );
    dispatch(deleteAllFromCart());
    updatedCartItems.map((cartItem) => {
      dispatch(
        addToCart({
          ...cartItem.product,
          Id: cartItem.Id,
          quantity: cartItem.quantity,
        })
      );
    });
    console.log(updatedCartItems);
    setCartItems(updatedCartItems);
    const response = await CartAPI.deleteProductInCart(cartItem.Id);
    console.log(response);
  };

  const deleteAllProductInCart = async () => {
    dispatch(deleteAllFromCart());
    setCartItems([]);
    const response = await CartAPI.deleteAllProductInCart();
  };

  useEffect(() => {
    getCart();
  }, []);

  const totalPrice = useMemo(() => {
    let totalPrice = 0;
    cartItems.forEach((cartItem) => {
      totalPrice += cartItem.product.price * cartItem.quantity;
    });
    return totalPrice;
  }, [cartItems]);

  useEffect(() => {
    // tính tổng giá trị của các sản phẩm đã chọn
    const selectedItemsTotalPrice = selectedItems.reduce(
      (total, selectedItem) => total + (selectedItem.product.price * selectedItem.quantity ),
      0
    );

    // cập nhật giá trị tổng của giỏ hàng
    setCartTotalPrice(selectedItemsTotalPrice);
  }, [selectedItems]);

  const [quantityCount] = useState(1);
  let { pathname } = useLocation();

  const currency = useSelector((state) => state.currency);

  const handleClickCheckout = () => {
    const newSelectedItems = selectedItems.map(item => {
      return {
        ...item,
        id: item.Id,
        Id: undefined,
      }
    })
    
    localStorage.setItem("selectedItems", JSON.stringify(newSelectedItems));
  };

  if (isLoading) {
    return (
      <div className="flone-preloader-wrapper">
        <div className="flone-preloader">
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Cart page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Cart", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems?.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="name-shop">
                      {storeList.map((store, key) => {
                        return (
                          <div key={key}>
                            <h3 style={{ color: "green" }}>{store?.name}</h3>
                            <div className="table-content table-responsive cart-table-content">
                              <table>
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Hình</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Thuộc tính</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                    <th>Xoá</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cartItems.map((cartItem, key) => {
                                    if (
                                      cartItem.product.storeId !== store?.Id
                                    ) {
                                      return null; // skip rendering this cart item
                                    }
                                    const isItemSelected = selectedItems.some(
                                      (selectedItem) =>
                                        selectedItem.Id === cartItem.Id
                                    );

                                    return (
                                      <tr key={key}>
                                        <td>
                                          <input
                                            style={{ width: "15px" }}
                                            type="checkbox"
                                            checked={isItemSelected}
                                            onChange={() =>
                                              handleCartItemSelection(cartItem)
                                            }
                                          />
                                        </td>
                                        <td className="product-thumbnail">
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/product/" +
                                              cartItem.Id
                                            }
                                          >
                                            <img
                                              className="img-fluid"
                                              src={
                                                process.env.PUBLIC_URL +
                                                cartItem.product.images[0]
                                                  .location
                                              }
                                              alt=""
                                            />
                                          </Link>
                                        </td>

                                        <td className="product-name">
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/product/" +
                                              cartItem.product.Id
                                            }
                                          >
                                            {cartItem.product.name}
                                          </Link>
                                          {cartItem.selectedProductColor &&
                                          cartItem.selectedProductSize ? (
                                            <div className="cart-item-variation">
                                              <span>
                                                Color:{" "}
                                                {cartItem.selectedProductColor}
                                              </span>
                                              <span>
                                                Size:{" "}
                                                {cartItem.selectedProductSize}
                                              </span>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>

                                        <td className="product-attributes">
                                          {cartItem.attributeValues.length >
                                            0 &&
                                            cartItem.attributeValues[0].name}
                                        </td>

                                        <td className="product-price-cart">
                                          <span className="amount">
                                            {cartItem.product.price}
                                          </span>
                                        </td>

                                        <td className="product-quantity">
                                          <div className="cart-plus-minus">
                                            {/* <button
                                              className="dec qtybutton"
                                              onClick={() =>
                                                console.log("giảm")
                                              }
                                            >
                                              -
                                            </button> */}
                                            <input
                                              className="cart-plus-minus-box"
                                              type="text"
                                              value={cartItem.quantity}
                                              readOnly
                                            />
                                            {/* <button
                                              className="inc qtybutton"
                                              onClick={() =>
                                                console.log("tăng")
                                              }
                                              disabled={cartItem === undefined}
                                            >
                                              +
                                            </button> */}
                                          </div>
                                        </td>
                                        <td className="product-subtotal">
                                          {(
                                            cartItem.product.price *
                                            cartItem.quantity
                                          ).toFixed(2) + " VNĐ"}
                                        </td>

                                        <td className="product-remove">
                                          <button
                                            onClick={() => {
                                              // dispatch(
                                              //   deleteFromCart(cartItem.cartItemId)
                                              // )
                                              deleteProductInCart(cartItem);
                                            }}
                                          >
                                            <i className="fa fa-times"></i>
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-standard"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteAllProductInCart()}>
                          Clear Shopping Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    {/* <div className="cart-tax">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Estimate Shipping And Tax
                        </h4>
                      </div>
                      <div className="tax-wrapper">
                        <p>
                          Enter your destination to get a shipping estimate.
                        </p>
                        <div className="tax-select-wrapper">
                          <div className="tax-select">
                            <label>* Country</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Region / State</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Zip/Postal Code</label>
                            <input type="text" />
                          </div>
                          <button className="cart-btn-2" type="submit">
                            Get A Quote
                          </button>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div className="col-lg-4 col-md-6">
                    {/* <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div> */}
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h4 className="grand-totall-title">
                        Tổng đơn hàng{" "}
                        <span>{cartTotalPrice.toFixed(2) + " VNĐ"}</span>
                      </h4>
                      {selectedItems.length <= 0 ? (
                        <span>Chuyển đến trang thanh toán</span>
                      ) : (
                        <Link
                          to={{ pathname: "/checkout", search: "?option=0" }}
                          onClick={handleClickCheckout}
                        >
                          Chuyển đến trang thanh toán
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
