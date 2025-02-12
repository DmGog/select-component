import './app.css';
import { Select } from '@/components/select/select';
import { useState } from 'react';
import { options } from '@/data/data';

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
