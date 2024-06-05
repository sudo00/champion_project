import axios from 'axios';

const getImage = () => {
    const formData = {
        prompt: positivePrompt,
        negative_prompt: negativePrompt,
        output_format: "webp"
    };

    axios.postForm(
        url = `https://api.stability.ai/v2beta/stable-image/generate/core`,
        data = axios.toFormData(formData, new FormData()),
        {
            validateStatus: undefined,
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                Accept: "image/*"
            },
        },
    ).then((response) => {
        if (response.status === 200) {
            var Buffer = require('buffer/').Buffer
            let base64String = Buffer.from(response.data).toString('base64');
            console.log(base64String)
           setImage(base64String)
        } else {
            //throw new Error(`${response.status}: ${response.data.toString()}`);
        }
    });
}