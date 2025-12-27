import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>About Circulink</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 mb-8">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
            Circulink is a sustainable, AI-powered second-hand trading platform designed exclusively for the DukeKunshan University (DKU) community. It provides a structured, intelligent, and community-verified marketplace that solves the inefficiencies of traditional WeChat trading groups - such as disorganized listings, poor searchability, and lack of trust.

            Through features like AI-based categorization, charitable donation integration, and NetID authentication, Circulink connects DKU students, faculty, and staff in a safe, efficient, and environmentally conscious trading network. The platform not only encourages reuse and sharing, but also strengthens the spirit of community engagement and social responsibility on campus.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>Mission & Vision</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
Sustainability:
Circulink transforms idle goods into shared resources, reducing waste and promoting a circular economy. By partnering with charity shop Buy42, unsold items can be automatically donated after their listing period, ensuring that every product creates social value.

Community:
As a non-profit social enterprise, Circulink prioritizes community benefit over financial gain. It fosters trust through verified DKU logins and transparent user interactions, empowering members to trade responsibly and give back to society.

Circular Economy:
Circulink integrates AI-supported classification and donation workflows to close the loop between consumption and sustainability, building a model for campus circular economy and future inter-campus cooperation.
          </p>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>Privacy & Terms</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line">
Circulink respects user privacy and follows DKU's community data policy.

All transactions are verified through DKU NetID authentication.

By using Circulink, you agree to our [Terms of Service] and [Privacy Policy].
          </p>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>FAQ</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
Q1: How can I buy or sell items on Circulink?
A: Simply log in with your DKU NetID, upload product details, and browse listings by category or keyword.

Q2: Do I need real-name verification?
A: Yes, Circulink is exclusive to DKU users and requires NetID login to ensure trust and authenticity.

Q3: What happens to donated items?
A: Unsold goods can be automatically donated to our partner charity store Buy42, which redistributes them to those in need, turning idle items into meaningful contributions.
          </div>
        </div>

        <div className="mt-8 mb-6 flex justify-center">
          <div className="inline-block text-orange-700 px-8 py-4 rounded-full font-extrabold text-2xl shadow-2xl border" style={{ background: 'rgba(255,255,255,0.16)', borderColor: 'rgba(255,255,255,0.32)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>Contact Us</div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
          <p className="text-gray-800 leading-relaxed">
            We'd love to hear your feedback or suggestions!
            <br />
            Email: <a href="mailto:aw565@duke.edu" className="text-orange-600 hover:underline">aw565@duke.edu</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;