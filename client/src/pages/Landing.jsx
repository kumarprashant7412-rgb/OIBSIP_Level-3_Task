import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to <span className="highlight">SliceHub</span>
                    </h1>
                    <p className="hero-subtitle">
                        Craft your perfect pizza, order online, and get it delivered hot and fresh to your door.
                    </p>
                    <div className="hero-actions">
                        {user ? (
                            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary btn-lg">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="hero-image-container">
                    <div className="pizza-illustration">🍕</div>
                </div>
            </div>

            <div className="features-section">
                <h2 className="section-title">Why Choose SliceHub?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Builds</h3>
                        <p>Choose your crust, sauce, cheese, and unlimited toppings to create your masterpiece.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Fast Delivery</h3>
                        <p>Real-time order tracking and lightning-fast delivery straight to your doorstep.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⭐</div>
                        <h3>Premium Quality</h3>
                        <p>We use only the freshest ingredients and authentic recipes for the perfect slice.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
