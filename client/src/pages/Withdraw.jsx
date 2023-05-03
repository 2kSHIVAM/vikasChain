import React, { useState } from 'react'
import { CustomButton } from '../components'
import { useStateContext } from '../context';
import { thirdweb } from '../assets';
import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react'
import fs from 'fs'
import eth_image from './lottiefiles/Etherium.json'
import drag_image from './lottiefiles/drag_drop.json'
import uploading from './lottiefiles/uploading.json'
import sand_timer from './lottiefiles/sand_timer.json'
import axios from 'axios';



// import Dropzone from 'react-dropzone'
import { Web3Storage, getFilesFromPath } from 'web3.storage'
// import { div } from '@tensorflow/tfjs';
const Withdraw = () => {
  // const { state } = useLocation();
  const navigate=useNavigate();
  const {state} = useLocation();
  const { withdraw,getWithdrawFlag, addProof } = useStateContext();
  const [amount, setAmount] = useState('');
  const [files,setFiles]=useState([])
  const [isLoading,setIsLoading]=useState(false)


  const handleWithdraw = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/')
    }, 30000);
    await withdraw(state.id); 
    setIsLoading(false);
    navigate('/')
    
  }

  const handleAlert=(alertMsg)=>{
    alert(alertMsg);

    // wait for 5 seconds before navigating to the dashboard
    setTimeout(() => {
    }, 5000);
  
  }
  const handlePrediction=async()=>
  {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      // Only add the file to the FormData if it's an image
      if (file.type.includes('image')) {
        formData.append('file', file);
      }
    }
    var predict;
    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData);
      // pathNew=response.data.newResult
      // console.log((pathNew)); // Get the path of the uploaded image from the response
      console.log(response.data.predictions);
      predict=response.data.predictions
      // console.log(response.data.predictions)
    } catch (error) {
      console.error('Error:', error);
    }
    return predict;
  }
  const handleClick=async()=>{
    setIsLoading(true)
    // console.log(files)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk5ZDE1Njg1RDJFQzIwMzgzNzY5NWU5OTFBMzUxODI2NzUxNjcxRDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODEyMzU2MzQ0NjUsIm5hbWUiOiJjcm93ZGZ1bmRpbmcifQ.vMkR2WJWmsRQ8ARfe864kqMFH7R4tRgULQ7vkOkStV8"
    const storage = new Web3Storage({ token })
    const prediction = await handlePrediction();

    if(prediction)
    {
      // const cid = await storage.put(files)
      // console.log(typeof cid)
      // const data= await addProof(state.id,cid)
      
      console.log(files)
      const errorMsg="Image Successfully uploaded..."
      handleAlert(errorMsg)
    }
    else{
      const errorMsg="False image provided and now redirecting to dashboard..."
      handleAlert(errorMsg)
    }
    setIsLoading(false)
    navigate('/')
    }
  const handleChange=(event)=>{
    if(event.target.files)
    setFiles(event.target.files)
  }
  if(state.choice==false){
    
      return (
        <div>
          
          {isLoading && <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.9)] flex items-center justify-center flex-col">
          <div className='w-[300px] ml-[100px]'>
            <Lottie animationData={uploading}/>
             </div>
            </div>}
          
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
        </div>
      )
  

  }
  else if(state.choice==true){
    return (
      <div>
        {isLoading && <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.9)] flex items-center justify-center flex-col">
          <div className='w-[300px] ml-[100px]'>
            <Lottie animationData={sand_timer}/>
             </div>
            </div>}
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
      </div>
      
    )
  }

}

export default Withdraw









