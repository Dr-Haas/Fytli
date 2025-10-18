'use client';

import React from 'react';

export default function Challenges() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Contenu */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Des challenges pour se dépasser
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Que tu sois débutant ou confirmé, on a tous nos objectifs. 
              Avec Fytli, on suit nos progrès, on se fixe des défis et on s'encourage au quotidien.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Objectifs perso</h3>
                  <p className="text-gray-600">Définis tes propres challenges</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  🏆
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Défis entre potes</h3>
                  <p className="text-gray-600">Qui fera le plus de pompes ?</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Suivi détaillé</h3>
                  <p className="text-gray-600">Vois ta progression en temps réel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-green-400 to-blue-500">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🧘</div>
                <p className="text-2xl font-semibold mb-2">Photo Yoga/Home</p>
                <p className="text-sm opacity-75">Ajouter : home-yoga.png</p>
                <p className="text-xs opacity-50 mt-4">public/images/home-yoga.png</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

