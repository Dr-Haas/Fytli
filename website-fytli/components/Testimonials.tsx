'use client';

import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Fytli a complètement changé ma routine quotidienne ! Les programmes sont variés et les badges me motivent énormément. Je me sens en meilleure forme et plus confiante.",
      author: "Sophie M.",
      role: "Utilisatrice depuis 8 mois",
      rating: 5,
    },
    {
      quote: "Enfin une app qui comprend vraiment mes besoins. Le suivi de progression est top et la communauté est super bienveillante. Je recommande à 100% !",
      author: "Thomas D.",
      role: "Coach sportif",
      rating: 5,
    },
    {
      quote: "Je suis débutante et Fytli m'a accompagnée dès le premier jour. Les exercices sont bien expliqués et je peux m'entraîner à mon rythme. C'est parfait !",
      author: "Marie L.",
      role: "Débutante en fitness",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-fytli-dark mb-4">
            Qu'en pensent nos utilisateurs ?
          </h2>
          <p className="text-xl text-fytli-gray">
            Des milliers de personnes ont déjà transformé leur routine
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-fytli-cream rounded-[24px] p-8 hover:shadow-lg transition-all duration-300"
            >
              {/* Stars - 5 étoiles oranges */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-fytli-orange fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-fytli-gray leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-fytli rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-fytli-dark">{testimonial.author}</div>
                  <div className="text-sm text-fytli-gray">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation carousel */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="w-3 h-3 rounded-full bg-fytli-red"></button>
          <button className="w-3 h-3 rounded-full bg-gray-300"></button>
          <button className="w-3 h-3 rounded-full bg-gray-300"></button>
        </div>
      </div>
    </section>
  );
}
