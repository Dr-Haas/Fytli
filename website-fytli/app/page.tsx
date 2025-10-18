import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import Benefits from '@/components/Benefits';
import Stats from '@/components/Stats';
import ImageSections from '@/components/ImageSections';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Programs />
      <Benefits />
      <Stats />
      <ImageSections />
      <Features />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
