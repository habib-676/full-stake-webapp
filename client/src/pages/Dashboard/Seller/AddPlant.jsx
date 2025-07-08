import AddPlantForm from "../../../components/Form/AddPlantForm";
import { imageUpload } from "../../../api/utils";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";

const AddPlant = () => {
  const { user } = useAuth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form?.name?.value;
    const category = form?.category?.value;
    const description = form?.description?.value;
    const price = form?.price?.value;
    const quantity = form?.quantity?.value;

    // image upload
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
  };
  return (
    <div>
      {/* Form */}
      <AddPlantForm handleFormSubmit={handleFormSubmit} />
    </div>
  );
};

export default AddPlant;
