'use client';

import React from 'react';

export default function Community() {
  return (
    <section id="community" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 order-2 lg:order-1">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🏘️</div>
                <p className="text-2xl font-semibold mb-2">Photo Communauté</p>
                <p className="text-sm opacity-75">Ajouter : community-workout.png</p>
                <p className="text-xs opacity-50 mt-4">public/images/community-workout.png</p>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Notre petite communauté qui déchire
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              On est tous passés par là : difficile de garder la motivation seul. 
              Avec Fytli, on partage nos progrès, on se challenge et on célèbre chaque victoire ensemble !
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg text-gray-700">Partage tes séances et photos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg text-gray-700">Lance des challenges entre amis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg text-gray-700">Booste-toi avec la team</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <span className="text-lg text-gray-700">Débloque des badges fun</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

