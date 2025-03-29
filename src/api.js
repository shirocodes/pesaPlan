        //handling all server comms via fetch API
//asynchronously fetch data from endpoints
const BASE_URL = "http://localhost:3000/";

export async function getData(endpoint) {
    try {
        const res = await fetch(`${BASE_URL}/${endpoint}`);
        if(!res.ok) throw new Error(`failed in fetching ${endpoint}: ${res.statusText}`)    
        return await res.json()
    } catch (error) {
        console.error("error fetching data:", error)
        return []
    }
    
}

//POST data > accepts item like budget 
//sends POST request > handle errors
export async function postData(endpoint, data) {
    try {
        const res = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        
        if (!res.ok) throw new Error(`failed post data to ${endpoint}`);
        return await res.json()
    } catch (error) {
        console.error("error in postData:", error)
        return null;
    }  
}

//updating existing data > PATCH requests > handle errors
export async function pathData(endpoint, id, updatedData) {
    try {
        const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
           method: "PATCH",
           headers:  {"Content-Type": "application/json"},
           body: JSON.stringify(updatedData)
        })
        if (!res.ok) throw new Error(`failed in updating ${endpoint} with ${id}`);
        return await res.json()
    } catch (error) {
        console.error("error in patchData:", error)
        return null;
    }     
}

//DELETE to remove unwanted items
export async function deleteData(item, id) {
    try {
        const res = await fetch(`${BASE_URL}/${item}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error(`Failed to delete ${item} with id ${id}`);

        return true; // Return true to indicate successful deletion
    } catch (error) {
        console.error("Error in deleteData:", error);
        return false;
    }  
}
