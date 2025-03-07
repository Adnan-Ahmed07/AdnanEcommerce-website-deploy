import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) => {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`group relative cursor-pointer transition-all duration-300 ease-in-out 
        transform-gpu hover:z-10 hover:shadow-xl
        ${
          selectedId?._id === addressInfo?._id
            ? "border-4 border-red-900 hover:border-red-900"
            : "border-2 border-black hover:border-red-600"
        }
        hover:scale-[1.02] active:scale-100`}
    >
      {/* Hover message */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-green-600 text-white px-3 py-1 rounded-lg 
        text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 
        pointer-events-none shadow-md">
        Select me
      </div>

      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      
      <CardContent className="grid p-4 gap-4 relative z-0 bg-white dark:bg-gray-900 rounded-lg">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      
      <CardFooter className="p-3 flex justify-between relative z-0 bg-white dark:bg-gray-900 rounded-lg">
        <Button 
          variant="outline"
          className="text-black hover:bg-green-500 hover:text-white transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          className="hover:-translate-y-1 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;