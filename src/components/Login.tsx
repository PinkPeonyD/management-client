import React, { useState } from "react";
import { strings } from "../utils/strings";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError(
        "Invalid email or password. Please check your credentials or sign up."
      );
    }
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-body'>
              <h2 className='card-title text-center'>{strings.login.title}</h2>
              {error && <div className='alert alert-danger'>{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label'>
                    {strings.login.emailLabel}
                  </label>
                  <input
                    type='email'
                    className='form-control'
                    id='email'
                    placeholder={strings.login.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='password' className='form-label'>
                    {strings.login.passwordLabel}
                  </label>
                  <input
                    type='password'
                    className='form-control'
                    id='password'
                    placeholder={strings.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type='submit' className='btn btn-primary w-100'>
                  {strings.login.signInButton}
                </button>
              </form>
              <div className='mt-3 text-center'>
                <p>
                  {strings.login.noAccount}{" "}
                  <a href='/signup'>{strings.login.signUpLink}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
