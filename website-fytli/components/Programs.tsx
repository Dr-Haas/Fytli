'use client';

import React from 'react';

export default function Programs() {
  const programs = [
    {
      title: 'Programme Débutant',
      description: 'Parfait pour commencer ton aventure fitness',
      oldPrice: '49€',
      newPrice: 'Gratuit',
      color: 'from-pink-400 to-pink-500',
      bgColor: 'bg-pink-50',
      buttonColor: 'bg-pink-500 hover:bg-pink-600',
      image: '💪',
    },
    {
      title: 'Programme Intermédiaire',
      description: 'Pour progresser et atteindre tes objectifs',
      oldPrice: '79€',
      newPrice: 'Gratuit',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      image: '🏃',
    },
    {
      title: 'Programme Avancé',
      description: 'Challenge tes limites et dépasse-toi',
      oldPrice: '99€',
      newPrice: 'Gratuit',
      color: 'from-green-400 to-green-500',
      bgColor: 'bg-green-50',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      image: '🚀',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark mb-4">
            Nos programmes ultra complets
          </h2>
          <p className="text-xl text-fytli-gray">
            Trouve le programme parfait pour tes objectifs
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`${program.bgColor} rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Image/Icon Section */}
              <div className={`h-64 bg-gradient-to-br ${program.color} flex items-center justify-center`}>
                <div className="text-8xl">{program.image}</div>
              </div>

              {/* Content Section */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-fytli-dark mb-3">
                  {program.title}
                </h3>
                
                <p className="text-fytli-gray mb-6">
                  {program.description}
                </p>

                {/* Prix */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg text-gray-400 line-through">
                    {program.oldPrice}
                  </span>
                  <span className="text-2xl font-black text-fytli-red">
                    {program.newPrice}
                  </span>
                </div>

                {/* Bouton */}
                <button
                  className={`w-full py-4 ${program.buttonColor} text-white rounded-fytli-lg font-bold text-lg transition-all duration-300`}
                >
                  Voir le programme
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

