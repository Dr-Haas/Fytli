'use client';

import React from 'react';

export default function Features() {
  const features = [
    {
      icon: '💪',
      title: 'Programmes personnalisés',
      description: 'Des entraînements adaptés à ton niveau, tes objectifs et ton emploi du temps.',
      color: 'from-fytli-red to-fytli-orange',
    },
    {
      icon: '🏆',
      title: 'Système de badges',
      description: 'Débloque des récompenses et célèbre chaque étape de ta progression.',
      color: 'from-fytli-orange to-yellow-400',
    },
    {
      icon: '📊',
      title: 'Suivi détaillé',
      description: 'Analyse tes performances et visualise ton évolution avec des graphiques clairs.',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      icon: '🤝',
      title: 'Communauté active',
      description: 'Rejoins une communauté bienveillante qui t\'encourage et te motive.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '📱',
      title: 'PWA installable',
      description: 'Installe l\'app sur ton téléphone et utilise-la même hors ligne.',
      color: 'from-green-500 to-emerald-400',
    },
    {
      icon: '🎯',
      title: 'Objectifs clairs',
      description: 'Définis tes objectifs et suis ta progression semaine après semaine.',
      color: 'from-fytli-red to-rose-500',
    },
  ];

  return (
    <section id="features" className="py-24 bg-fytli-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full mb-6">
            <span className="text-sm font-semibold text-fytli-red">Fonctionnalités</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark mb-6 leading-tight">
            Tout ce dont tu as besoin pour{' '}
            <span className="text-gradient-fytli">réussir</span>
          </h2>
          
          <p className="text-xl text-fytli-gray">
            Une expérience complète pour transformer ta routine fitness
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-[24px] p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Icon with gradient bg */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              <h3 className="text-xl font-bold text-fytli-dark mb-3">
                {feature.title}
              </h3>

              <p className="text-fytli-gray leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-6 flex items-center text-sm font-semibold text-fytli-red opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                En savoir plus
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
