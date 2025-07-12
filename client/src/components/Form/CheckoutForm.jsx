import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "./checkoutForm.css";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const CheckoutForm = ({ totalPrice, closeModal, orderedData, fetchPlant }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  //   secret
  const [clientSecret, setClientSecret] = useState("");

  // validate everything before clicking the pay now button
  useEffect(() => {
    const getClientSecret = async () => {
      // server request
      const { data } = await axiosSecure.post("/create-payment-intent", {
        quantity: orderedData?.quantity,
        plantId: orderedData?.plantId,
      });
      setClientSecret(data?.clientSecret);
    };

    getClientSecret();
  }, [axiosSecure, orderedData]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message);
      setProcessing(false);
      return;
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setCardError(null);
    }

    // payment receive :
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user?.displayName,
          email: user?.email,
        },
      },
    });

    if (result.error) {
      setCardError(result?.error?.message);
      return;
    }
    if (result?.paymentIntent?.status === "succeeded") {
      // save data in db
      orderedData.transactionId = result?.paymentIntent?.id;

      try {
        const { data } = await axiosSecure.post("/orders", orderedData);
        console.log(data);

        if (data?.insertedId) {
          toast.success("Order placed successfully");
        }

        // update quantity :
        const { data: result } = await axiosSecure.patch(
          `${import.meta.env.VITE_API_URL}/quantity-update/${
            orderedData.plantId
          }`,
          { quantityToUpdate: orderedData.quantity, status: "decrease" }
        );
        fetchPlant();
        console.log(result);
      } catch (error) {
        console.log(error);
      } finally {
        setProcessing(false);
        setCardError(null);
        closeModal();
      }
      // update the quantity of the product
    }

    console.log(result);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />

      {cardError && <p className="text-red-600 my-3">{cardError}</p>}

      <div className="flex justify-between items-center">
        <button
          className="btn btn-secondary"
          type="submit"
          disabled={!stripe || processing}
        >
          {processing ? <ClipLoader size={20} /> : `Pay $${totalPrice}`}
        </button>

        <button className="btn btn-warning" type="button" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
