import image9 from '../../assets/images/image9.png'

const TrashCanPlacement = () => {
  return (
    <section className="bg-white py-32 px-5 text-center">
      {/* <h2 className="text-lg text-green-700 font-semibold uppercase">
        Waste Connections
      </h2> */}
      <h1 className="text-4xl font-bold text-green-700 my-4">
        The Placement of Your Trash Can Matters
      </h1>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
        By positioning your trash can correctly, you can ensure efficient
        collection of your garbage, recyclables, and yard waste.
      </p>
      <p className="text-md font-semibold text-gray-900 max-w-3xl mx-auto">
        Most collection trucks are armed with an automated electronic arm that
        grabs and empties the bin. This efficient process streamlines collection
        and prevents potential injuries.
      </p>
      
     
      <div className="mt-10">
        <img
          src={image9} 
          alt="Trash Can Placement Guide"
          className="mx-auto"
        />
      </div>
    </section>
  );
};

export default TrashCanPlacement;
