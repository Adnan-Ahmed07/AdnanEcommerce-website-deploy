import { Airplay, BabyIcon, ChevronLeftIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from "lucide-react";
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
  const { productList, productDetails } = useSelector((state) => state.customerProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [addingProducts, setAddingProducts] = useState([]);
  const { cartItems } = useSelector((state) => state.customerCart);

  const handleSlideNavigation = (direction) => {
    setCurrentSlide(prev => {
      if (direction === 'next') {
        return (prev + 1) % featureImageList.length;
      }
      return (prev - 1 + featureImageList.length) % featureImageList.length;
    });
  };

  useEffect(() => {
    if (featureImageList?.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % featureImageList.length);
      }, 5000);
      return () => clearInterval(timer);
    }
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
  }, [dispatch]);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/customers/prlisting`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    // Prevent multiple clicks
    if (addingProducts.includes(getCurrentProductId)) return;

    setAddingProducts(prev => [...prev, getCurrentProductId]);

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          setAddingProducts(prev => prev.filter(id => id !== getCurrentProductId));
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Product is added to cart" });
      }
    }).finally(() => {
      setAddingProducts(prev => prev.filter(id => id !== getCurrentProductId));
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Optimized Slideshow Section */}
      <div className="relative w-full h-[50vh] md:h-[600px] max-h-[90vh] overflow-hidden">
        {featureImageList?.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={`Promotion ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-contain md:object-cover transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSlideNavigation('prev')}
            className="bg-white/80 hover:bg-white w-8 h-8 md:w-12 md:h-12 rounded-full shadow-lg"
          >
            <ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSlideNavigation('next')}
            className="bg-white/80 hover:bg-white w-8 h-8 md:w-12 md:h-12 rounded-full shadow-lg rotate-180"
          >
            <ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" />
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {featureImageList?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-primary scale-110 md:scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {CategoriesWithIcon.map((category) => (
              <Card
                key={category.id}
                onClick={() => handleNavigateToListingPage(category, "Category")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                  <category.icon className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4 text-primary" />
                  <span className="text-sm md:text-base font-bold text-center">
                    {category.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
            {BrandsWithIcon.map((brand) => (
              <Card
                key={brand.id}
                onClick={() => handleNavigateToListingPage(brand, "Brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                  <brand.icon className="w-8 h-8 md:w-12 md:h-12 mb-3 md:mb-4 text-primary" />
                  <span className="text-sm md:text-base font-bold text-center">
                    {brand.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productList?.map((product) => (
              <CustomerProductTile
                key={product.id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default CustomerHome;