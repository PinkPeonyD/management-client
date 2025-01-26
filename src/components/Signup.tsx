import React, { useState } from "react";
import { strings } from "../utils/strings";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/store";
import { createUser } from "../redux/usersSlice";
import useAuth from "../hooks/useAuth";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const resultAction = await dispatch(
        createUser({
          email,
          name,
          password,
          role: "admin",
          status: "unblocked",
        })
      );

      if (createUser.fulfilled.match(resultAction)) {
        await login(email, password);
        navigate("/");
      } else if (createUser.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-body'>
              <h2 className='card-title text-center'>{strings.signup.title}</h2>
              {error && <div className='alert alert-danger'>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label'>
                    {strings.signup.emailLabel}
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    placeholder={strings.signup.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='name' className='form-label'>
                    Name
                  </label>
                  <input
                    type='text'
                    className='form-control'
                    id='name'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='password' className='form-label'>
                    Password
                  </label>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type='submit' className='btn btn-primary w-100'>
                  {strings.signup.signUpButton}
                </button>
              </form>
              <div className='mt-3 text-center'>
                <p>
                  {strings.signup.haveAccount}{" "}
                  <a href='/login'>{strings.signup.signInLink}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
