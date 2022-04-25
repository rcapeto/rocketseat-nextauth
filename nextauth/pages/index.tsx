import type { NextPage } from 'next';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import styles from '../styles/login.module.css'

const Home: NextPage = () => {
  const [formState, setFormState] = useState({ email: 'raphaelcapeto@gmail.com', password: '123456' });

  const { signIn } = useAuth();

  const inputs = [
    {
      type: 'text', placeholder: 'E-mail', name: 'email', value: formState.email,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({...formState, email: e.target.value });
      }
    },
    {
      type: 'password', placeholder: 'Sua senha', name: 'password', value: formState.password,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        setFormState({...formState, password: e.target.value });
      }
    }
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await signIn(formState);
  }

  return(
    <div className={styles.page}>
      <form className={styles.container} onSubmit={handleSubmit}>
        {
          inputs.map((input, index) => (
            <input {...input} key={String(index)}/>
          ))
        }
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Home
