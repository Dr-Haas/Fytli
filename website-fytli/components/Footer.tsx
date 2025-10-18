'use client';

import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-fytli-red/10 to-fytli-orange/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Colonne 1 - Logo */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo-fytli.png" 
                alt="Fytli" 
                width={40} 
                height={40}
                className="rounded-xl"
              />
              <span className="text-2xl font-black text-fytli-dark">Fytli</span>
            </div>
            <p className="text-fytli-gray text-sm leading-relaxed">
              Ton compagnon sport & bien-être pour atteindre tes objectifs et dépasser tes limites.
            </p>
          </div>

          {/* Colonne 2 - Menu principal */}
          <div>
            <h3 className="font-bold text-fytli-dark mb-4">Menu principal</h3>
            <ul className="space-y-2">
              {['Accueil', 'Programmes', 'Badges', 'Témoignages', 'Mon compte'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-fytli-gray hover:text-fytli-red transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 - Liens rapides */}
          <div>
            <h3 className="font-bold text-fytli-dark mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {['À propos', 'Contact', 'FAQ', 'Mentions légales', 'CGV'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-fytli-gray hover:text-fytli-red transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 - Newsletter */}
          <div>
            <h3 className="font-bold text-fytli-dark mb-4">Newsletter</h3>
            <p className="text-sm text-fytli-gray mb-4">
              Reçois nos conseils et actus fitness
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Ton email"
                className="flex-1 px-4 py-2 rounded-fytli border border-gray-300 focus:outline-none focus:border-fytli-red"
              />
              <button className="px-6 py-2 bg-gradient-fytli text-white rounded-fytli font-semibold hover:shadow-lg transition-all">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-t border-gray-200">
          {[
            { icon: '📞', text: 'Support dédié' },
            { icon: '🔒', text: 'Paiement sécurisé' },
            { icon: '📱', text: 'Application PWA' },
            { icon: '✅', text: 'Gratuit' },
          ].map((service, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{service.icon}</span>
              <span className="text-sm font-semibold text-fytli-dark">{service.text}</span>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-fytli-gray">
            © {new Date().getFullYear()} Fytli. Tous droits réservés. Fait avec ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
