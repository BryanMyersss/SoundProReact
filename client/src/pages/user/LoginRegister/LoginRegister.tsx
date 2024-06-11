import React from 'react'
import './LoginRegister.css'
import { LoginRegisterForm } from '../../../container'
import { Navbar } from '../../../components'

const LoginRegister = ({ isLoginDefault }: { isLoginDefault?: boolean }) => {
  return (
    <>
      <Navbar />
      <div className='LR_container'>
        <LoginRegisterForm isLoginDefault={isLoginDefault}/>
      </div>
    </>
  )
}

export default LoginRegister