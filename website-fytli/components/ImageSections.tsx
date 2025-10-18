'use client';

import React from 'react';

export default function ImageSections() {
  return (
    <>
      {/* Section 1 - Community Workout (Image à gauche) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-[32px] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-7xl mb-4">🏘️</div>
                  <p className="text-lg font-semibold text-gray-700">Image à ajouter</p>
                  <p className="text-sm text-gray-500">community-workout.png</p>
                </div>
              </div>
            </div>

            {/* Texte */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark mb-6">
                Une communauté qui{' '}
                <span className="text-gradient-fytli">t'inspire</span>
              </h2>
              
              <p className="text-lg text-fytli-gray mb-6 leading-relaxed">
                Rejoins des milliers de personnes qui transforment leur quotidien avec Fytli. 
                Partage tes progrès, motive les autres et trouve l'inspiration chaque jour.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Partage tes séances et photos',
                  'Découvre les programmes des autres',
                  'Participe aux challenges communautaires',
                  'Reçois des encouragements quotidiens',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-fytli rounded-full flex items-center justify-center text-white text-sm font-bold">
                      ✓
                    </div>
                    <span className="text-fytli-gray">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="px-8 py-4 bg-gradient-fytli text-white rounded-fytli-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                Découvrir la communauté
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 - Home Yoga (Texte à gauche) */}
      <section className="py-20 bg-fytli-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark mb-6">
                Fytli : La solution idéale contre le{' '}
                <span className="text-gradient-fytli">stress quotidien</span>
              </h2>
              
              <p className="text-lg text-fytli-gray mb-6 leading-relaxed">
                Plus qu'une app de fitness, Fytli prend soin de ton corps et ton esprit. 
                Découvre des programmes adaptés pour réduire le stress et améliorer ton bien-être.
              </p>

              <div className="bg-white rounded-[24px] p-6 mb-8">
                <h3 className="font-bold text-fytli-dark mb-4">Bénéfices prouvés :</h3>
                <ul className="space-y-3">
                  {[
                    'Aide à la récupération',
                    'Réduit la fatigue',
                    'Améliore le sommeil',
                    'Élimine le stress',
                    'Apaise les tensions',
                    'Booste la confiance',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-fytli-orange">•</span>
                      <span className="text-fytli-gray">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button className="px-8 py-4 bg-fytli-orange text-white rounded-fytli-lg font-bold hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                Découvrir nos programmes
              </button>
            </div>

            {/* Image */}
            <div className="relative h-[500px] bg-gradient-to-br from-orange-100 to-pink-100 rounded-[32px] overflow-hidden order-1 lg:order-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-7xl mb-4">🧘</div>
                  <p className="text-lg font-semibold text-gray-700">Image à ajouter</p>
                  <p className="text-sm text-gray-500">home-yoga.png</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

