import React from 'react'
import { HashLoader } from 'react-spinners'

const Loader = () => {
  return (
    <HashLoader color="#04e1ff" size={30} cssOverride={
        {
          position: "absolute",
          display: "block",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }
      } />
  )
}

export default Loader
