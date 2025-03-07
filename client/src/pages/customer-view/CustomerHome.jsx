import { Airplay, BabyIcon, ChevronLeftIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from "lucide-react";
import bannerOne from "../../assets/banner1.jpg";
import bannerTWO from "../../assets/banner-2s.webp";
import bannerThre from "../../assets/banner-3s.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/customer/products-slice";
import CustomerProductTile from "@/components/customer-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/customer/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/customer-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const CategoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const BrandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];
const CustomerHome = () => {
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const slides=[bannerOne,bannerTWO,bannerThre];
  const { productList, productDetails } = useSelector(
    (state) => state.customerProducts
  );
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/customers/prlisting`);
  }

 function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }
  function handleAddtoCart(getCurrentProductId) {
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product is added to cart",
          });
        }
      });
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
      }, 4000);
  
      return () => clearInterval(timer);
    }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);
 useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch])
console.log(productList,"list");
  return (
    <div className="flex flex-col min-h-screen">
    <div className="relative w-full h-[600px] overflow-hidden">
      {featureImageList && featureImageList.length > 0
        ? featureImageList.map((slide, index) => (
            <img
              src={slide?.image}
              key={index}
              className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />
          ))
        : null}
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          setCurrentSlide(
            (prevSlide) =>
              (prevSlide - 1 + featureImageList.length) %
              featureImageList.length
          )
        }
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % slides.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        </div>
        <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CategoriesWithIcon.map((CategoryItem) => (
              <Card
              onClick={() =>
                handleNavigateToListingPage(CategoryItem, "Category")
              }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <CategoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{CategoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BrandsWithIcon.map((BrandItem) => (
              <Card
              onClick={() => handleNavigateToListingPage(BrandItem, "Brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <BrandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{BrandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <CustomerProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
        </div>
  )
}

export default CustomerHome;