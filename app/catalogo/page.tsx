import { Header } from "@/components/layout/Header"; 
import { FeaturedProducts } from "@/components/home/FeaturedProducts"; 
import { WhyChooseUs } from "@/components/home/WhyChooseUs"; // Certifique-se de que este import existe
import { StoreSection } from "@/components/home/StoreSection";
import { Footer } from "@/components/layout/Footer"; 

export default function CatalogoPage() { 
  return ( 
    <> 
      <Header /> 
      <main className="mx-auto max-w-7xl px-6 py-12"> 
        <h1 className="mb-3 text-5xl font-black"> Catálogo </h1> 
        <p className="mb-12 text-zinc-400"> Todos os produtos disponíveis na Guiart Games. </p> 
        <FeaturedProducts /> 
        <WhyChooseUs />
        <StoreSection />
      </main> 
      <Footer /> 
    </> 
  ); 
}
