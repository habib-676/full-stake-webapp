import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../Form/CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const PurchaseModal = ({ closeModal, isOpen, plant }) => {
  const { _id, name, category, price, quantity, seller, image } = plant || {};
  const { user } = useAuth();

  // order data
  const [orderedData, setOrderedData] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    seller,
    plantId: _id,
    quantity: 1,
    price: price,
    plantName: name,
    plantCategory: category,
    plantImage: image,
  });

  useEffect(() => {
    setOrderedData((prev) => {
      return {
        ...prev,
        customer: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      };
    });
  }, [user]);
  // Total Price Calculation
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);

  const handleQuantity = (value) => {
    const currentQuantity = parseInt(value);
    if (currentQuantity > quantity)
      return toast.error(`You can not purchase more than ${quantity}!`);

    const calculatedPrice = currentQuantity * price;
    setSelectedQuantity(currentQuantity);
    setTotalPrice(calculatedPrice);
    setOrderedData((prev) => {
      return {
        ...prev,
        price: calculatedPrice,
        quantity: currentQuantity,
      };
    });
  };

  console.log(orderedData);

  // const handleOrder = () => {
  //   console.log(orderedData);
  // };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={closeModal}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl"
          >
            <DialogTitle
              as="h3"
              className="text-lg font-medium text-center leading-6 text-gray-900"
            >
              Review Info Before Purchase
            </DialogTitle>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Plant: {name}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Category: {category}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Customer: {user?.displayName}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">Price per tree: $ {price}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Available Quantity: {quantity}
              </p>
            </div>

            <hr className="my-5 border-3" />

            <p>Order info : </p>
            <div className="mt-2">
              <input
                value={selectedQuantity}
                onChange={(e) => handleQuantity(e.target.value)}
                type="number"
                min={1}
                max={quantity}
                className="border px-3 py-1"
              />
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Select Quantity: {selectedQuantity}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Total price: ${totalPrice}
              </p>
            </div>

            {/* <div className="mt-2">
              <button onClick={handleOrder} className="btn btn-primary">
                Order
              </button>
            </div> */}

            {/* stipe checkout form */}
            <Elements stripe={stripePromise}>
              <CheckoutForm totalPrice={totalPrice} closeModal={closeModal} />
            </Elements>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
