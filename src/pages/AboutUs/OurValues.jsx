import { RiFocusLine } from 'react-icons/ri';


function CoreValues() {
    return (
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-4">Our Core Values</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-12"></div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 text-left">
          
            <div className="flex items-start">
              <RiFocusLine className="text-green-700 text-3xl mr-4" />
              <div>
                <h3 className="text-2xl font-semibold text-green-700">Godliness & Fellowship</h3>
                <p className="text-black mt-2">
                  Embracing spiritual values and fostering a sense of unity among our team and community. The story of tomorrow is ours to write.
                </p>
              </div>
            </div>
            
           
            <div className="flex items-start">
              <RiFocusLine className="text-green-700 text-3xl mr-4" />
              <div>
                <h3 className="text-2xl font-semibold text-green-700">Service Excellence</h3>
                <p className="text-black mt-2">
                  Committed to delivering waste management solutions with the highest level of quality and professionalism.
                </p>
              </div>
            </div>
  
            <div className="flex items-start">
              <RiFocusLine className="text-green-700 text-3xl mr-4" />
              <div>
                <h3 className="text-2xl font-semibold text-green-700">Stewardship</h3>
                <p className="text-black mt-2">
                  Responsible management of resources and the environment, ensuring sustainability for future generations.
                </p>
              </div>
            </div>
  
            <div className="flex items-start">
              <RiFocusLine className="text-green-700 text-3xl mr-4" />
              <div>
                <h3 className="text-2xl font-semibold text-green-700">People Focused</h3>
                <p className="text-black mt-2">
                  Prioritizing the well-being and satisfaction of our customers, employees, and communities.
                </p>
              </div>
            </div>
  
            <div className="flex items-start">
              <RiFocusLine className="text-green-700 text-3xl mr-4" />
              <div>
                <h3 className="text-2xl font-semibold text-green-700">Teamwork</h3>
                <p className="text-black mt-2">
                  Collaborating seamlessly to achieve our waste management goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default CoreValues;
  