import React, { useState } from 'react'
import { CustomButton } from '../components'
import { useStateContext } from '../context';
import { thirdweb } from '../assets';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react'

import eth_image from './Etherium.json'
import drag_image from './drag_drop.json'

// import Dropzone from 'react-dropzone'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
const Withdraw = () => {
  // const { state } = useLocation();
  const navigate=useNavigate();
  const {state} = useLocation();
  const { withdraw,getWithdrawFlag, addProof } = useStateContext();
  const [amount, setAmount] = useState('');
  const [files,setFiles]=useState([])

  const handleWithdraw = async () => {

    await withdraw(state.id); 

    navigate('/')
    // setIsLoading(false);
  }

  const handleClick=async()=>{
    console.log(files)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk5ZDE1Njg1RDJFQzIwMzgzNzY5NWU5OTFBMzUxODI2NzUxNjcxRDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODEyMzU2MzQ0NjUsIm5hbWUiOiJjcm93ZGZ1bmRpbmcifQ.vMkR2WJWmsRQ8ARfe864kqMFH7R4tRgULQ7vkOkStV8"
    const storage = new Web3Storage({ token })

    const cid = await storage.put(files)
    // console.log(typeof cid)
    const data= await addProof(state.id,cid)
    navigate('/')
  }
  const handleChange=(event)=>{
    if(event.target.files)
    setFiles(event.target.files)
  }
  if(state.choice==false){
    return (
      <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
        <div className="flex flex-col justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <div class="flex flex-col items-center justify-center w-full">

  
              <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className='w-[300px] mt-[80px] mb-[2px]'>
                    <Lottie animationData={drag_image}/>
                  </div>
                      <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" type="file" class="hidden" onChange={handleChange} multiple />
              </label>
              <div className="flex justify-center items-center mt-[120px]">
            <CustomButton
              btnType="submit"
              title="Upload"
              handleClick={handleClick}
              styles="bg-[#1dc071]"
              
            />
          </div>
          
          </div> 
        </div>
        
      </div>
    )
  }
  else if(state.choice==true){
    return (
      <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
        <div className="flex flex-col justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <div class="flex flex-col items-center justify-center w-full">
          <div>
            <Lottie animationData={eth_image}/>
          </div>
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Withdraw from Here</h1>
              <div className="flex justify-center items-center mt-[40px]">
              <CustomButton 
                btnType="button"
                title="Withdraw"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleWithdraw}
              />
          </div>
          </div> 
        </div>
      </div>
    )

    // <div className="flex-1">
    //       <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>   

    //       <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
    //         <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
    //           Fund the campaign
    //         </p>
    //         <div className="mt-[30px]">
    //           <input 
    //             type="number"
    //             placeholder="ETH 0.1"
    //             step="0.01"
    //             className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
    //           />

    //           <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
    //             <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
    //             <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
    //           </div>

    //           <CustomButton 
    //             btnType="button"
    //             title="Fund Campaign"
    //             styles="w-full bg-[#8c6dfd]"
    //             handleClick={handleWithdraw}
    //           />
    //         </div>
    //       </div>
    //     </div>  
        }

}

export default Withdraw









