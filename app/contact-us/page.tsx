import React from 'react';
import Header1 from '@/components/mvpblocks/header-1';

const ContactUsPage: React.FC = () => {
    return (
        <div>
            <Header1 />
            <main className="flex flex-col items-center justify-center min-h-screen bg-[--bg-color] px-4 py-12 mt-12" style={{
                fontFamily: 'inter, sans-serif',
            }}>
                <section className="max-w-2xl w-full bg-[--foreground]rounded-xl shadow-lg p-8 flex flex-col gap-6">
                    <h1 className="text-3xl font-bold text-center text-gray-100 mb-2">Contact Us</h1>
                    <p className="text-center text-gray-300">
                        We'd love to hear from you! Whether you have questions about our platform, need support, or want to share feedback, our team is here to help.
                    </p>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="space-y-3">
                        <h2 className="text-xl font-semibold text-gray-300">Reach Out to Us</h2>
                        <p className="text-gray-300">
                            Have questions about <span className="font-medium">CruxBoard</span> or <span className="font-medium">CruxAI</span>? Want to explore how EraCrux can transform your data analytics journey? Drop us a message and we'll get back to you as soon as possible.
                        </p>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-300">Connect With Us</h2>
                        <ul className="text-gray-300 space-y-1">
                            <li>
                                <span className="font-medium">📧 Email:</span> <a href="mailto:info@eracrux.com" className="text-blue-600 hover:underline">info@eracrux.com</a>
                            </li>
                            <li>
                                <span className="font-medium">🌐 Website:</span> <a href="https://www.eracrux.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.eracrux.com</a>
                            </li>
                            <li>
                                <span className="font-medium">💼 LinkedIn:</span> <a href="https://linkedin.com/company/eracrux" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">linkedin.com/company/eracrux</a>
                            </li>
                            <li>
                                <span className="font-medium">📱 Instagram:</span> <a href="https://instagram.com/era.crux" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@era.crux</a>
                            </li>
                        </ul>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">We're Building Together</h2>
                        <p className="text-gray-300">
                            Your feedback and suggestions are invaluable to us. As a growing platform, we're constantly evolving to better serve your data needs. Whether you're a current user or just curious about what EraCrux can do, we're excited to connect with you.
                        </p>
                        <p className="italic text-gray-300">
                            Let's make data analytics simple, accessible, and powerful—together.
                        </p>
                    </div>
                    <div className="text-right mt-6">
                        <span className="text-gray-300 font-semibold">Warm regards,<br />Co-Founders, EraCrux</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ContactUsPage;