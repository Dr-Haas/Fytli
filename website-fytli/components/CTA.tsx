'use client';

import React from 'react';

export default function CTA() {
  return (
    <section className="py-24 bg-fytli-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-fytli rounded-[32px] p-12 lg:p-16 overflow-hidden">
          {/* Background patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative text-center text-white">
            {/* Badge */}
            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <span className="text-sm font-semibold">🎉 Rejoins-nous gratuitement</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
              Prêt à transformer<br />ta routine fitness ?
            </h2>

            {/* Description */}
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-95">
              Commence dès aujourd'hui avec Fytli. C'est gratuit,
              c'est motivant, et c'est fait pour toi.
            </p>

            {/* CTA Button */}
            <a
              href="https://app.fytli.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-fytli-red rounded-fytli-lg font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105"
            >
              Lancer l'application
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>

            {/* Additional info */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Gratuit
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Aucune CB requise
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PWA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
