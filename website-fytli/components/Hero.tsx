'use client';

import React from 'react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[85vh] py-20">
          
          {/* Contenu texte */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
              On se motive ensemble ! 💪
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Fytli, c'est notre app entre potes pour partager nos séances, lancer des challenges et se booster mutuellement. 
              Rejoins la team et montre-nous ce que tu as dans le ventre ! 🔥
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://app.fytli.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-colors duration-200"
              >
                Rejoindre l'aventure
              </a>
              
              <a
                href="#community"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-900 transition-colors duration-200"
              >
                Découvrir la team
              </a>
            </div>
          </div>

          {/* Image hero */}
          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 to-red-500">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-2xl font-semibold mb-2">Image Hero</p>
                <p className="text-sm opacity-75">Ajouter : hero-celebration.png</p>
                <p className="text-xs opacity-50 mt-4">public/images/hero-celebration.png</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
