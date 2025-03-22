import CategoriesGroup from "@/components/Home/CategoriesGroup";
import ImageSlider from "@/components/Home/ImageSlider";
// import LogoSlider from "@/components/Home/LogoSlider";
import NewArrivals from "@/components/Home/NewArrivals";
import OurProducts from "@/components/Home/OurProducts";
import ReviewSlider from "@/components/Home/ReviewSlider";
// import BestSellers from "@/components/Others/BestSellers";
// import CategorySection from "../../../components/Home/CategoryBar";
import BannerSection from "../../../components/Home/InstaBanner"
import ShopCatogories from "@/components/Others/ShopCatogories";
import Marquee from "@/components/Home/OfferHeader";
import RedBanner from "@/components/Home/redBanner";
import ShopCategories from "@/components/Others/ShopCatogories";
import BestSeller from "@/components/Others/BestSellers";



export default function Home2(){
  return (
    <>
  
  <ImageSlider />

  
  <div className="max-w-screen-2xl mx-auto px-4">

    {/* <Marquee/> */}
    {/* <CategorySection/> */} 
    <ShopCategories />  
    {/* <LogoSlider />  */}
    <BestSeller/>
    <NewArrivals /> 
    <RedBanner/>
    <OurProducts />
    <CategoriesGroup />
    {/* <BestSellers /> */}
    <BannerSection/>
    <ReviewSlider />
  </div>
</>

  );
}
