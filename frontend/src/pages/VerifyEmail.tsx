import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from 'react-hot-toast';
function VerifyEmail() {
  const [code, setCode] = useState<string[]>(["", "", "", "","",""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const {error,isLoading,verifyEmail} = useAuthStore();
  const navigate = useNavigate();
  const handleChange = (index:number,value:string) => {
      const newCode = [...code];
      if(value.length > 1 ){
            const pastedCode = value.slice(0,6).split(""); 
            // when user copy code from mail and pasted to the input
            // this pastedCode will create a array with 6 number
            for(let i = 0; i < pastedCode.length; i++){
              newCode[i] = pastedCode[i];
            }
            setCode(newCode);
            //Change focus on last non-empty input
            const lastFocusIndex = pastedCode.length - 1 == 5 ? 5: pastedCode.length 
            // when pasted code still lack some number it will focus the input next the latest input that contain num
            // when pasted code full it will focus on the last input
            inputRefs.current[lastFocusIndex].focus();

      }else{
        newCode[index] = value;
        setCode(newCode);
        if(value && index < 5){
          inputRefs.current[index + 1].focus();
        }
      }
  }
  const handleKeyDown = (index:number,e:React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'Backspace' && !code[index] && index > 0){
            inputRefs.current[index-1].focus();
      }
  }
  const handleSubmit = async (e?:FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const verifyCode = code.join("");
    console.log(verifyCode);
    try {
      await verifyEmail(verifyCode)
      navigate("/")
      toast.success("Email verify successfully!")
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(code.every((digit) => digit !== "")){
      handleSubmit()
    }
  },[code])
  return (
    <div className="max-w-md w-full bg-gray-800 opacity-70 backdrop-sepia-0 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 opacity-50 backdrop-sepia-0 backdrop-blur-xl p-8 rounded-2xl shadow-xl overflow-hidden"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from bg-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify your email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                type="text"
                key={index}
                ref={(el) => {if(el) inputRefs.current[index] = el}}
                maxLength={index !==0 ? 1 : 6}
                value={digit}
                onChange={(e) => handleChange(index,e.target.value)}
                onKeyDown={(e) => handleKeyDown(index,e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-500 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
          >
            {isLoading ?  <Loader className="w-6 h-6 animate-spin mx-auto"/> : "Verify"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
