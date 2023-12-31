import axios from 'axios';
import { useFormik } from 'formik';
import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API } from '../../../Config';


function Login() {
    let navigation = useNavigate()

    //Alert function;
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    //Login Method;
    let login = useFormik({
        initialValues: {
            Email: "",
            Password: ""
        },
        validate: (value) => {
            let errors = {};
            //Password;
            if (value.Password.length < 6) {
                errors.Password = "Password Must be above Six Digit "
            }
            return errors
        },
        onSubmit: async (Login) => {
            try {
                let login = await axios.post(`${API.User}/Login`, Login);
                let watchman = login.data;
                if (watchman.token) {
                    Toast.fire({ icon: 'success', title: 'Signed in successfully' })
                    navigation('/Home');
                } else {
                    Toast.fire({ icon: 'warning', title: `${watchman.Message}` })
                }
            } catch (error) {
                Toast.fire({ icon: 'error', title: `${error.response.data.Message}` })
            }
        }
    })

    return (
        <>
            <div className="content fadeInDown">
                <div id="formContent">
                    {/* <!-- Tabs Titles --> */}

                    {/* <!-- Icon --> */}
                    <div className="fadeIn first">
                        <img src='https://santhosh-pizzas.netlify.app/static/media/san.3f49af824644098c3241.png' id="icon" alt="User Icon" />
                    </div>

                    {/* <!-- Login Form --> */}
                    <form onSubmit={login.handleSubmit}>
                        <input type="text" id="login" className="fadeIn second" placeholder="Email" value={login.values.Email} onChange={login.handleChange} name="Email" required />
                        <input type="password" id="password" className="fadeIn third" placeholder="password" value={login.values.Password} onChange={login.handleChange} name="Password" required />
                        <span className="text-warning">{login.errors.Password}</span>
                        <input type="submit" className="fadeIn fourth btn" id='butt' />
                    </form>

                    {/* <!-- Remind Passowrd --> */}
                    <div id="formFooter">
                        <a className="underlineHover" id='link' href="Recovery">Forgot Password?<Fragment>&nbsp;</Fragment><Fragment>&nbsp;</Fragment><Fragment>&nbsp;</Fragment><span className="text-black">or</span>
                            <Fragment>&nbsp;</Fragment><Fragment>&nbsp;</Fragment><Fragment>&nbsp;</Fragment></a>
                        <a className="underlineHover" id='click' href="Register">Create new Account</a>
                    </div>
                    <div className="text-center">
                        <br />
                        <strong>For Testing</strong>
                        <br /> <br />
                        <h6>Email: Santhosh@gmail.com</h6>
                        <h6>Password: Santhosh@1234</h6>
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login