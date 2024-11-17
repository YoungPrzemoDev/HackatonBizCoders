export const fetchGPTResponse = async (description) => {
    const API_KEY = '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';
    const prompt = `Here is the description of a business project: "${description}". Please create a 3-4 sentence summary of the project that is concise and catchy, without adding any additional commentary.`;

    try {
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



export const fetchTagsResponse2 = async (description) => {
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

export const fetchTagsResponse3 = async (link) => {
    const API_KEY = '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'; // Wstaw tutaj swój rzeczywisty klucz API
    const prompt = `Here is the link to page with a scientific paper: "${link}". Return me only this three field , separated by commas, without any additional text:
    - An "industry" field with an array of three industries related to the paper.`;

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

export const fetchTagsResponse4 = async (link) => {
    const API_KEY = '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'; // Wstaw tutaj swój rzeczywisty klucz API
    const prompt = `Here is the link to page with a scientific paper: "${link}". Return me only a short description text:
    - A "description" field explaining the paper in simple terms.`;

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

export const fetchTagsResponse5 = async (link) => {
    const API_KEY = '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'; // Wstaw tutaj swój rzeczywisty klucz API
    const prompt = `Here is the link to page with a scientific paper: "${link}".
    Return me only this three field , separated by commas, without any additional text:
    - An "problems" field with an array of two key problems addressed to the world related to the paper.`;

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

export const fetchTagsResponse6 = async (prompt) => {
    const API_KEY = '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'; // Wstaw tutaj swój rzeczywisty klucz API
    try {
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
          max_tokens: 150
        })
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorDetails.error.message}`);
      }
  
      const dataResponse = await response.json();
      return dataResponse.choices[0].message.content.trim(); // Return the response
    } catch (error) {
      console.error("Error fetching GPT response:", error.message);
      return "An error occurred while connecting to GPT.";
    }
  };