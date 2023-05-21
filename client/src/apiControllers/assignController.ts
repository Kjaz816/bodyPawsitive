const deployed = false;

const url = deployed ? "https://bodypositive.onrender.com" : "";

export const getAssigns = async (username: string) => {
    const response = await fetch(url + `/api/assigns/getAssigns/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    return data;
}