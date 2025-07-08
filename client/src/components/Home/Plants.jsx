import Card from "./Card";
import Container from "../Shared/Container";
import { useLoaderData } from "react-router";
import EmptyState from "../Shared/EmptyState";

const Plants = () => {
  const plantsData = useLoaderData();
  console.log(plantsData);
  return (
    <Container>
      {plantsData.length ? (
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {plantsData.map((plant) => (
            <Card key={plant._id} plant={plant} />
          ))}
        </div>
      ) : (
        <div>
          <EmptyState
            message={"No plant data available right now !"}
          ></EmptyState>
        </div>
      )}
    </Container>
  );
};

export default Plants;
