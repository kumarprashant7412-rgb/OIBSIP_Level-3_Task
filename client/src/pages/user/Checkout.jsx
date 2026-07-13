import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPaymentOrder, verifyPayment } from '../../services/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!state?.pizza) {
    return (
      <div className="checkout-page page container">
        <div className="checkout-card" style={{ textAlign: 'center' }}>
          <p>No pizza selected. <Link to="/build-pizza">Build one first!</Link></p>
        </div>
      </div>
    );
  }

  const { pizza, totalPrice } = state;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) { toast.error('Razorpay SDK failed to load'); setLoading(false); return; }

      const { data: order } = await createPaymentOrder(totalPrice);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SwhiY2DhuazFqu',
        amount: order.amount,
        currency: order.currency,
        name: 'SliceHub',
        description: 'Custom Pizza Order',
        order_id: order.id,
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              pizza,
              totalPrice,
            });
            setOrderPlaced(true);
            toast.success('Order placed successfully! 🍕');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user?.name, email: user?.email, contact: '9999999999' },
        theme: { color: '#ff6b35' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      toast.error('Error initiating payment');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page page container">
        <div className="checkout-card checkout-success">
          <div className="checkout-success-icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p>Your custom pizza is being prepared</p>
          <Link to="/my-orders" className="btn btn-primary btn-lg">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page container">
      <h1>🛒 Checkout</h1>
      <div className="checkout-card">
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-item"><span>🫓 Base</span><span>{pizza.base}</span></div>
          <div className="checkout-item"><span>🍅 Sauce</span><span>{pizza.sauce}</span></div>
          <div className="checkout-item"><span>🧀 Cheese</span><span>{pizza.cheese}</span></div>
          <div className="checkout-item">
            <span>🥬 Toppings</span>
            <span>{pizza.veggies.length > 0 ? pizza.veggies.join(', ') : 'None'}</span>
          </div>
          <div className="checkout-total"><span>Total</span><span>₹{totalPrice}</span></div>
        </div>
        <button className="btn btn-primary btn-lg checkout-pay" onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : `💳 Pay ₹${totalPrice}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
