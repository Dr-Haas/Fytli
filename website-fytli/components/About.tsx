'use client';

import React from 'react';

export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative h-[500px] bg-gradient-to-br from-fytli-red/10 to-fytli-orange/10 rounded-[32px] overflow-hidden">
              {/* Placeholder - Tu peux ajouter l'image du couple yoga ici */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl">🧘‍♀️</div>
                  <p className="text-lg text-fytli-gray font-medium">Image yoga à venir</p>
                  <p className="text-sm text-fytli-gray">home-yoga.png</p>
                </div>
              </div>
            </div>
            
            {/* Stats Card flottante */}
            <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl p-6 max-w-[200px]">
              <div className="text-4xl font-black text-fytli-red mb-1">92%</div>
              <div className="text-sm text-fytli-gray">Satisfaction utilisateur</div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-fytli-orange/10 rounded-full">
              <span className="text-sm font-semibold text-fytli-orange">À propos de Fytli</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark leading-tight">
              Une application pensée pour{' '}
              <span className="text-gradient-fytli">ton bien-être</span>
            </h2>

            <p className="text-lg text-fytli-gray leading-relaxed">
              Fytli n'est pas qu'une simple app de fitness. C'est un compagnon qui comprend 
              tes besoins, s'adapte à ton rythme et célèbre chaque victoire avec toi.
            </p>

            <div className="space-y-4">
              {[
                { icon: '🎯', title: 'Programmes adaptés', desc: 'À ton niveau et tes objectifs' },
                { icon: '🏆', title: 'Motivation continue', desc: 'Badges et récompenses régulières' },
                { icon: '📊', title: 'Suivi intelligent', desc: 'Visualise tes progrès en temps réel' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl hover:bg-fytli-cream transition-all duration-300">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <div className="font-bold text-fytli-dark mb-1">{item.title}</div>
                    <div className="text-sm text-fytli-gray">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

