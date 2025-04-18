/* eslint-disable no-unused-vars */
import React,{useContext,useState}from "react"
import {useNavigate} from 'react-router-dom';
import { assets } from '../assets/assets'
import AppContent from "../context/Appcontext";
import axios from 'axios';

const Resetpasswd = () => {

  const navigate=useNavigate();
  axios.defaults.withCredentials=true;//add cookies
  const {backendUrl}=useContext(AppContent);

  const [email,setEmail]=useState('');//state variable for entering email

  const [newPassword,setNewPassword]=useState('');//set state for password

  const[isEmailsent,setIsEmailsent]=useState('');
  const[otp,setOtp]=useState(0);
  const[isOtpsubmitted,setIsOtpsubmitted]=useState(false);

  const inputRefs=React.useRef([]);//To store the entered otp

  //handleDown handlePaste handleInput for OTP work
    //Automatically moving the cursor from one field to other
    const handleInput=async(e,index)=>{
      if(e.target.value.length>0 && index<inputRefs.current.length-1){
        inputRefs.current[index+1].focus();
      }
    }
  
    //Delete using backspace
    const handleDown=async(e,index)=>{
      if(e.key==='Backspace' && e.target.value==='' && index>0){
        inputRefs.current[index-1].focus();
      }
    }
  
    //Paste all 6-digits using ctrl+v
    const handlePaste=async(e)=>{
      const paste=e.clipboardData.getData('text');
      const pasteArray=paste.split('');//array of 6-digit mil gya
      pasteArray.forEach((char,index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value=char;//add each number to each input field
        }
      })
    }

    const onSubmitEmail=async(e)=>{
      e.preventDefault();
      try{
        const {data}=await axios.post(backendUrl+'/api/auth/send-reset-otp',{email});
        data.success?alert(data.message):alert("EMAIL is wrong");
        data.success && setIsEmailsent(true);
      }catch(error){
        alert("Error");
      }
    }

    const onSubmitOtp=async(e)=>{
      e.preventDefault();
      try{
        const otpArray=inputRefs.current.map(e=>e.value);//all input data will be added to otpArray
        setOtp(otpArray.join(''));
        setIsOtpsubmitted(true);
      }catch(error){
        alert(error.message);
      }
    }

    const onSubmitPassword=async(e)=>{
      e.preventDefault();
      try{
        const {data}=await axios.post(backendUrl+'/api/auth/reset-password',{email,otp,newPassword});
        data.success?alert(data.message):alert("Something Wrong");
        data.success && navigate('/Login')
      }catch(error){
        alert(error.message);
      }
    }

  return (
    <div className='flex items-center justify-center min-h-screen 
        bg-gradient-to-br from-blue-200 to-purple-400'>
          
          <img onClick={()=>navigate('/')} src={assets.logo} alt="" 
          className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

          {/* Email for reset password- Form-1 */}
          {!isEmailsent &&

            <form onSubmit ={onSubmitEmail} className="bg-slate-900 p-8 rounded-lgshadow-lg w-96 text-sm">
              <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
              <p className="text-center mb-6 text-indigo-300">Enter Your Email</p>

              <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">

                  <img src={assets.mail_icon} alt='' className="w-3 h-3"/>
                  {/* Email input field */}
                  <input type="email" placeholder="Email Id" 
                  className="bg-transparent outline-none text-white" 
                  value={email} onChange={e=>setEmail(e.target.value)} required/>

              </div>
              <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900
            text-white rounded-full mt-3'>
                Submit
              </button>
            </form>
          }


          {/* OTP input form Form-2 */}

          {!isOtpsubmitted && isEmailsent &&
            <form onSubmit={onSubmitOtp}className="bg-slate-900 p-8 rounded-lgshadow-lg w-96 text-sm">
              <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
              <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent on email</p>

              {/* OTP entering box */}
              
              <div className='flex justify-between mb-8' onPaste={handlePaste}>
                  {Array(6).fill(0).map((_,index)=>(
                      <input type='text' maxLength='1'key={index} required
                      className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-full'
                      ref={e=> inputRefs.current[index]=e}
                      onInput={(e)=>handleInput(e,index)}
                      onKeyDown={(e)=>handleDown(e,index)}/>
                  ))}
              </div>
              <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900
              text-white rounded-full'>
                Submit
              </button>
            </form>
          } 

          {/* Enter new password Form-3 */}

          {isOtpsubmitted && isEmailsent &&
            <form onSubmit={onSubmitPassword}className="bg-slate-900 p-8 rounded-lgshadow-lg w-96 text-sm">
                  <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
                  <p className="text-center mb-6 text-indigo-300">Enter New Password</p>

                  <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                      <img src={assets.lock_icon} alt='' className="w-3 h-3"/>
                      {/* In input we mention the value also  */}
                      <input type="password" placeholder="New Password" 
                      className="bg-transparent outline-none text-white" 
                      value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/>

                  </div>
                  <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900
                text-white rounded-full mt-3'>
                    Submit
                  </button>
                </form>
          }
    </div>
  )
}

export default Resetpasswd



