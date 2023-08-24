import { Fragment, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDiscountPrice } from '../../helpers/product';
import SEO from '../../components/seo';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import UserAddressAPI from '../../api/UserAddressAPI';
import { deleteFromCart } from '../../store/slices/cart-slice';
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  getDistrictCodeFromName,
  getProvinceCodeFromName,
  getWardCodeFromName,
  getDistrictNameFromCode,
  getProvinceNameFromCode,
  getWardNameFromCode,
} from '../../helpers/other';
import DeliveryAPI from '../../api/DeliveryAPI';
import OrderAPI from '../../api/OrderAPI';

const Checkout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const option = queryParams.get('option');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [selectedShippingCarrier, setSelectedShippingCarrier] = useState();
  const [shippingCarriers, setShippingCarriers] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    console.log('option', option);
    // Fetch provinces data and set it to provinces state
    // This should be replaced with your actual API call
    fetchProvinces().then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      console.log('lấy distric');
      // Fetch districts based on the selected province
      // Replace with your actual API call
      fetchDistricts(selectedProvince).then((data) => {
        setDistricts(data.slice(1));
        console.log(data);
      });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      // Fetch wards based on the selected district
      // Replace with your actual API call
      fetchWards(selectedDistrict).then((data) => setWards(data));
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
    setSelectedWard('');
    setSelectedAddress({
      ...selectedAddress,
      city: e.target.selectedOptions[0].innerText,
    });
  };

  function handlePaymentMethodChange(event) {
    setSelectedPaymentMethod(event.target.value);
  }

  function handleShippingCarrierChange(event) {
    console.log(event.target.value);
    setSelectedShippingCarrier(event.target.value);
  }

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard('');
    setSelectedAddress({
      ...selectedAddress,
      district: e.target.selectedOptions[0].innerText,
    });
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
    setSelectedAddress({
      ...selectedAddress,
      ward: e.target.selectedOptions[0].innerText,
    });
  };

  useEffect(() => {
    const getUserAddressList = async () => {
      try {
        const response = await UserAddressAPI.getMyUserAddressList();
        console.log(response.data);
        setAddressUser(response.data);
        const response2 = await DeliveryAPI.getDeliverys();
        console.log(response2.data);
        setShippingCarriers(response2.data);
        setIsLoading(false);
      } catch (error) {
        console.log('faild', error);
        setIsLoading(false);
      }
    };
    getUserAddressList();
  }, []);

  const handleChangeState = (key, value) => {
    setSelectedAddress({ ...selectedAddress, [key]: value });
  };

  const addOrder = async () => {
    try {
      const isCOD = selectedPaymentMethod === 'cod' ? true : false;
      var params = {
        orders: cartItems,
        storeId: cartItems[0].product.storeId,
        cod: isCOD,
        option: option,
        deliveryId: selectedShippingCarrier,
        phone: selectedAddress.numberPhone,
        address:
          selectedAddress.detailAddress +
          '|' +
          selectedAddress.ward +
          '|' +
          selectedAddress.district +
          '|' +
          selectedAddress.city,
      };
      if (option === '1') {
        params = {
          orders: [{ id: null, productId: cartItems[0].product.Id, quantity: cartItems[0].quantity }],
          storeId: cartItems[0].product.storeId,
          cod: isCOD,
          option: option,
          deliveryId: selectedShippingCarrier,
          phone: selectedAddress.numberPhone,
          address:
            selectedAddress.detailAddress +
            '|' +
            selectedAddress.ward +
            '|' +
            selectedAddress.district +
            '|' +
            selectedAddress.city,
        };
      }
      const response = await OrderAPI.addOrder(params);
      console.log(cartItems);
      cartItems.map((it) => dispatch(deleteFromCart(it.cartId)));
      window.location.href = '/cart';
    } catch (error) {
      console.log('faild', error);
    }
  };

  const [addressUser, setAddressUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState(null);

  let cartTotalPrice = 0;

  let { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (option === '1') {
      const cartItemsFromStorage = localStorage.getItem('productBN');
      if (cartItemsFromStorage) {
        setCartItems(JSON.parse(cartItemsFromStorage));
      }
    } else {
      const cartItemsFromStorage = localStorage.getItem('selectedItems');
      if (cartItemsFromStorage) {
        setCartItems(JSON.parse(cartItemsFromStorage));
      }
    }
  }, []);

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
        titleTemplate="Checkout"
        description="Checkout page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: 'Home', path: process.env.PUBLIC_URL + '/' },
            { label: 'Checkout', path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-7">
                  <div className="billing-info-wrap">
                    <h3>Địa chỉ chi tiết</h3>
                    <select
                      style={{ backgroundColor: '#f5f5f5' }}
                      value={addressUser?.Id}
                      onChange={(event) => {
                        const selectedId = event.target.value;
                        const selectedAddress = addressUser.find((address) => address.Id === selectedId);
                        setSelectedAddress(selectedAddress);

                        // setDistricts(selectedAddress.district);
                        // selectedWard(selectedAddress.ward);
                      }}
                    >
                      <option value="">Lựa chọn địa chỉ</option>
                      {addressUser.map((address) => (
                        <option key={address.Id} value={address.Id}>
                          {address.nameRecipient + ' - ' + address.detailAddress + ' - ' + address.city}
                        </option>
                      ))}
                    </select>
                    <div className="row">
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Tên Người nhận</label>
                          <input
                            type="text"
                            value={selectedAddress?.nameRecipient}
                            onChange={(e) => handleChangeState('nameRecipient', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-select mb-20 row">
                          <div className="col-sm-4">
                            <label>
                              <span>Tỉnh: {selectedAddress?.city}</span>
                              <select
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                                name=""
                                style={{ width: '100%' }}
                              >
                                <option value="">Chọn Tỉnh</option>
                                {provinces.map((province) => (
                                  <option key={province.id} value={province.code}>
                                    {province.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="col-sm-4">
                            <label>
                              Huyện: {selectedAddress?.district}
                              <select
                                value={selectedDistrict}
                                onChange={handleDistrictChange}
                                name="district"
                                style={{ width: '100%' }}
                              >
                                <option value="">Chọn Huyện</option>
                                {districts.map((district) => (
                                  <option key={district.id} value={district.code} name={district.name}>
                                    {district.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="col-sm-4">
                            <label>
                              Phường: {selectedAddress?.ward}
                              <select
                                value={selectedWard}
                                onChange={handleWardChange}
                                style={{ width: '100%' }}
                              >
                                <option value="">Chọn phường</option>
                                {wards.map((ward) => (
                                  <option key={ward.id} value={ward.code}>
                                    {ward.name}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="row">
                            <div className="col-sm-6 mb-20">
                              <label>
                                Phương thức thanh toán:
                                <select
                                  value={selectedPaymentMethod}
                                  onChange={handlePaymentMethodChange}
                                  style={{ width: '100%' }}
                                >
                                  <option value="cod">Thanh toán khi nhận hàng</option>
                                  <option value="card">Thanh toán bằng thẻ tín dụng</option>
                                </select>
                              </label>
                            </div>
                            <div className="col-sm-6 mb-20">
                              <label>
                                Đơn vị vận chuyển:
                                <select
                                  value={selectedShippingCarrier}
                                  onChange={handleShippingCarrierChange}
                                  style={{ width: '100%' }}
                                >
                                  <option value="">Chọn đơn vị vận chuyển</option>
                                  {shippingCarriers.map((carrier) => (
                                    <option key={carrier.Id} value={carrier.Id}>
                                      {carrier.name}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="billing-info mb-20">
                          <label>Địa chỉ</label>
                          <input
                            className="billing-address"
                            placeholder="Số nhà tên đường"
                            type="text"
                            value={selectedAddress?.detailAddress}
                            onChange={(e) => handleChangeState('detailAddress', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Phone</label>
                          <input
                            type="text"
                            value={selectedAddress?.numberPhone}
                            onChange={(e) => handleChangeState('numberPhone', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="billing-info mb-20">
                          <label>Postcode / ZIP</label>
                          <input
                            type="text"
                            value={selectedAddress?.zipcode}
                            onChange={(e) => handleChangeState('zipcode', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="your-order-area">
                    <h3>Đơn hàng của bạn</h3>
                    <div className="your-order-wrap gray-bg-4">
                      <div className="your-order-product-info">
                        <div className="your-order-top">
                          <ul>
                            <li>Sản phẩm</li>
                            <li>Tổng</li>
                          </ul>
                        </div>
                        <div className="your-order-middle">
                          <ul>
                            {cartItems.map((cartItem, key) => {
                              const discountedPrice = getDiscountPrice(
                                cartItem.product.price,
                                cartItem.product.discount
                              );
                              const finalProductPrice = (
                                cartItem.product.price * currency.currencyRate
                              ).toFixed(2);
                              const finalDiscountedPrice = (discountedPrice * currency.currencyRate).toFixed(
                                2
                              );

                              discountedPrice != null
                                ? (cartTotalPrice += finalDiscountedPrice * cartItem.quantity)
                                : (cartTotalPrice += finalProductPrice * cartItem.quantity);
                              return (
                                <li key={key}>
                                  <span className="order-middle-left">
                                    {cartItem.product.name} X {cartItem.quantity}
                                  </span>{' '}
                                  <span className="order-price">
                                    {discountedPrice !== null
                                      ? (finalDiscountedPrice * cartItem.product.quantity).toFixed(2) +
                                        ' ' +
                                        currency.currencySymbol
                                      : (finalProductPrice * cartItem.quantity).toFixed(2) +
                                        ' ' +
                                        currency.currencySymbol}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        {/* <div className="your-order-bottom">
                          <ul>
                            <li className="your-order-shipping">Shipping</li>
                            <li>Free shipping</li>
                          </ul>
                        </div> */}
                        <div className="your-order-total">
                          <ul>
                            <li className="order-total">Tổng</li>
                            <li>{cartTotalPrice.toFixed(2) + ' ' + currency.currencySymbol}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="payment-method"></div>
                    </div>
                    <div className="place-order mt-25">
                      <button className="btn-hover" onClick={addOrder}>
                        Đặt Ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{' '}
                      <Link to={process.env.PUBLIC_URL + '/shop-grid-standard'}>Shop Now</Link>
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

export default Checkout;
