import React, { useState } from 'react'
import { Input } from '../../../components/admin'
import './LoginRegisterForm.css'
import { Link } from 'react-router-dom';

import axios from 'axios';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, TypeOf } from 'zod';

import { useDispatch } from 'react-redux';
import { setUser } from '../../../state/user/user.slice';
import { authSetUser } from '../../../api/auth.api';

import { useNavigate } from 'react-router-dom';

const createSessionSchema = z.object({
  emailOrUsername: z.string().min(1, { message: 'Email or Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const createUserSchema = z.object({
  username: z.string().min(4, 'Username cannot be shorter than 4 characters'),
  password: z.string().min(6, 'Password cannot be shorter than 6 characters'),
  passwordConfirmation: z.string(),
  email: z.string().email('Invalid email'),
  birth: z.coerce.date().max(eighteenYearsAgo, 'You must be at least 18 years old'),
  business: z.string().optional(),
  dni: z.string(),
  phone: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

// type CreateSessionInput = TypeOf<typeof createSessionSchema>
// type CreateUserInput = TypeOf<typeof createUserSchema>;

const LoginRegisterForm = ({ isLoginDefault = true }: { isLoginDefault?: boolean }) => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(isLoginDefault)
  const [loginError, setLoginError] = useState('' as string)

  const schema = isLogin ? createSessionSchema : createUserSchema;

  function handleOnToggle() { setIsLogin(!isLogin) };

  const {
    register, // We dont use this as we use custom Input component, we use setValue instead
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch()

  async function onSubmit(values: Object) {
    try {
      console.log('Form Values: ', values)
      if (isLogin) {
        // Login
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/sessions`, values, { withCredentials: true })
        if (response.status === 200) {
          dispatch(setUser(response.data.user))
          authSetUser(response.data.user)
        }
      } else {
        // Register
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/user`, values, { withCredentials: true })
        if (response.status === 200) {
          console.log('User created: ', response)
          dispatch(setUser(response.data))
          authSetUser(response.data)
        }
      }

      console.log('Redirecting...');
      navigate('/');
    } catch (e: any) {
      setLoginError(e.response.data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='LRform'>
        <span className='LRform-title'>{isLogin ? 'Iniciar sesión' : 'Únete a SoundPro'}</span>
        <p className='LRform-login-error'>{loginError}</p>
        <div className='LRform-input-container'>
          {isLogin &&
            <>
              <Input label='Usuario o correo' onChange={(e) => setValue('emailOrUsername', e.target.value)} />
              {errors.emailOrUsername?.message && <p className='LRform-input-error'>{errors.emailOrUsername?.message?.toString()}</p>}

              <Input label='Contraseña' onChange={(e) => setValue('password', e.target.value)} type='password' canShowPassword={true} />
              {errors.password?.message && <p className='LRform-input-error'>{errors.password?.message?.toString()}</p>}
            </>
          }
          {!isLogin &&
            <>
              <Input label='Usuario' onChange={(e) => setValue('username', e.target.value)} />
              {errors.username?.message && <p className='LRform-input-error'>{errors.username?.message?.toString()}</p>}

              <Input label='Contraseña' onChange={(e) => setValue('password', e.target.value)} type='password' canShowPassword={true} />
              {errors.password?.message && <p className='LRform-input-error'>{errors.password?.message?.toString()}</p>}

              <Input label='Repite tu contraseña' onChange={(e) => setValue('passwordConfirmation', e.target.value)} type='password' />
              {errors.passwordConfirmation?.message && <p className='LRform-input-error'>{errors.passwordConfirmation?.message?.toString()}</p>}

              <Input label='Correo electrónico' onChange={(e) => setValue('email', e.target.value)} />
              {errors.email?.message && <p className='LRform-input-error'>{errors.email?.message?.toString()}</p>}

              <Input label='Fecha de nacimiento' onChange={(e) => setValue('birth', e.target.value)} type='date' />
              {errors.birth?.message && <p className='LRform-input-error'>{errors.birth?.message?.toString()}</p>}

              <Input label='Empresa (opcional)' onChange={(e) => setValue('business', e.target.value)} />
              {errors.business?.message && <p className='LRform-input-error'>{errors.business?.message?.toString()}</p>}

              <Input label='DNI' onChange={(e) => setValue('dni', e.target.value)} />
              {errors.dni?.message && <p className='LRform-input-error'>{errors.dni?.message?.toString()}</p>}

              <Input label='Teléfono' onChange={(e) => setValue('phone', e.target.value)} />
              {errors.phone?.message && <p className='LRform-input-error'>{errors.phone?.message?.toString()}</p>}
            </>
          }
        </div>
        <button type='submit' className='LRform-submit hoverable'>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</button>
        <span className='LRform-toggle'>{isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <Link to={`/user/${isLogin ? 'register' : 'login'}`} onClick={handleOnToggle} className='LRform-toggle-button'>{isLogin ? 'Regístrate' : 'Iniciar sesión'}</Link>
        </span>
      </div>
    </form>
  )
}

export default LoginRegisterForm  