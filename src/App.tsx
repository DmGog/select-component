import './app.css';
import { useState } from 'react';
import { options } from './data/mock-data';
import { Select } from '@/components/select';

function App() {
  const [value, setValue] = useState<null | string>(null);

  return (
    <Select
      options={options}
      value={value}
      onChange={event => {
        setValue(event.target.value);
      }}
    />
  );
}

export default App;
