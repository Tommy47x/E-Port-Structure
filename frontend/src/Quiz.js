import React, { useState } from 'react';

function MyComponent() {
    const [form, setForm] = useState({ question: "", answer: "" });
    const [dataToInsert, setDataToInsert] = useState(null);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleAddQuestion = () => {
        setDataToInsert(form);
        setForm({ question: "", answer: "" }); // Reset form
    };

    const handleInsert = async () => {
        const { question, answer } = dataToInsert;

        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question, answer }),
        });

        if (response.ok) {
            console.log('Data successfully inserted into the database');
        } else {
            console.error('Error inserting data into the database');
        }
    };

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="question" value={form.question} onChange={handleChange} />
                <input type="text" name="answer" value={form.answer} onChange={handleChange} />
                <button type="button" onClick={handleAddQuestion}>Add Question</button>
            </form>
            {dataToInsert && <button onClick={handleInsert}>Insert into Database</button>}
        </div>
    );
}

export default MyComponent;