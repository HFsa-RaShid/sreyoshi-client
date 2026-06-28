import BestSellers from "@/components/Home/BestSellers";
import CategorySection from "@/components/Home/CategorySection";
import FeatureBar from "@/components/Home/FeatureBar";
import HeroSection from "@/components/Home/Hero";
import LoyaltyRewards from "@/components/Home/LoyaltyRewards";
import NewArrivals from "@/components/Home/NewArrivals";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <FeatureBar></FeatureBar>
      <CategorySection></CategorySection>
      <LoyaltyRewards></LoyaltyRewards>
      <BestSellers></BestSellers>
      <NewArrivals></NewArrivals>
    </div>
  );
}
