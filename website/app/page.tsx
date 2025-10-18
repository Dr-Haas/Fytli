import { config } from '@/lib/config';

export default function Home() {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col bg-gradient-to-b from-[#FFD56B] via-[#FFA34A] to-[#FF7948] text-[#4A2E20] font-poppins">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFD56B]/95 backdrop-blur-sm border-b border-[#FFA34A]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Fytli" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-xl sm:text-2xl font-bold text-[#4A2E20]">Fytli</span>
          </div>
          <a
            href={config.appUrl}
            className="px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-[#FF7948] to-[#FF4D3A] text-white text-sm sm:text-base font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out"
          >
            Se connecter
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-4 sm:px-6 py-12 sm:py-20 mt-14 sm:mt-16 w-full max-w-full overflow-hidden">
        <img 
          src="/assets/fytli-hero.png" 
          alt="Couple qui s'étire - Fytli" 
          className="w-[90vw] max-w-sm sm:max-w-md rounded-2xl shadow-lg mb-8 sm:mb-10"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">Fytli</h1>
        <p className="text-xl sm:text-2xl italic mb-3 sm:mb-4">Seul, mais ensemble.</p>
        <p className="text-base sm:text-lg max-w-xl px-4 mb-6 sm:mb-8">
          Fytli te motive à t&apos;entraîner avec tes amis, chacun depuis chez soi.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center mb-8 sm:mb-10 w-full max-w-md sm:max-w-none px-4">
          <a
            href={config.appUrl}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-[#FF7948] to-[#FF4D3A] text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out text-base sm:text-lg text-center"
          >
            Commencer gratuitement
          </a>
          <a
            href={`${config.appUrl}/register`}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white/90 text-[#FF4D3A] font-semibold rounded-full hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out text-base sm:text-lg border-2 border-[#FF4D3A]/20 text-center"
          >
            Créer un compte
          </a>
        </div>

        <div className="mt-6 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ESPRIT FYTLI */}
      <section className="bg-[#FFF5E6] w-full max-w-full py-12 sm:py-20 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden">
        <img 
          src="/assets/fytli-community.png" 
          alt="Personnes connectées - Fytli" 
          className="w-[90vw] max-w-lg sm:max-w-2xl md:max-w-3xl rounded-2xl mb-8 sm:mb-10 shadow-lg"
        />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4">L&apos;esprit Fytli</h2>
        <p className="max-w-2xl text-base sm:text-lg leading-relaxed px-4">
          Chacun s&apos;entraîne dans son coin, mais personne n&apos;est seul.<br className="hidden sm:block"/>
          <span className="sm:hidden"> </span>Les séances se synchronisent, les encouragements circulent,<br className="hidden sm:block"/>
          <span className="sm:hidden"> </span>et la motivation devient collective.
        </p>
      </section>

      {/* COMMUNAUTÉ & MOTIVATION */}
      <section className="bg-gradient-to-b from-[#FFDCA3] via-[#FFB77B] to-[#FF9262] w-full max-w-full py-12 sm:py-20 px-4 sm:px-6 flex flex-col items-center text-center text-[#4A2E20] overflow-hidden">
        <img 
          src="/assets/fytli-dashboard.png" 
          alt="Communauté Fytli" 
          className="w-[90vw] max-w-lg sm:max-w-2xl md:max-w-3xl rounded-2xl mb-8 sm:mb-10 shadow-lg"
        />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4">La motivation partagée</h2>
        <p className="max-w-2xl text-base sm:text-lg leading-relaxed px-4">
          Chaque progrès est célébré.<br/>
          Chaque effort compte.<br/>
          Et tout le monde avance ensemble.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-t from-[#FF7948] to-[#FFA34A] w-full max-w-full text-center py-8 sm:py-10 px-4 text-[#FFF8EE] overflow-hidden">
        <p className="text-base sm:text-lg mb-3">
          Fytli, c&apos;est gratuit.<br/>Pour toi, pour tes proches, pour bouger ensemble ❤️
        </p>
        <p className="opacity-80 text-xs sm:text-sm">© 2025 Fytli – L&apos;esprit du mouvement partagé</p>
      </footer>

    </main>
  );
}

