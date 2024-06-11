import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { imageAssets } from '../../constants'
import { setNavbarMenuOpen } from '../../state/ui/ui.slice'
import { MdArrowDropDown } from "react-icons/md";

import { setUser } from '../../state/user/user.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../../state/store'
import { authLogout } from '../../api/auth.api'


import './Navbar.css'

const Navbar = ({searchBarOnChange} : {searchBarOnChange?: React.ChangeEventHandler<HTMLInputElement>}) => {

  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.user);
  const [isNavbarMenuOpen, setIsNavbarMenuOpen] = useState(false);

  function handleSetNavbarMenu(boolean: boolean) {
    dispatch(setNavbarMenuOpen(boolean))
    setIsNavbarMenuOpen(boolean)
  }

  function handleLogout() {
    authLogout();
    dispatch(setUser(null))
  }

  return (
    <nav className='navbar'>
      <img src={imageAssets.logo} alt="Logo" className='navbar_logo' />
      <input type="text" placeholder='Necesito un...' onChange={searchBarOnChange} />
      <Link to="/admin" className='navbar_main-link'>Inicio</Link>
      <Link to="/" className='navbar_main-link'>Alquila tu equipo</Link>
      <Link to="/" className='navbar_main-link'>Contacto</Link>
      <div className="navbar_account" onClick={() => { setIsNavbarMenuOpen(true) }} onMouseEnter={() => handleSetNavbarMenu(true)} onMouseLeave={() => { handleSetNavbarMenu(false) }}>
        <img src={imageAssets.Account} alt="account" className='navbar_account-icon' />
        <div className='navbar_account-text'>
          {user.currentUser ?
            <>
              <p>Hola {user.currentUser.username}!</p>
              <b>Pedidos / Ajustes <MdArrowDropDown className='navbar_account-text-dropdownIcon' /> </b>
            </>
            :
            <>
              <p>Bienvenido</p>
              <b>Identifícate / Regístrate <MdArrowDropDown className='navbar_account-text-dropdownIcon' /> </b>
            </>
          }
        </div>
        <div className={`navbar_account-dropdown ${isNavbarMenuOpen ? '' : 'closed'}`}>
          {user.currentUser ?
            <>
              <Link to="#">Pedidos</Link>
              <Link to="#">Ajustes</Link>
              <span onClick={handleLogout}>Cerrar sesión</span>
            </>
            :
            <>
              <Link to="/user/login">Iniciar sesión</Link>
              <Link to="/user/register">Registrarse</Link>
            </>
          }
        </div>
      </div>
      <img src={imageAssets.ShoppingCart} alt="shopping cart" className='navbar_shopping-cart' />
    </nav>
  )
}

export default Navbar