import { AboutStore } from "@/components/home/AboutStore";
import { CallToAction } from "@/components/home/CallToAction";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Numbers } from "@/components/home/Numbers";
import { Stats } from "@/components/home/Stats";
import { TrustBanner } from "@/components/home/TrustBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getStoreSettings } from "@/lib/store-settings";

export default async function Home() {
  const settings =
    await getStoreSettings();

  const whatsappUrl =
    `https://wa.me/${settings.whatsappNumber}` +
    `?text=${encodeURIComponent(
      settings.whatsappMessage
    )}`;

  return (
    <>
      <Header />

      <Hero
        addressReference={
          settings.addressReference
        }
        whatsappUrl={whatsappUrl}
      />

      <TrustBanner />
      <Numbers />
      <Categories />
      <Stats />
      <WhyChooseUs />

      <HowItWorks
        storeName={settings.storeName}
        pickupNotice={
          settings.pickupNotice
        }
      />

      <FeaturedProducts
        storeName={settings.storeName}
      />

      <CallToAction
        whatsappUrl={whatsappUrl}
      />

      <AboutStore
        storeName={settings.storeName}
        addressReference={
          settings.addressReference
        }
        businessHours={
          settings.businessHours
        }
      />

      <Footer />
    </>
  );
}
