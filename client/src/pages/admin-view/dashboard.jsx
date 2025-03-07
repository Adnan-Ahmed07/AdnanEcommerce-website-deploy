import ProductImageUpload from "@/components/admin-view/image-upload";
import IncomeChart from "@/components/admin-view/income-chart";

import { Button } from "@/components/ui/button";
import { 
  addFeatureImage, 
  getFeatureImages, 
  deleteFeatureImage 
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const handleUploadFeatureImage = () => {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  };

  const handleDeleteFeatureImage = (imageId) => {
    dispatch(deleteFeatureImage(imageId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Manage Feature Images</h1>
      <div className="mt-8">
        <IncomeChart />
      </div>
      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
        />
        <Button 
          onClick={handleUploadFeatureImage} 
          className="mt-5 w-full"
          disabled={imageLoadingState}
        >
          {imageLoadingState ? "Uploading..." : "Upload Image"}
        </Button>
      </div>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featureImageList?.map((featureImgItem) => (
          <div 
            key={featureImgItem._id} 
            className="relative group bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={featureImgItem.image}
              alt="Feature"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <Button
                onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;