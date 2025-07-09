import { BarChart3, Users, ShoppingCart, TrendingUp, Activity, AlertTriangle, Settings, Bell, Search, Menu } from 'lucide-react';
import "./homepage.css"

const HomePage = () => {
    return (
        <div className='homepage'>
            <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo"></div>
            <nav className="nav">
              <a href="#" className="nav-link">Home</a>
              <a href="#" className="nav-link">Services</a>
              <a href="#" className="nav-link">Blog</a>
              <a href="#" className="nav-link">About Us</a>
              <a href="#" className="nav-link">Get Started</a>
            </nav>
          </div>
          <div className="header-right">
            <button className="live-btn">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Data That Decides.<br />
            Simplify Signals.<br />
            Amplify Outcomes.
          </h1>
          <p className="hero-subtitle">
            Harness the power of data to drive your business forward with our comprehensive analytics platform designed for modern enterprises.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Visualize your Data</button>
            {/* <button className="btn-secondary">Get Started</button> */}
          </div>
        </div>
      </section>

      {/* Navigation Icons */}
      <div className="nav-icons">
        <div className="nav-icon">
          <Users size={24} />
        </div>
        <div className="nav-icon">
          <BarChart3 size={24} />
        </div>
        <div className="nav-icon">
          <ShoppingCart size={24} />
        </div>
        <div className="nav-icon">
          <TrendingUp size={24} />
        </div>
        <div className="nav-icon">
          <Activity size={24} />
        </div>
        <div className="nav-icon">
          <Settings size={24} />
        </div>
        <div className="nav-icon">
          <AlertTriangle size={24} />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard">
        <div className="cards-grid">
          
          {/* Subscription Management Card */}
          <div className="card">
            <h3 className="card-title">Modernizing a Subscription Management Platform</h3>
            <p className="card-description">
              We helped streamline operations and improve customer experience for a subscription-based platform.
            </p>
            <div className="card-visual teal-gradient">
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">12 min</div>
                  <div className="stat-label">Reading Time</div>
                </div>
                <div className="stat">
                  <div className="stat-value">4.8*</div>
                  <div className="stat-label">User Rating</div>
                </div>
              </div>
            </div>
            <button className="card-button">Read More →</button>
          </div>

          {/* E-Commerce Card */}
          <div className="card">
            <h3 className="card-title">Developing an E-Commerce Website</h3>
            <p className="card-description">
              We created a high-converting e-commerce platform that drives sales and enhances user experience.
            </p>
            <div className="card-visual purple-gradient">
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">85%</div>
                  <div className="stat-label">Conversion Rate</div>
                </div>
                <div className="stat">
                  <div className="stat-value">70%</div>
                  <div className="stat-label">User Retention</div>
                </div>
              </div>
            </div>
            <button className="card-button">Read More →</button>
          </div>

          {/* Mobile Health Card */}
          <div className="card">
            <h3 className="card-title">Designing a Mobile Health Tracking App</h3>
            <p className="card-description">
              Creating an intuitive health monitoring solution that helps users track and improve their wellness journey.
            </p>
            <div className="card-visual orange-gradient">
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">12%</div>
                  <div className="stat-label">Reported Bugs</div>
                </div>
                <div className="stat">
                  <div className="stat-value">4.8*</div>
                  <div className="stat-label">App Store Rating</div>
                </div>
              </div>
            </div>
            <button className="card-button">Read More →</button>
          </div>

          {/* Corporate Identity Card */}
          <div className="card">
            <h3 className="card-title">Optimizing a Corporate Identity System</h3>
            <p className="card-description">
              We developed a comprehensive brand identity system that reflects modern business values and resonates with target audiences.
            </p>
            <div className="card-visual blue-gradient">
              <div className="card-stats">
                <div className="stat">
                  <div className="stat-value">20%</div>
                  <div className="stat-label">Brand Recognition</div>
                </div>
              </div>
            </div>
            <button className="card-button">Read More →</button>
          </div>

        </div>
      </div>
     
        </div>
    );
};

export default HomePage;