import { BarChart3, Users, ShoppingCart, TrendingUp, Activity, AlertTriangle, Settings, Bell, Search, Menu } from 'lucide-react';
import "./homepage.css"
import { BlogCard } from '../components/BlogCard';
// import { Feature } from '../components/FeatureGrid';
import FeatureGrid from '../components/FeatureGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className='homepage'>

      <Navbar />

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

      <div className='BlogSection' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

        <BlogCard
          imageUrl="https://private-user-images.githubusercontent.com/219167906/471135862-43352585-23c7-4b12-9f6d-0c34888581b1.jpeg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTM1NTkzODMsIm5iZiI6MTc1MzU1OTA4MywicGF0aCI6Ii8yMTkxNjc5MDYvNDcxMTM1ODYyLTQzMzUyNTg1LTIzYzctNGIxMi05ZjZkLTBjMzQ4ODg1ODFiMS5qcGVnP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDcyNiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA3MjZUMTk0NDQzWiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9MDg2ZmYyMjdhN2NiMWJiODg3OTFkYTc1YzNhYzY1MDg2ZmIzM2Y3OTc2NGVjNTZkNWEwMWQ2ZTIxZTg0ODIzNiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.OJ2n3YTsMJ0CC91FRuXbA_Dn1FOnE7wUOLxH6cvnP7g"
          linkUrl="https://drive.google.com/file/d/1MSGEcJCOxIQmPfsBTNx6EFv57vApl0o4/view"
          badgeText="Latest"
          title="Top Data Analytics tools to master in 2025"
          description="Discover the Future of Data Analytics with EraCrux Stay ahead in 2025 with our comprehensive guide to the most powerful data analytics tools and techniques. From modern platforms like Tableau, Power BI, and Google Data Studio to traditional methods such as surveys and SWOT analysis, we empower small businesses to make smarter, data-driven decisions. Whether you're a business owner or an aspiring analyst, EraCrux provides the insights and strategies to help you grow, innovate, and build stronger community connections through data."
          authorName="Rashi"
          authorAvatar="https://media.licdn.com/dms/image/v2/D5603AQHyuWv2t8VVrQ/profile-displayphoto-shrink_800_800/B56ZV5AMvTHsAc-/0/1741491852584?e=1756339200&v=beta&t=kw2ZjaISdRsp86YyJX5uEeZH96ST7XkB0_PEreAshvU"
        />
        <BlogCard
          imageUrl="https://private-user-images.githubusercontent.com/219167906/471138434-3f060a13-e7b8-4d56-b5a1-a169294176bb.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTM1NTc1ODgsIm5iZiI6MTc1MzU1NzI4OCwicGF0aCI6Ii8yMTkxNjc5MDYvNDcxMTM4NDM0LTNmMDYwYTEzLWU3YjgtNGQ1Ni1iNWExLWExNjkyOTQxNzZiYi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNzI2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDcyNlQxOTE0NDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1kNWE3NGY3YjliNzNjMTAyMTE5OTdhNTQ5YzYzZjBlZGU3OGQwZTY0YWIxOGNmNDBlMzcyOWY5NzFkYTZiZTU1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.wejRR0fkXD9gixJ1QYrJ8miBvjuGKURJRq0N6GGpWOU"
          linkUrl="https://drive.google.com/file/d/10_jQ4o_yDdOIzFx9gfrRqF9IEzCIGNl3/view"
          badgeText="outstanding"
          title="Beginner's guide to Data Analytics"
          description="Your Journey Into Data Analytics Starts Here Unlock the potential of data with our beginner-friendly guide designed to simplify the world of data analytics. From defining key metrics to collecting and analyzing insights both online and offline, this guide empowers individuals and small businesses to make smarter, data-driven decisions. Learn how tools, strategies, and community support come together to help local businesses thrive in a digital world. Whether you're just starting out or aiming to grow your impact, this is your gateway to practical, impactful analytics."
          authorName="Lakshita "
          authorAvatar="https://media.licdn.com/dms/image/v2/D5603AQEP_YlhapRxrg/profile-displayphoto-shrink_200_200/B56ZZANao5GUAY-/0/1744833982000?e=1756339200&v=beta&t=4USIA1cqmR03tZnCTvkPioacm0C6_x7i3jd7Xhm-TM8"
        />
      </div>
      <FeatureGrid/>
      <Footer />

    </div>
  );
};

export default HomePage;