import './app.css';
import { useState } from 'react';

import { Select } from '@/components/select';
import { options } from '@/mock-options/mock-options';

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
