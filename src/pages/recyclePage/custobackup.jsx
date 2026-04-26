import { useEffect, useState } from 'react';
import { apiGetProducts } from '../../services/product';
import VendorApiGet from "../recyclePage/VendorApi";

const VendorViewback = () => {
  const [Adverts, setAdverts] = useState([]);

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    try {
      setAdverts([]); 
      const response = await apiGetProducts();
      console.log("API Response:", response);
      const products = response.data || [];
      setAdverts(products);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  const handleProductDelete = (deletedId) => {
    setAdverts(Adverts.filter(advert => advert.id !== deletedId));
  };

 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> 
      {Adverts.length > 0 ? (
        Adverts.map((advert) => (
          <VendorApiGet
            key={advert.id} 
            id={advert.id} 
            title={advert.title}
            description={advert.description}
            category={advert.category}
            image={advert.image}
            price={advert.price}
            onDelete={handleProductDelete}  
            
          />
        ))
      ) : (
        <p>No products available</p>
        
      )}
     
    </div>
  );
};  

export default VendorViewback;