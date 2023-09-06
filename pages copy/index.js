import React, { Fragment, useEffect, useState } from 'react';
import { animate, stagger } from 'motion';

// import TheNewStackLogo from '../components/the-new-stack-logo';

const config = [
  {
    name: 'Nama Tamu',
    id: 'nama_tamu'
  },
  {
    name: 'Asal Tamu',
    id: 'asal_tamu'
  },
  {
    name: 'Jumlah Undangan',
    id: 'jumlah_undangan'
  },
  {
    name: 'Jumlah Datang',
    id: 'jumlah_datang'
  }
];

const Page = () => {
  const [guestList, setGuestList] = useState([]);

  const [formData, setFormData] = useState({
    id: -1,
    nama_tamu: '',
    asal_tamu: '',
    jumlah_datang: '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('submitted data');

    //  const handleClick = async (id) => {
    // setIsSubmitting(true);
    try {
      console.log(`form data ${JSON.stringify(formData)}`)

      const response = await fetch(`/api/create-vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log(response);
      // const result = await response.json();
      // setResults(result);
      // setIsSubmitting(false);
      // setHasVoted(true);
    } catch (error) {
      console.log(error);
      // setIsSubmitting(false);
      // setError({
      //     error: true,
      //     message: error.message
      // });
    }
    // +  };
  };

  useEffect(() => {
    fetch(`/api/populate-data`).then((response) => {
      if (!response.ok) {
        throw Error();
      }
      return response.json();
    }).then((result) => {
      setGuestList(result.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setFormData({ nama_tamu: inputValue, asal_tamu: '', jumlah_datang: '' });
    if (inputValue != '') {
      const newSuggestions = getSuggestions(inputValue);

      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestions = (inputValue) => {
    return guestList?.filter((suggestion) =>
      suggestion[1].toLowerCase().includes(inputValue.toLowerCase())

    );
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ id: suggestion[0], nama_tamu: suggestion[1], asal_tamu: suggestion[2] });
    setSuggestions([]);
  };

  return (
    <div>
      <h1>Guest Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="autocomplete">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={formData.nama_tamu}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestion-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion[1]}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label htmlFor="from">From:</label>
          <input
            type="text"
            id="from"
            value={formData.asal_tamu}
            onChange={(e) => setFormData({ ...formData, asal_tamu: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="numberOfGuests">Number of Guests:</label>
          <input
            type="number"
            id="numberOfGuests"
            value={formData.jumlah_datang}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_datang: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Page;
