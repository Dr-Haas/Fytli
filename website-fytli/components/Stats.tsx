'use client';

import React, { useEffect, useState } from 'react';
import { getPublicStats } from '@/lib/api';

export default function Stats() {
  const [stats, setStats] = useState({
    users: 0,
    programs: 0,
    exercises: 0,
    badges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const publicStats = await getPublicStats();

        if (publicStats) {
          setStats({
            users: publicStats.users,
            programs: publicStats.programs,
            exercises: publicStats.exercises,
            badges: publicStats.badges,
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      value: stats.users > 0 ? stats.users.toLocaleString() : '—',
      label: 'Utilisateurs actifs',
      icon: '👥',
      color: 'from-fytli-red to-fytli-orange',
    },
    {
      value: stats.programs > 0 ? stats.programs : '—',
      label: 'Programmes sportifs',
      icon: '📅',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      value: stats.exercises > 0 ? stats.exercises : '—',
      label: 'Exercices disponibles',
      icon: '💪',
      color: 'from-purple-500 to-pink-500',
    },
    {
      value: stats.badges > 0 ? stats.badges : '—',
      label: 'Badges à débloquer',
      icon: '🏆',
      color: 'from-fytli-orange to-yellow-400',
    },
  ];

  return (
    <section id="stats" className="py-24 bg-gradient-to-br from-fytli-dark via-gray-900 to-fytli-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-fytli-red/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-fytli-orange/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <span className="text-sm font-semibold text-white">En chiffres</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            Rejoins la communauté Fytli
          </h2>
          
          <p className="text-xl text-white/80">
            Des milliers de personnes ont déjà commencé leur transformation
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm rounded-[24px] p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
                
                <div className="text-center">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl lg:text-5xl font-black mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/80">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
