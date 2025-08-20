import { Link } from "react-router-dom";

const ProductCard = ({ id, name, image, price, onAddToCart }) => (
  <div className="cursor-pointer md:w-[300px] w-[45vw] ">
    <div
      className="flex flex-col p-3 border-gray-300 border w-1/1"
      key={id}
    >
      <Link to={`/productDetails/${id}`}>
        {image ? (
          <img
            src={image[0]}
            alt={name}
            className="object-contain h-60 w-full self-center"
          />
        ) : (
          <div className="h-60 bg-gray-200 w-full mb-2">No image</div>
        )}
        <p className="text-lg">{name}</p>
        <p className="font-semibold text-lg">₦ {parseInt(price).toLocaleString()}</p>
      </Link>
      <button
        className="bg-pink-200 w-full rounded py-1 mt-2 cursor-pointer hover:bg-pink-500 transition-all"
        onClick={() => onAddToCart(id)}
      >
        Add to cart
      </button>
    </div>
  </div>
);

export default ProductCard;
