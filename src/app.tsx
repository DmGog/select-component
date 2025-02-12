import './app.css';
import { Select } from '@/components/select/select';
import { useState } from 'react';
import { options } from '@/data/data';

function App() {
  const [value, setValue] = useState('');
  const handleChange = (newValue: string) => {
    setValue(newValue);
  };
  return <Select options={options} value={value} onChange={handleChange} />;
}

export default App;
