import { Header } from "@/components/layout/Header"; 
import { Hero } from "@/components/home/Hero"; 
import { TrustBanner } from "@/components/home/TrustBanner"; 
import { Categories } from "@/components/home/Categories"; 
import { Stats } from "@/components/home/Stats"; 
import { WhyChooseUs } from "@/components/home/WhyChooseUs"; 
import { HowItWorks } from "@/components/home/HowItWorks"; 
import { FeaturedProducts } from "@/components/home/FeaturedProducts"; 
import { CallToAction } from "@/components/home/CallToAction"; // Novo import
import { AboutStore } from "@/components/home/AboutStore"; 
import { Footer } from "@/components/layout/Footer"; 

export default function Home() { 
  return ( 
    <> 
      <Header /> 
      <Hero /> 
      <TrustBanner /> 
      <Categories /> 
      <Stats /> 
      <WhyChooseUs /> 
      <HowItWorks /> 
      <FeaturedProducts /> 
      <CallToAction /> {/* Posicionado logo depois dos Produtos em Destaque */}
      <AboutStore /> 
      <Footer /> 
    </> 
  ); 
}
