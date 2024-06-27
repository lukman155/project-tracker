import './App.scss';
import Register from './Pages/register';
import Login from './Pages/login';

function App() {
  return (
    <div className="App">
      <section className='register'>
          <Register />    
          <Login/>    
      </section>
    </div>
  );
}

export default App;
