// "use client";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// export default function CheckoutButton() {
//   const handleCheckout = async () => {
//     const res = await fetch("/api/checkout_sessions", {
//       method: "POST",
//     });
//     const { id } = await res.json();

//     const stripe = await stripePromise;
//     await stripe.redirectToCheckout({ sessionId: id });
//   };

//   return (
//     <button
//       onClick={handleCheckout}
//       className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
//     >
//       💳 Support Us ($20)
//     </button>
//   );
// }
