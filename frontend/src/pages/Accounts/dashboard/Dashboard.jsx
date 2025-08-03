import React from 'react'
import AccountLayout from '../AccountPage'
import Analystic from '../../../components/Analystic'
import Fatman from '../../../assets/images/worried-fat-man-pink-shirt-21119893.webp'
import { Link } from 'react-router-dom'


const Dashboard = () => {
  return (
    <AccountLayout>
      <div className="affiliate-data px-4 mb-10 ">

        
        <div className="affiliate-data px-4 mb-10 ">
          <h2 className="text-gradient3 font-black text-3xl text-center">10-Day Progress with Snapafit</h2>
          <div className="bg-purple-100 rounded-lg p-4 mb-6 mt-10">
            <div className="flex justify-between space-x-4">
              <div className="w-1/2">
                <img
                  src={Fatman}
                  alt="Before transformation"
                  className="w-full h-96 rounded-lg"
                />
              </div>
              <div className="w-1/2">
                <img
                  src={"https://images.pexels.com/photos/7298423/pexels-photo-7298423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                  alt="After transformation"
                  className="w-full h-96 rounded-lg"
                />
              </div>
            </div>
          </div>

          <Link to='/user_details' >
          <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition duration-300">
            Continue Your Transformation
          </button>
          </Link>

          <p className="text-gray-600 text-sm text-center mt-4">
            Congrats on your progress! Let's set new goals for the next phase of your journey
          </p>

        </div>

        <Analystic />
      </div>
    </AccountLayout>
  )
}

export default Dashboard