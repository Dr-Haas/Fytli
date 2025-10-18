'use client';

import React from 'react';

export default function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-br from-fytli-orange to-fytli-red">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
          Newsletter
        </h2>
        
        <p className="text-xl text-white/90 mb-10">
          Inscris-toi pour recevoir nos meilleurs conseils fitness, 
          nos nouveaux programmes et nos offres exclusives !
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <input
            type="email"
            placeholder="Entre ton email"
            className="flex-1 px-6 py-4 rounded-fytli-lg text-lg focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="px-10 py-4 bg-white text-fytli-red rounded-fytli-lg font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            S'inscrire
          </button>
        </div>

        <p className="text-sm text-white/80 mt-6">
          📧 Reçois des conseils exclusifs • 🎁 Des offres spéciales • ✨ Et bien plus !
        </p>
      </div>
    </section>
  );
}

