export const fetchGPTResponseName = async (description) => {
    const API_KEY = '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';
    const prompt = `Here is the link for the business start-up project : "${description}". Please search the page given in the link. Create reasonably short description highliting the most important things and generate me ONLY name of this start-up. 1-2 words max
    `;
    console.log(description);
    try {
        console.log("link");
        console.log(description);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error details:', errorDetails);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices.length) {
            throw new Error("No choices found in GPT response");
        }

        // Poprawiono dostęp do odpowiedzi dla chat API
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error fetching GPT response:", error.message);
        return "An error occurred while connecting to GPT.";
    }
};



export const fetchTagsResponseDescription = async (description) => {
    const API_KEY = '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';
    const prompt = `Here is the link for the business start-up project: "${description}". Please search the page and generate a short description highlighting its most important aspects.`;

    try {
        console.log('Fetching short description for:', description);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300,
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
        }

        const data = await response.json();
        let shortDescription = data.choices[0]?.message?.content?.trim();

        // Flatten the description into a single string
        shortDescription = shortDescription.replace(/\n/g, ' '); // Replace all line breaks with spaces
        console.log('Cleaned short description:', shortDescription);

        return shortDescription; // Return as a single string
    } catch (error) {
        console.error('Error fetching GPT response for description:', error.message);
        return '';
    }
};




export const fetchTagsResponseIndustryTags = async (description) => {
    const API_KEY = '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'; // Wstaw tutaj swój rzeczywisty klucz API
    const prompt = `Here is the description of a business project: "${description}". Please provide 3-4 relevant tags for this project, such as 'biology', 'IT', etc., and only the tags, separated by commas, without any additional text.`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Poprawiono model na aktualnie dostępny
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 100
            })
        });
            console.log("essa");
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error details:', errorDetails);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices.length) {
            throw new Error("No choices found in GPT response");
        }

        // Poprawiono dostęp do odpowiedzi dla chat API
        const tagsString = data.choices[0].message.content.trim();
        return tagsString.split(',').map(tag => tag.trim());
    } catch (error) {
        console.error("Error fetching GPT response:", error.message);
        return "An error occurred while connecting to GPT.";
    }
};

export const fetchTagsResponseChallenges = async (description) => {
    const API_KEY = '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'; // Replace with your actual API key
    const prompt = `Here is the link for the business start-up project: "${description}". Please search the page given in the link. Identify challenges and main problems that the provided start-up addresses. Provide this as ongoing text without commas or arrays.`;

    try {
        console.log('Fetching challenges for:', description);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300, // Increase this if you expect longer text
            }),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error details:', errorDetails);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
        }

        const data = await response.json();
        let challengesText = data.choices[0]?.message?.content?.trim();

        // Flatten the challenges into a single string (remove newlines and excess whitespace)
        challengesText = challengesText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('Cleaned challenges text:', challengesText);

        return challengesText; // Return the challenges as a single clean string
    } catch (error) {
        console.error('Error fetching GPT response for challenges:', error.message);
        return '';
    }
};
