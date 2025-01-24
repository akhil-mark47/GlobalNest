import React from 'react';

export const ConnectPage = () => {
  // Static user data
  const userData = {
    name: "Pettem Akhilvarsh",
    university: "Stanford University",
    job: "Software Engineer",
    expertise: ["React", "Node.js", "Python","Machine Learning"],
    bio: "Experienced software engineer with 5+ years in full-stack development"
  };

  // Static session rates
  const sessionRates = {
    thirtyMin: 25,
    oneHour: 45,
    twoHour: 80
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-8 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="bg-white rounded h-20 w-20" ><img src="src\utils\avatar.jpg" alt="" /></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">{userData.university}</p>
              <p className="text-gray-600">{userData.job}</p>
            </div>
          </div>
          <div className="mt-10">
            <p className="text-gray-700">{userData.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {userData.expertise.map((skill) => (
                <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Session Rates Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Mentorship Session Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <h4 className="font-medium">30 Minutes</h4>
              <p className="text-2xl font-bold text-indigo-600">${sessionRates.thirtyMin}</p>
              <button className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Book Session
              </button>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h4 className="font-medium">1 Hour</h4>
              <p className="text-2xl font-bold text-indigo-600">${sessionRates.oneHour}</p>
              <button className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Book Session
              </button>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <h4 className="font-medium">2 Hours</h4>
              <p className="text-2xl font-bold text-indigo-600">${sessionRates.twoHour}</p>
              <button className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
                Book Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;