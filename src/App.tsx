import { Button, Group, LoadingOverlay, Title } from '@mantine/core';
import RegisterForm from './components/RegisterForm';
import './App.css';
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import { logout, useWrappedAuthState } from './firebase/auth';
import Dashboard from './components/Dashboard';

enum PageDisplay {
  Login = "Login",
  Register = "Register",
  Home = "Home"
}

const displayButton = (value: PageDisplay) => {
  if (value == PageDisplay.Login) return PageDisplay.Register;
  if (value == PageDisplay.Register) return PageDisplay.Login;
  else return PageDisplay.Home;
}

function App() {
 const [pageDisplay, setPageDisplay] = useState(PageDisplay.Register);
 const [isLoading, setIsLoading] = useState(false);
 const [user, loading, error] = useWrappedAuthState();

 useEffect(() => {
  if (loading) {
    setIsLoading(true);
    return;
  }
  setIsLoading(false);
  if (user) {
    setPageDisplay(PageDisplay.Home);
    return;
  }
  setPageDisplay(PageDisplay.Login);
 }, [user, loading]);

 const toggleDisplay = () => {
  if (pageDisplay == PageDisplay.Register) {
    setPageDisplay(PageDisplay.Login);
    return;
  }
  if (pageDisplay == PageDisplay.Login) {
    setPageDisplay(PageDisplay.Register);
    return;
  }
 };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      <div className="App">
        <Group position="apart">
          <Title>MyApp</Title>
          {!user ? (
            <Button onClick={toggleDisplay}>
              {displayButton(pageDisplay)}
            </Button>
          ) : (
            <Button onClick={logout}>
              Logout
            </Button>
          )}
        </Group>
        {pageDisplay == PageDisplay.Register ? (
          <RegisterForm />
        ) : pageDisplay == PageDisplay.Login ? (
          <LoginForm />
        ) : (
          <Dashboard user={user}/>
        )}
      </div>
    </>
  );
}

export default App
