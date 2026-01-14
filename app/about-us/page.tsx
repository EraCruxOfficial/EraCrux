import React from 'react';
import Header1 from '@/components/mvpblocks/header-1';

const AboutUsPage: React.FC = () => {
    return (
        <div>
            <Header1 />
            <main className="flex flex-col items-center justify-center min-h-screen bg-[--bg-color] px-4 py-12 mt-12" style={{
                fontFamily: 'inter, sans-serif',
            }}>
                <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-700 mb-6">
                    EraCrux: Turning Data Complexity Into Clarity
                </h1>
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
                    Turning Data Complexity Into Clarity
                </h2>
                <p className="max-w-2xl text-center text-lg text-gray-600 mb-8">
                    EraCrux is a no-code data analytics platform built for small businesses, entrepreneurs, and individuals who want to harness the power of their data without the technical complexity. We believe everyone deserves to understand and control their data, regardless of their technical background.
                </p>
                <p className="max-w-2xl text-center text-md text-gray-700 mb-6">
                    EraCrux was born from a moment of redirection and a spark of shared passion. Two 21-year-old analysts who intimately understood the pain points of data complexity decided to solve them together. They dove deep into planning and building what would become EraCrux.
                </p>
                <p className="max-w-2xl text-center text-md text-gray-700 mb-6">
                    EraCrux isn't just another tech platform. It's the product of real analysts who've experienced firsthand how overwhelming data can be. We identified the major challenges faced by data professionals and beginners alike, then set out to eliminate them.
                </p>
                <div className="max-w-2xl w-full bg-[--foreground] rounded-xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">The result?</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>
                            <span className="font-bold">CruxBoard</span> — your personalized dashboard builder that makes data visualization effortless. With its intuitive drag-and-drop interface, you can quickly configure and customize dashboards to transform complex metrics into clear, visual stories — no coding required.
                        </li>
                        <li>
                            <span className="font-bold">CruxAI</span> — your intelligent data assistant that reads, interprets, and summarizes your data in plain language. It cuts through technical jargon to deliver immediate, understandable insights, making complex data analysis accessible to users of all skill levels.
                        </li>
                    </ul>
                </div>
                <h3 className="text-2xl font-bold text-center text-blue-700 mb-4">Join the Movement</h3>
                <p className="max-w-2xl text-center text-lg text-gray-600 mb-8">
                    Whether you're a small business owner making sense of sales data, an entrepreneur tracking growth metrics, or a data professional seeking better tools, EraCrux is here for you. Your support and feedback help us build a more robust platform every day.
                </p>
                <p className="max-w-2xl text-center text-xl font-semibold text-blue-800">
                    Your data partner in turning complexity into clarity.
                </p>
            </main>
        </div>
    );
};

export default AboutUsPage;