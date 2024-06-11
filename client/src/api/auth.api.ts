import { getCookie, setCookie } from '../utils/cookies';
import axios from 'axios';

export function currentUser() {
  try {
    const user = getCookie('currentUser') as undefined | string;
    if (!user) return false;
    if (JSON.parse(user).noUserBlank) {
      return false;
    }
    return JSON.parse(user);
  } catch (error) {
    setCookie('currentUser', JSON.stringify({ noUserBlank: true }), 15);
    console.error('Error parsing user from cookie', error)
  }
}

export function needToFetchUser() {
  try {
    const user = getCookie('currentUser') as undefined | string;
    if (!user) return true;
    const userObj = JSON.parse(user);
    if (userObj.noUserBlank || userObj.username) return false;
    return true;
  } catch (error) {
    setCookie('currentUser', JSON.stringify({ noUserBlank: true }), 15);
    console.error('Error parsing user from cookie', error)
  }
}

export async function getCurrentUser() {
  try {
    const user = getCookie('currentUser') as string | undefined;

    if (user) {
      if (JSON.parse(user).noUserBlank) {
        console.log('No user logged in');
        return false;
      }
      return JSON.parse(user);
    }

    try {
      console.log('Fetching user data');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, { withCredentials: true });
      if (response.status === 200) {
        const userData = response.data;
        setCookie('currentUser', JSON.stringify(userData), 15);
        return userData;
      }
    } catch (error) {
      console.log('Either no user is logged or there has been an error', error);
      setCookie('currentUser', JSON.stringify({ noUserBlank: true }), 15);
      return false;
    }
  } catch (error) {
    console.error('Error getting current user', error);
    return false;
  }
}

export function authSetUser(user: Object) {
  try {
    setCookie('currentUser', JSON.stringify(user), 15)
  } catch (error) {
    console.error('Error setting user', error)
  }
}

export async function authLogout() {
  try {
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/sessions`, { withCredentials: true });
    if (response.status === 200) {
      console.log('Logged out');
    }
    setCookie('currentUser', JSON.stringify({ noUserBlank: true }), 15);
  } catch (error) {
    console.error('Error logging out', error)
  }
}
