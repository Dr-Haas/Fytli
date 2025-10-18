'use client';

import React from 'react';
import Image from 'next/image';

export default function SimpleFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Logo et description */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
              <Image
                src="/logo-fytli.png"
                alt="Fytli"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold">Fytli</span>
            </div>
            <p className="text-gray-400">
              Bouge mieux, vis mieux - Entre amis 💪
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-sm">
            <a href="https://app.fytli.fr" className="text-gray-400 hover:text-white transition-colors">
              Se connecter
            </a>
            <a href="#community" className="text-gray-400 hover:text-white transition-colors">
              La team
            </a>
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">
              Fonctionnalités
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 Fytli. Fait avec ❤️ pour la team.</p>
        </div>

      </div>
    </footer>
  );
}

