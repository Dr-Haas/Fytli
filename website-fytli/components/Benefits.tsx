'use client';

import React from 'react';

export default function Benefits() {
  const benefits = [
    {
      icon: '💺',
      title: 'Longtemps assis',
      description: 'Idéal pour le télétravail',
    },
    {
      icon: '🏃',
      title: 'Sportifs',
      description: 'Améliore tes performances',
    },
    {
      icon: '🧘',
      title: 'Bien-être',
      description: 'Réduis le stress',
    },
    {
      icon: '💼',
      title: 'Professionnels',
      description: 'Longtemps debout',
    },
    {
      icon: '🎯',
      title: 'Objectifs',
      description: 'Atteins tes buts',
    },
    {
      icon: '🤝',
      title: 'Communauté',
      description: 'Reste motivé',
    },
  ];

  return (
    <section className="py-20 bg-fytli-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark mb-4">
            À qui s'adresse Fytli ?
          </h2>
        </div>

        {/* Grid Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-[24px] p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-fytli-dark mb-2">
                {benefit.title}
              </h3>
              <p className="text-fytli-gray">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

