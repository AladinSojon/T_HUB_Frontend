import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import LoginSignUpService from '../services/LoginSignUpService';

const Login = () => {

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const changeUsernameOrEmailHandler = (event) => {
        setUsernameOrEmail(event.target.value);
    }

    const changePasswordHandler = (event) => {
        setPassword(event.target.value);
    }

    const postLogin = (e) => {
        e.preventDefault();
        let login = {usernameOrEmail: usernameOrEmail, password: password};

        console.log("hello " + usernameOrEmail);

        LoginSignUpService.addLogin(login).then(response => {
            localStorage.setItem('access_token', response.headers.authorization);
            localStorage.setItem('loggedIn', true);
            history.push('/item-list');
        });
    }

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className='card col-md-6 offset-md-3 offset-md-3'>
                        <h3 className='text-center'>Login</h3>
                        <div className='card-body'>
                            <form>
                                <div className='form-group'>
                                    <label>Username Or Email</label>
                                    <input placeholder='Username or Email' name='usernameOrEmail' className='form-control' value={usernameOrEmail} onChange={(event) => changeUsernameOrEmailHandler(event)}/>
                                </div>

                                <div className='form-group'>
                                    <label>Password</label>
                                    <input type="password" placeholder='Password' name='password' className='form-control' value={password} onChange={(event) => changePasswordHandler(event)}/>
                                </div>

                                <button className='btn btn-success' onClick={(event) => postLogin(event)}>Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;