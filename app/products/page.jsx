// STUBBED

// 'use client';
// import { useState, useEffect } from 'react';
// import { loadGAScript } from '../utils/ga';
// import { Navbar } from '../components/Navbar';
// import { ProductShowcase } from './components/ProductShowcase';
// import { PricingSection } from '../components/PricingSection';
// import { SignupSection } from '../components/SignupSection';
// import { Footer } from '../components/Footer';

// export default function ProductsPage() {
//   const [selectedPlan, setSelectedPlan] = useState('team');

//   useEffect(() => {
//     const cleanup = loadGAScript();
//     return cleanup;
//   }, []);

//   return (
//     <div className="landing-container">
//       <Navbar />
//       <div className="page-content">
//         <section className="products-intro">
//           <div className="intro-container">
//             <h1 className="intro-title">Our Mystery Box Collections</h1>
//             <p className="intro-text">
//               Every month, we source premium surplus food from supermarkets and suppliers worldwide. 
//               We carefully curate and repackage them into exciting mystery boxes delivered straight to your office. 
//               From exotic chocolates to international snacks, you never know what delicious surprise awaits.
//             </p>
//           </div>
//         </section>

//         <ProductShowcase />

//         <PricingSection selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
//         <SignupSection selectedPlan={selectedPlan} />
//       </div>
//       <Footer />
//     </div>
//   );
// }
