import AddPlantForm from "../../../components/Form/AddPlantForm";
import { imageUpload } from "../../../api/utils";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";

const AddPlant = () => {
  const { user } = useAuth();

  const [isUploading, setIsUploading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const form = e.target;
    const name = form?.name?.value;
    const category = form?.category?.value;
    const description = form?.description?.value;
    const price = form?.price?.value;
    const quantity = form?.quantity?.value;

    // image upload
    try {
      const image = form?.image?.files[0];
      const imageUrl = await imageUpload(image);

      const plantData = {
        name,
        category,
        description,
        price,
        quantity,
        image: imageUrl,
        seller: {
          name: user?.displayName,
          email: user?.email,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/add-plant`,
        plantData
      );
      console.log(data);

      toast.success("Plant data added successfully");
      form.reset();
    } catch (err) {
      console.log(err);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div>
      {/* Form */}
      <AddPlantForm
        handleFormSubmit={handleFormSubmit}
        isUploading={isUploading}
      />
    </div>
  );
};

export default AddPlant;
