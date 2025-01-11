import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

const PlaceOrder = () => {
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/cart/braintree/token`
      );
      setClientToken(data?.clientToken);
    } catch (error) {
      console.error("Error fetching client token:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, [token]);

  const handlePayment = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      await axios.post(`http://localhost:4000/api/cart/braintree/payment`, {
        nonce,
        cart: cartItems,
        rafce
      });
      alert("Payment Completed Successfully");
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(
        `http://localhost:4000/api/order/place`,
        orderData,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        handlePayment();
      } else {
        alert("Error placing order");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Order Error");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        {/* Delivery information form */}
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>

      {!clientToken ? (
        "Client Token Not Found"
      ) : (
        <DropIn
          options={{
            authorization: clientToken,
            paypal: { flow: "vault" },
          }}
          onInstance={(instance) => setInstance(instance)}
        />
      )}
    </form>
  );
};
export default PlaceOrder;
